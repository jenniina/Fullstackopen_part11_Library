const { AuthenticationError } = require('apollo-server-core')
const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const bcrypt = require('bcryptjs')

const tester = '64673513aaa627ac7b5a37ec'
const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const orderBy = args.orderBy
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          if (args.genre) {
            return await Book.find({
              author: author.id,
              genres: { $in: [args.genre] },
            })
              .sort({ orderBy: args.orderDirection })
              .populate('author')
          }
          return await Book.find({ author: author.id })
            .sort({ orderBy: args.orderDirection })
            .populate('author')
        } else return null
      }

      if (args.genre) {
        return await Book.find({ genres: { $in: [args.genre] } })
          .sort({ orderBy: args.orderDirection })
          .populate('author')
      }

      if (args.limit) {
        return Book.find({}).sort({ orderBy: args.orderDirection }).populate('author')
      }

      return Book.find({}).sort({ orderBy: args.orderDirection }).populate('author')
    },
    findBook: async (_root, args) => {
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
    },

    authorCount: () => Author.collection.countDocuments(),
    allAuthors: async () => await Author.find({}).populate('bookCount'),
    //allUsers: async () => await User.find({}).populate('books'),
    allUsers: async (root, args) => {
      if (args.id) {
        return User.find({ id: args.id })
          .populate({
            path: 'books',
            select: 'id title author',
            populate: [{ path: 'author' }],
          })
          .exec()
      }
      return User.find({}).populate({
        path: 'books',
        select: 'id title author',
        populate: [{ path: 'author' }],
      })
    },
    findAuthor: async (root) => await Author.findOne({ name: root.name }),
    findUser: async (root) => await User.findById(root),
    me: (_root, _args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name }).populate('bookCount')
      const books = await Book.find({ author: author.id })
      return books.length
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
        const newAuthor = new Author({ name: args.author })
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
              books: newBook,
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
        await author.save()
      }

      return author
    },
    editUser: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser || currentUser.id === tester) {
        throw new AuthenticationError('Please log in')
      }
      if (args.setGenre)
        await User.findByIdAndUpdate(args.id, { favoriteGenre: args.setGenre })
      if (args.setUsername)
        await User.findByIdAndUpdate(args.id, { username: args.setUsername })
      if (args.setPassword) {
        const passwordHashh = await bcrypt.hash(args.setPassword, 10)
        await User.findByIdAndUpdate(args.id, { passwordHash: passwordHashh })
      }
    },
    createUser: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser || currentUser.id === tester) {
        throw new AuthenticationError('Please log in')
      }
      const user = await User.findOne({ id: args.username })
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
        console.log(JSON.stringify(error, null, 2)) // Failure
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
            console.log(JSON.stringify(error, null, 2)) // Failure
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
        console.log(JSON.stringify(error, null, 2)) // Failure
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
