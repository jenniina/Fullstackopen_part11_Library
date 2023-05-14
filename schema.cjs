const typeDefs = `
type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    user: ID
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount:Int!
    id: ID!
  }

  type User {
    username: String!
    passwordHash: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }
  
  type Value {
    value: String!
  }

  type Query {
    bookCount: Int!
    allBooks(author:String, genre:String): [Book!]!
    findBook(title: String!):Book
    authorCount: Int!
    allAuthors: [Author!]!
    allUsers: [User!]!
    findAuthor(name: String!):Author
    me: User
}

type Mutation {
  addBook(
    title: String!, 
    author: String!, 
    published: Int!, 
    genres: [String!]!
    user:ID
    id: ID
    ): Book
  editAuthorBornYear(
    name: String!, 
    setBornTo: Int!
    ): Author
  createUser(
    username: String!
    passwordHash: String!
    favoriteGenre: String!
    ): User
  login(
    username: String!
    password: String!
    ): Token
  deleteUser(
    username: String!
    ):Value
  deleteBook(
    title: String!
    ):Value
  deleteAuthor(
    name: String!
    ):Value
}
type Subscription {
  bookAdded: Book!
} 
`

module.exports = typeDefs
