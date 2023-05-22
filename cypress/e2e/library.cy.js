/* eslint-disable cypress/no-unnecessary-waiting */

describe('site', () => {
  beforeEach(function () {
    cy.visit('http://localhost:4000')
    Cypress.on('uncaught:exception', (_err, _runnable) => {
      return false
    })

    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/gql',
      body: {
        operationName: 'login',
        query: `
        mutation login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            value
          }
        }
          `,
        variables: {
          username: 'Ano',
          password: 'Anonymous',
        },
      },
    })
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

  it('fetches items', () => {})

  it('logs in', () => {
    cy.get('a').contains('login').click()
    cy.wait(1000)
    cy.get('label').eq(1).click()
    cy.wait(1005)
    cy.get('input[name*="username"]').type('Ano')
    cy.get('label').eq(2).click()
    cy.wait(1005)
    cy.get('input[name*="password"]').type('Anonymous')
    cy.get('button[type="submit"]').click()
    cy.wait(3000)
    cy.get('.main-navigation').contains('logout')
  })

  it('adds book', () => {
    cy.get('a').contains('login').click()
    cy.wait(1005)
    cy.get('label').eq(1).click()
    cy.get('input[name*="username"]').type('Ano')
    cy.get('label').eq(2).click()
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

    cy.wait(3000)
    cy.get('.main-navigation').contains('Add Book').click()
    cy.wait(2000)
    cy.get('label').eq(1).click()
    cy.wait(2005)
    cy.get('input[name*="title"]').type('Book by Cypress')
    cy.get('label').eq(2).click()
    cy.wait(1005)
    cy.get('input[name*="author"]').type('Anonymous')
    cy.get('label').eq(3).click()
    cy.wait(1005)
    cy.get('input[name*="published"]').type('2020')
    cy.get('#genreLabel').click()
    cy.wait(1005)
    cy.get('input[name*="genre"]').type('crime')
    cy.get('button').contains('add genre').click()
    cy.wait(1000)
    cy.get('#genreLabel').click()
    cy.wait(1005)
    cy.get('input[name*="genre"]').type('design')
    cy.get('button').contains('add genre').click()
    cy.wait(1000)
    cy.get('#genreLabel').click()
    cy.wait(1005)
    cy.get('input[name*="genre"]').type('horror')
    cy.get('button').contains('add genre').click()
    cy.wait(2000)
    cy.get('#genres').contains('genres: crime design horror')
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.contains('Book already added')
    cy.get('a').contains('Books').click()
    cy.wait(3000)
    cy.get('table').contains('Book by Cypress')
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
    cy.wait(3000)
    cy.get('table').contains('Anonymous')
    cy.get('table').contains('1')
  })
})