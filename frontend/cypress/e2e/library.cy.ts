describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
  })
})
