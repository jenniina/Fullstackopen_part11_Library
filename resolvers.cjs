const { AuthenticationError, ApolloError } = require('apollo-server-core')
const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const bcrypt = require('bcryptjs')
const config = require('./utils/config')

const tester = '64673513aaa627ac7b5a37ec'
const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    allBooks: async (_root, args) => {
      try {
        const orderBy = args.orderBy || 'title'
        const orderDirection = args.orderDirection || 1
        //const options = { sort: [['author.surname', orderDirection]] }
        if (args.author) {
          const author = await Author.findOne({ name: args.author })
          if (author) {
            if (args.genre && orderBy === 'title') {
              return await Book.find({
                author: author.id,
                genres: { $in: [args.genre] },
              })
                .sort({ title: orderDirection })
                .populate('author')
            } else if (orderBy === 'published') {
              return await Book.find({
                author: author.id,
                genres: { $in: [args.genre] },
              })
                .populate('author')
                .sort({ published: orderDirection })
            } else return await Book.find({ author: author.id }).populate('author')
          }
        }

        if (args.genre) {
          if (orderBy === 'title') {
            return await Book.find({ genres: { $in: [args.genre] } })
              .sort({ title: orderDirection })
              .populate('author')
          } else if (orderBy === 'published') {
            return await Book.find({ genres: { $in: [args.genre] } })
              .populate('author')
              .sort({ published: orderDirection })
          } else await Book.find({ genres: { $in: [args.genre] } }).populate('author')
        }

        if (orderBy === 'title') {
          return Book.find({}).sort({ title: orderDirection }).populate('author')
        } else if (orderBy === 'published') {
          return Book.find({}).populate('author').sort({ published: orderDirection })
        } else {
          // return Book.find({}).populate({
          //   path: 'author',
          //   select: 'surname name',
          //   //options: options,
          // })
          return Book.find({}).populate('author')
        }
      } catch (error) {
        throw new ApolloError('Error fetching books: ', error.message)
      }
    },
    findBook: async (_root, args) => {
      try {
        if (args.author) {
          const author = await Author.findOne({ name: args.author })
          if (author) {
            if (args.genre) {
              return await Book.find({
                author: author.id,
                genres: { $in: [args.genre] },
              }).populate('author')
            }
            return await Book.find({ author: author.id }).populate('author')
          } else return null
        }

        if (args.genre) {
          return Book.find({ genres: { $in: [args.genre] } }).populate('author')
        }

        if (args.title) {
          return Book.findOne({ title: args.title }).populate('author')
        }

        return Book.find({}).populate('author')
      } catch (error) {
        throw new ApolloError('Error fetching book: ', error.message)
      }
    },

    authorCount: () => Author.collection.countDocuments(),
    allAuthors: async (_root, args) => {
      try {
        const orderBy = args.orderBy || 'surname'
        const orderDirection = args.orderDirection || 1
        if (orderBy === 'surname') {
          return await Author.find({})
            .sort({ surname: orderDirection })
            .populate('bookCount')
        } else if (orderBy === 'born') {
          return await Author.find({})
            .sort({ born: orderDirection })
            .populate('bookCount')
        } //else return await Author.find({}).populate('bookCount')
        else {
          // const author = await Author.find({}).populate('bookCount').exec()
          // return [...author].sort((a, b) => a.bookCount - b.bookCount)
          return await Author.find({}).populate('bookCount').exec()
        }
      } catch (error) {
        throw new ApolloError('Error fetching authors: ', error.message)
      }
    },
    //allUsers: async () => await User.find({}).populate('books'),
    allUsers: async (_root, args) => {
      try {
        const orderBy = args.orderBy || 'username'
        const orderDirection = args.orderDirection || 1
        if (args.id) {
          return User.find({ id: args.id })
            .populate({
              path: 'books',
              select: 'id title author',
              populate: [{ path: 'author' }],
            })
            .exec()
        } else if (orderBy === 'username') {
          return User.find({})
            .sort({ username: orderDirection })
            .populate({
              path: 'books',
              select: 'id title author',
              populate: [{ path: 'author' }],
            })
        } else if (orderBy === 'favoriteGenre') {
          return User.find({})
            .sort({ favoriteGenre: orderDirection })
            .populate({
              path: 'books',
              select: 'id title author',
              populate: [{ path: 'author' }],
            })
        } else
          return User.find({}).populate({
            path: 'books',
            select: 'id title author',
            populate: [{ path: 'author' }],
          })
      } catch (error) {
        throw new ApolloError('Error fetching users: ', error.message)
      }
    },
    findAuthor: async (root) => {
      try {
        await Author.findOne({ name: root.name })
      } catch (error) {
        throw new ApolloError('Error fetching author: ', error.message)
      }
    },
    findUser: async (root) => {
      try {
        await User.findById(root)
      } catch (error) {
        throw new ApolloError('Error fetching user: ', error.message)
      }
    },
    me: (_root, _args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      try {
        const author = await Author.findOne({ name: root.name }).populate('bookCount')
        const books = await Book.find({ author: author.id })
        return books?.length
      } catch (error) {
        throw new ApolloError('Error fetching book count: ', error.message)
      }
    },
  },

  Mutation: {
    createBook: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser || currentUser.id === tester) {
        throw new AuthenticationError('Please log in')
      }
      const book = await Book.findOne({ title: args.title })
      const author = await Author.findOne({ name: args.author })

      if (!args.title || !args.author || !args.published || args.genres.length === 0) {
        throw new GraphQLError('Please fill in all the fields', {
          code: 'BAD_USER_INPUT',
        })
      } else if (args.title.length < 3) {
        throw new GraphQLError('Title too short', {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.title,
        })
      } else if (book) {
        throw new GraphQLError('Book already added', {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.title,
        })
      }

      if (!author) {
        const newAuthor = new Author({ name: args.author, surname: args.surname })
        try {
          await newAuthor.save()
        } catch (error) {
          throw new GraphQLError(error.message, {
            invalidArgs: args,
          })
        }
      }
      const foundAuthor = await Author.findOne({ name: args.author })
      const newBook = new Book({
        ...args,
        author: foundAuthor.id,
        user: currentUser._id,
      })

      try {
        await User.findOneAndUpdate(
          { _id: currentUser._id },
          {
            $push: {
              books: newBook._id,
            },
          },
          { new: true, runValidators: true, context: 'query' }
        )
      } catch (error) {
        throw new GraphQLError(error.message)
      }

      try {
        await newBook.save()
        pubsub.publish('BOOK_ADDED', {
          bookAdded: newBook.populate('author'),
        })

        return newBook.populate('author')
      } catch (error) {
        throw new GraphQLError(error.message)
      }
    },

    editAuthorBornYear: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('Please log in')
      }
      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      } else {
        author.born = args.setBornTo
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError(error.message)
        }
      }

      return author
    },
    editUser: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser || currentUser.id === tester) {
        throw new AuthenticationError('Please log in')
      }
      try {
        if (args.setGenre)
          await User.findByIdAndUpdate(args.id, { favoriteGenre: args.setGenre })
        if (args.setUsername)
          await User.findByIdAndUpdate(args.id, { username: args.setUsername })
        if (args.setPassword) {
          const passwordHashh = await bcrypt.hash(args.setPassword, 10)
          await User.findByIdAndUpdate(args.id, { passwordHash: passwordHashh })
        }
      } catch (error) {
        throw new GraphQLError(error.message)
      }
    },
    createUser: async (_root, args, context) => {
      const currentUser = context.currentUser
      const AUTH = config.AUTH
      if (
        !args.authorization ||
        AUTH !== args.authorization ||
        (currentUser && currentUser.id === tester)
      ) {
        throw new AuthenticationError('Wrong credentials')
      }
      const user = await User.findOne({ username: args.username })
      const passwordHashh = await bcrypt.hash(args.passwordHash, 10)
      const newUser = new User({
        ...args,
        passwordHash: passwordHashh,
      })
      if (user) {
        throw new GraphQLError('Username already taken', {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.username,
        })
      } else
        return newUser.save().catch((error) => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          })
        })
    },
    login: async (_root, args) => {
      const user = await User.findOne({ username: args.username })
      const correctPassword =
        user === null || user === undefined
          ? false
          : await bcrypt.compare(args.password, user.passwordHash)
      if (!user || !correctPassword) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        user: user.id,
        id: user.id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    deleteUser: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser || currentUser.id === tester) {
        throw new AuthenticationError('Please log in')
      }
      await User.deleteOne({ username: args.username }).catch(function (error) {
        // eslint-disable-next-line no-console
        console.error(JSON.stringify(error, null, 2)) // Failure
      })
    },
    deleteBook: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser || currentUser.id === tester) {
        throw new AuthenticationError('Please log in')
      }
      if (args.id)
        await Book.deleteOne({ _id: args.id })
          .then(() =>
            User.updateOne(
              { _id: currentUser._id },
              {
                $pullAll: {
                  books: args.id,
                },
              }
            )
          )
          .catch(function (error) {
            // eslint-disable-next-line no-console
            console.error(JSON.stringify(error, null, 2)) // Failure
          })
      //for cypress:
      if (args.title) {
        await Book.findOneAndDelete({ title: args.title })
      }
    },
    deleteAuthor: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser || currentUser.id === tester) {
        throw new AuthenticationError('Please log in')
      }
      await Author.deleteOne({ name: args.name }).catch(function (error) {
        // eslint-disable-next-line no-console
        console.error(JSON.stringify(error, null, 2)) // Failure
      })
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
