/// <reference types="cypress" /
/* eslint-disable cypress/no-unnecessary-waiting */

// cy.createCollection('test_collection', { database: 'testLibrary' }) // creates both collection and database

describe('site function', () => {
  beforeEach(function () {
    cy.visit('http://localhost:4000')
    Cypress.on('uncaught:exception', (_err, _runnable) => {
      return false
    })

    cy.createCollection('users', { database: 'testLibrary', failSilently: true })
    cy.createCollection('books', { database: 'testLibrary', failSilently: true })
    cy.createCollection('authors', { database: 'testLibrary', failSilently: true })

    cy.deleteMany(
      {}, // Filter (empty to match all documents)
      { collection: 'users', database: 'testLibrary' } // Options
    ).then((res) => {
      cy.log(res)
    })

    const user = {
      username: Cypress.env('USERNAME'),
      passwordHash: Cypress.env('HASH'),
      favoriteGenre: 'design',
      books: [],
    }

    cy.insertOne(user, { collection: 'users', database: 'testLibrary' }).then(
      (result) => {
        cy.log(result) // prints the _id of inserted document
      }
    )

    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/gql',
      body: {
        operationName: 'createUser',
        query: `
          mutation createUser($username: String!, $passwordHash: String!, $favoriteGenre: String!, $authorization: String!) {
          createUser(username: $username,
            passwordHash: $passwordHash,
            favoriteGenre: $favoriteGenre,
            authorization: $authorization) {
            username
            favoriteGenre
          }
        }`,
        variables: {
          authorization: Cypress.env('SECRET'),
          username: Cypress.env('USERNAME'),
          passwordHash: Cypress.env('PASSWORD'),
          favoriteGenre: 'design',
        },
      },
    })

    cy.deleteMany(
      {}, // Filter (empty to match all documents)
      { collection: 'books', database: 'testLibrary' } // Options
    ).then((res) => {
      cy.log(res)
    })

    cy.deleteMany(
      {}, // Filter (empty to match all documents)
      { collection: 'authors', database: 'testLibrary' } // Options
    ).then((res) => {
      cy.log(res)
    })

    // cy.updateMany(
    //   {}, // Filter (empty to match all documents)
    //   { $set: { books: [] } }, // Update (set 'books' to an empty array)
    //   { collection: 'users', database: 'testLibrary' } // Options
    // ).then((result) => {
    //   cy.log(result) // prints the result of the update operation
    // })
  })

  it('has a user', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/gql',
      body: {
        operationName: 'allUsers',
        query: `
            query allUsers($orderDirection: Int!, $orderBy: String!) {
              allUsers(orderDirection: $orderDirection, orderBy: $orderBy) {
                username
                favoriteGenre
                id
              }
            }`,
        variables: {
          orderDirection: 1,
          orderBy: 'username',
        },
      },
    })
      .its('body.data.allUsers')
      .should('have.length', 1)
  })

  it('logs in', { defaultCommandTimeout: 10000 }, () => {
    cy.get('[data-test="login"]').click()
    cy.wait(1005)
    cy.get('[data-test="username"]').click()
    cy.wait(1005)
    cy.get('input[name*="username"]').type(Cypress.env('USERNAME'))
    cy.get('[data-test="password"]').click()
    cy.wait(1005)
    cy.get('input[name*="password"]').type(Cypress.env('PASSWORD'))
    cy.get('button[type="submit"]').click()
    cy.wait(6000)
    cy.get('.main-navigation').contains('logout')
  })

  it('adds and deletes book', { defaultCommandTimeout: 10000 }, () => {
    cy.get('a').contains('login').click()
    cy.wait(1005)
    cy.get('[data-test="username"]').click()
    cy.get('input[name*="username"]').type(Cypress.env('USERNAME'))
    cy.get('[data-test="password"]').click()
    cy.wait(1005)
    cy.get('input[name*="password"]').type(Cypress.env('PASSWORD'))
    cy.get('button[type="submit"]').click()

    cy.wait(6000)
    cy.get('.addbook').click()
    cy.wait(2005)
    cy.get('[data-test="title"]').click()
    cy.wait(2005)
    cy.get('input[name*="title"]').type('Book by Cypress')
    cy.get('[data-test="author"]').click()
    cy.wait(1005)
    cy.get('input[name*="author"]').type('Authora')
    cy.get('[data-test="published"]').click()
    cy.wait(1005)
    cy.get('input[name*="published"]').type('2020')
    cy.get('[data-test="genreLabel"]').click()
    cy.wait(1005)
    cy.get('input[name*="genre"]').type('crime')
    cy.get('button').contains('add genre').click()
    cy.wait(1005)
    cy.get('[data-test="genreLabel"]').click()
    cy.wait(1005)
    cy.get('input[name*="genre"]').type('design')
    cy.get('button').contains('add genre').click()
    cy.wait(1005)
    cy.get('[data-test="genreLabel"]').click()
    cy.wait(1005)
    cy.get('input[name*="genre"]').type('horror')
    cy.get('button').contains('add genre').click()
    cy.wait(2000)
    cy.get('#genres').contains('genres: crime design horror')
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.contains(`Book by Cypress by Authora added, in the genres: crime, design, horror`)
    cy.get('[data-test="Books"]').click()
    cy.wait(6000)
    cy.get('.tablebooks').contains('Book by Cypress')
    cy.get('.genresButtons').contains('horror')

    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/gql',
      body: {
        operationName: 'allAuthors',
        query: `
        query allAuthors($orderDirection: Int!, $orderBy: String!){
          allAuthors(orderDirection: $orderDirection, orderBy: $orderBy) {
            name
            born
            bookCount
            id
          }
        }
        `,
        variables: {
          orderDirection: 1,
          orderBy: 'surname',
        },
      },
    })
      .its('body.data.allAuthors')
      .should('have.length', 1)

    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/gql',
      body: {
        operationName: 'allBooks',
        query: `
        query allBooks($orderDirection: Int!, $orderBy: String!){
          allBooks(orderDirection: $orderDirection, orderBy: $orderBy) {
            title
          }
        }`,
        variables: {
          orderDirection: 1,
          orderBy: 'title',
        },
      },
    })
      .its('body.data.allBooks')
      .should('have.length', 1)

    cy.get('.main-navigation').contains('Authors').click()
    cy.wait(5000)
    cy.get('.tableauthors').contains('Authora')
    cy.get('.tableauthors').contains('1')

    cy.get('a').contains('Books').click()
    cy.wait(5000)
    cy.get('.tablebooks').contains('Book by Cypress').click()
    cy.wait(2000)
    cy.get('h1').contains('Book by Cypress')
    cy.get('[data-test="deleteBook"]').click()
    cy.wait(5000)
    cy.get('.tablebooks').should('not.exist')
  })
})

// cy.request({
//   method: 'POST',
//   url: 'http://localhost:4000/gql',
//   body: {
//     operationName: 'login',
//     query: `
//     mutation login($username: String!, $password: String!) {
//       login(username: $username, password: $password) {
//         value
//       }
//     }
//       `,
//     variables: {
//       username: Cypress.env('USERNAME'),
//       password: Cypress.env('PASSWORD'),
//     },
//   },
// })

// cy.request({
//   method: 'POST',
//   url: 'http://localhost:4000/gql',
//   body: {
//     operationName: 'deleteBook',
//     query: `
//       mutation deleteBook (
//           $title: String
//         )  {
//           deleteBook(
//             title: $title
//         ){
//           value
//         }
//       }
//       `,
//     variables: {
//       title: 'Book by Cypress',
//     },
//   },
// })

// cy.request({
//   method: 'POST',
//   url: 'http://localhost:4000/gql',
//   body: {
//     operationName: 'deleteAuthor',
//     query: `
//       mutation deleteAuthor (
//           $name: String!
//         )  {
//           deleteAuthor(
//             name: $name
//         ){
//           value
//         }
//       }
//       `,
//     variables: {
//       name: Cypress.env('PASSWORD'),
//     },
//   },
// })
