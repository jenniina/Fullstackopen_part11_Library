const typeDefs = `
type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
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
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    allBooks(author:String, genre:String): [Book!]!
    findBook(title: String!):Book
    authorCount: Int!
    allAuthors: [Author!]!
    findAuthor(name: String!):Author
    me: User
}

type Mutation {
  addBook(
    title: String!, 
    author: String!, 
    published: Int!, 
    genres: [String!]!
    id: ID
    ): Book
  editAuthorBornYear(
    name: String!, 
    setBornTo: Int!
    ): Author
  createUser(
    username: String!
    favoriteGenre: String!
    ): User
  login(
    username: String!
    password: String!
    ): Token
}
type Subscription {
  bookAdded: Book!
} 
`

module.exports = typeDefs
