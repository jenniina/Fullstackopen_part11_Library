import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { BrowserRouter as Router } from 'react-router-dom'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { LIRARY_TOKEN } from './App'
import { ThemeProvider } from './hooks/useTheme'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(LIRARY_TOKEN) //keep name same in App.tsx and FormLogin.tsx
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const VITE_BASE_URI = import.meta.env.VITE_BASE_URI
const VITE_BASE_URI_WS = import.meta.env.VITE_BASE_URI_WS

const httpLink = createHttpLink({
  uri: VITE_BASE_URI ? VITE_BASE_URI : 'http://localhost:4000/gql',
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: VITE_BASE_URI_WS ? VITE_BASE_URI_WS : 'ws://localhost:4000/gql',
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  //link: authLink.concat(httpLink),
  link: splitLink,
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <ApolloProvider client={client}>
        <ThemeProvider key={null} type={''} props={undefined}>
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </Router>
  </React.StrictMode>
)
