const { AuthenticationError } = require('apollo-server-core')
const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const bcrypt = require('bcryptjs')

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    allBooks: async (_root, args) => {
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

      return Book.find({}).populate('author')
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

      return Book.find({}).populate('author')
    },

    authorCount: () => Author.collection.countDocuments(),
    allAuthors: async () => await Author.find({}).populate('bookCount'),
    allUsers: async () => await User.find({}).populate('books'),
    findAuthor: async (root) => await Author.findOne({ name: root.name }),
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
    addBook: async (_root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('Please log in')
      }
      const book = await Book.findOne({ title: args.title })
      const author = await Author.findOne({ name: args.author })

      if (!args.title || !args.author || !args.published || !args.genres) {
        throw new GraphQLError('Please fill in all the fields', {
          code: 'BAD_USER_INPUT',
          invalidArgs: args,
        })
      } else if (args.title.length < 3) {
        throw new GraphQLError('Title too short', {
          code: 'BAD_USER_INPUT',
          invalidArgs: args,
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
        author: foundAuthor._id,
        user: args.user,
      })

      await User.findOneAndUpdate(
        { _id: currentUser._id },
        {
          $push: {
            books: newBook,
          },
        },
        { new: true, runValidators: true, context: 'query' }
      )
      try {
        await newBook.save()
        pubsub.publish('BOOK_ADDED', {
          bookAdded: newBook.populate('author'),
        })

        return newBook.populate('author')
      } catch (error) {
        throw new GraphQLError(error.message, {
          invalidArgs: args,
        })
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
    createUser: async (_root, args) => {
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
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    deleteUser: async (_root, args) => {
      await User.deleteOne({ username: args.username })
        .then(function () {
          return { value: 'User deleted' }
        })
        .catch(function (error) {
          console.log(error) // Failure
          return { value: 'Could not remove the user' }
        })
    },
    deleteBook: async (_root, args) => {
      await Book.deleteOne({ title: args.title })
        .then(function () {
          return { value: 'Book deleted' }
        })
        .catch(function (error) {
          console.log(error) // Failure
          return { value: 'Could not remove the book' }
        })
    },
    deleteAuthor: async (_root, args) => {
      await Author.deleteOne({ name: args.name })
        .then(function () {
          return { value: 'Author deleted' }
        })
        .catch(function (error) {
          console.log(error) // Failure
          return { value: 'Could not remove the author' }
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

// Cast to [ObjectId] failed for value "[\n' + ' {\n' + ' newBook: {\n' + " title: 'Book',\n" + ' published: 2020,\n' + ' author: new ObjectId("64426bc69e7ea7a92dbeb03b"),\n' + ' genres: [Array],\n' + ' user: new ObjectId("6460cf8a080777a10e0ef9cf"),\n' + ' _id: new ObjectId("6461145f4432b7eccc40e632")\n' + ' }\n' + ' }\n' + ']" (type string) at path "books.0" because of "CastError"
