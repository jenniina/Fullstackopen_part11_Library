const { AuthenticationError } = require('apollo-server-core')
const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
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
    findBook: async (root, args) => {
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
      const newBook = new Book({ ...args, author: foundAuthor._id })

      try {
        await newBook.save()
        pubsub.publish('BOOK_ADDED', { bookAdded: newBook.populate('author') })

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
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      })
    },
    login: async (_root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'Testaaja') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
