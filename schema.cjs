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
    books: [Book]
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
    allUsers(id:ID): [User!]!
    findAuthor(name: String!):Author
    findUser(id: String!):User
    me: User
}

type Mutation {
  createBook(
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
    id: ID
    title: String
    ):Value
  deleteAuthor(
    name: String!
    ):Value
  editUser(
    id: ID!
    setUsername: String
    setGenre: String
    setPassword: String
    ):User
}
type Subscription {
  bookAdded: Book!
} 
`

module.exports = typeDefs
