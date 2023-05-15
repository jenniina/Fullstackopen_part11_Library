import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
    }
    genres
    id
    user
  }
`

export const ALL_AUTHORS = gql`
  query allAuthors {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const ALL_USERS = gql`
  query allUsers {
    allUsers {
      username
      favoriteGenre
      id
      books {
        title
        id
      }
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks {
    allBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
export const FILTER_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
    $user: ID
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      user: $user
      genres: $genres
    ) {
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
  mutation createUser(
    $username: String!
    $passwordHash: String!
    $favoriteGenre: String!
  ) {
    createUser(
      username: $username
      passwordHash: $passwordHash
      favoriteGenre: $favoriteGenre
    ) {
      username
      favoriteGenre
    }
  }
`
