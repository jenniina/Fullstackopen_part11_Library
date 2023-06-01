import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
      surname
      id
    }
    genres
    id
    user
  }
`

export const ALL_AUTHORS = gql`
  query allAuthors($offset: Int, $limit: Int, $orderDirection: Int, $orderBy: String) {
    allAuthors(offset: $offset, limit: $limit, orderDirection: $orderDirection, orderBy: $orderBy) {
      surname
      name
      born
      bookCount
      id
    }
  }
`

export const ALL_USERS = gql`
  query allUsers($id: ID, $offset: Int, $limit: Int, $orderDirection: Int, $orderBy: String) {
    allUsers(id: $id, offset: $offset, limit: $limit, orderDirection: $orderDirection, orderBy: $orderBy) {
      username
      favoriteGenre
      id
      books {
        title
        id
        author {
          name
          surname
          id
        }
      }
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks($orderDirection: Int, $orderBy: String, $genre: String, $offset: Int, $limit: Int) {
    allBooks(orderDirection: $orderDirection, orderBy: $orderBy, genre: $genre, offset: $offset, limit: $limit) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const FIND_USER = gql`
  query findUser($id: String!) {
    findUser(id: $id) {
      username
      favoriteGenre
      books {
        title
        id
      }
      id
    }
  }
`

export const GET_BOOKS_OF_AUTHOR = gql`
  query allBooks($author: String) {
    allBooks(author: $author) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $surname: String
    $published: Int!
    $genres: [String!]!
    $user: ID
  ) {
    createBook(title: $title, author: $author, surname: $surname, published: $published, user: $user, genres: $genres) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const EDIT_BORN = gql`
  mutation editAuthorBornYear($name: String!, $setBornTo: Int!) {
    editAuthorBornYear(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`
export const EDIT_USER = gql`
  mutation editUser($id: ID!, $setGenre: String, $setUsername: String, $setPassword: String) {
    editUser(id: $id, setGenre: $setGenre, setUsername: $setUsername, setPassword: $setPassword) {
      username
      favoriteGenre
      passwordHash
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ME = gql`
  query me {
    me {
      username
      favoriteGenre
      id
    }
  }
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
export const CREATE_USER = gql`
  mutation createUser($username: String!, $passwordHash: String!, $favoriteGenre: String!, $authorization: String!) {
    createUser(
      username: $username
      passwordHash: $passwordHash
      favoriteGenre: $favoriteGenre
      authorization: $authorization
    ) {
      username
      favoriteGenre
    }
  }
`

export const DELETE_BOOK = gql`
  mutation deleteBook($id: ID, $title: String) {
    deleteBook(id: $id, title: $title) {
      value
    }
  }
`

export const DELETE_AUTHOR = gql`
  mutation deleteAuthor($name: String!) {
    deleteAuthor(name: $name) {
      value
    }
  }
`
