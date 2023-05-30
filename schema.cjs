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
    surname: String
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
    allBooks(author:String, genre:String, offset: Int, limit: Int, orderDirection: Int, orderBy: String): [Book!]!
    findBook(title: String!):Book
    authorCount: Int!
    allAuthors(offset: Int, limit: Int, orderDirection: Int, orderBy: String): [Author!]!
    allUsers(id:ID, offset: Int, limit: Int, orderDirection: Int, orderBy: String): [User!]!
    findAuthor(name: String, surname:String):Author
    findUser(id: String!):User
    me: User
}

type Mutation {
  createBook(
    title: String!, 
    author: String!, 
    surname: String,
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
