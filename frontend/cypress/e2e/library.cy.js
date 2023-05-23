/* eslint-disable cypress/no-unnecessary-waiting */

describe('site', () => {
  beforeEach(function () {
    cy.visit('http://localhost:5173')
    Cypress.on('uncaught:exception', (_err, _runnable) => {
      return false
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
    //       username: 'Ano',
    //       password: 'Anonymous',
    //     },
    //   },
    // })
  })

  it('has a user', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/gql',
      body: {
        operationName: 'allUsers',
        query: `
            query allUsers {
              allUsers {
                username
                favoriteGenre
                id
              }
            }
            `,
      },
    })
      .its('body.data.allUsers')
      .should('have.length', 1)
  })

  it('logs in', { defaultCommandTimeout: 10000 }, () => {
    cy.get('[data-test="login"]').click()
    cy.wait(1000)
    cy.get('[data-test="username"]').click()
    cy.wait(1005)
    cy.get('input[name*="username"]').type('Ano')
    cy.get('[data-test="password"]').click()
    cy.wait(1005)
    cy.get('input[name*="password"]').type('Anonymous')
    cy.get('button[type="submit"]').click()
    cy.wait(4000)
    cy.get('.main-navigation').contains('logout')
  })

  it('deletes book', { defaultCommandTimeout: 10000 }, () => {
    cy.get('a').contains('login').click()
    cy.wait(1005)
    cy.get('[data-test="username"]').click()
    cy.get('input[name*="username"]').type('Ano')
    cy.get('[data-test="password"]').click()
    cy.wait(1005)
    cy.get('input[name*="password"]').type('Anonymous')
    cy.get('button[type="submit"]').click()

    cy.wait(3000)
    cy.get('a').contains('Books').click()
    cy.wait(5000)
    cy.get('.tablebooks').contains('Book by Cypress').click()
    cy.wait(2000)
    cy.get('h1').contains('Book by Cypress')
    cy.get('[data-test="deleteBook"]').click()
    cy.wait(5000)
    cy.get('.tablebooks').contains('Book by Cypress').should('not.exist')
  })

  it('adds book', { defaultCommandTimeout: 10000 }, () => {
    cy.get('a').contains('login').click()
    cy.wait(1005)
    cy.get('[data-test="username"]').click()
    cy.get('input[name*="username"]').type('Ano')
    cy.get('[data-test="password"]').click()
    cy.wait(1005)
    cy.get('input[name*="password"]').type('Anonymous')
    cy.get('button[type="submit"]').click()

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
    //       name: 'Anonymous',
    //     },
    //   },
    // })

    cy.wait(5000)
    cy.get('.addbook').click()
    cy.wait(2000)
    cy.get('[data-test="title"]').click()
    cy.wait(2005)
    cy.get('input[name*="title"]').type('Book by Cypress')
    cy.get('[data-test="author"]').click()
    cy.wait(1005)
    cy.get('input[name*="author"]').type('Anonymous')
    cy.get('[data-test="published"]').click()
    cy.wait(1005)
    cy.get('input[name*="published"]').type('2020')
    cy.get('[data-test="genreLabel"]').click()
    cy.wait(1005)
    cy.get('input[name*="genre"]').type('crime')
    cy.get('button').contains('add genre').click()
    cy.wait(1000)
    cy.get('[data-test="genreLabel"]').click()
    cy.wait(1005)
    cy.get('input[name*="genre"]').type('design')
    cy.get('button').contains('add genre').click()
    cy.wait(1000)
    cy.get('[data-test="genreLabel"]').click()
    cy.wait(1005)
    cy.get('input[name*="genre"]').type('horror')
    cy.get('button').contains('add genre').click()
    cy.wait(2000)
    cy.get('#genres').contains('genres: crime design horror')
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.contains('Book by Cypress by Anonymous added, in the genres: crime, design, horror')
    cy.get('[data-test="Books"]').click()
    cy.wait(5000)
    cy.get('.tablebooks').contains('Book by Cypress')
    cy.get('.genresButtons').contains('horror')

    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/gql',
      body: {
        operationName: 'allAuthors',
        query: `
        query allAuthors{
          allAuthors {
            name
            born
            bookCount
            id
          }
        }
        `,
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
        query allBooks{
          allBooks {
            title
          }
        }
        `,
      },
    })
      .its('body.data.allBooks')
      .should('have.length', 1)

    cy.get('.main-navigation').contains('Authors').click()
    cy.wait(5000)
    cy.get('.tableauthors').contains('Anonymous')
    cy.get('.tableauthors').contains('1')
  })
})
