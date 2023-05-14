import { useState } from 'react'
import Notify from './components/Notify'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { message } from './interfaces'
import { ALL_AUTHORS, ALL_BOOKS, ALL_USERS, BOOK_ADDED } from './queries'
import FormLogin from './components/FormLogin'
import {
  ApolloCache,
  DocumentNode,
  useApolloClient,
  useQuery,
  useSubscription,
} from '@apollo/client'
import { Route, Routes, NavLink } from 'react-router-dom'
import Recommended from './components/Recommended'
import { booksProps } from './interfaces'
import NewUser from './components/NewUser'
import Users from './components/Users'

// function that takes care of manipulating cache
export const updateCache = (
  cache: ApolloCache<any>,
  query: { query: DocumentNode },
  addedBook: booksProps
) => {
  // helper that is used to eliminate saving same person twice
  const uniqByName = (a: booksProps[]) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

export const LIRARY_TOKEN = 'library_token'

const App = () => {
  const client = useApolloClient()

  const [token, setToken] = useState<string | null>(localStorage.getItem(LIRARY_TOKEN))

  const [message, setMessage] = useState<message>()

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)
  const resultUsers = useQuery(ALL_USERS)

  const notify = (info: message, seconds: number) => {
    setMessage(info)
    setTimeout(() => {
      setMessage({ error: true, message: undefined })
    }, seconds * 1000)
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data)

      const addedBook = data.data.bookAdded
      notify(
        {
          error: false,
          message: `${addedBook.title} by ${
            addedBook.author.name
          } added, in the genres: ${addedBook.genres.join(', ')}`,
        },
        8
      )

      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })
  const logout = () => {
    setToken(null)
    window.localStorage.removeItem(LIRARY_TOKEN) //keep name same in FormLogin.tsx and main.tsx
    client.resetStore()
  }

  if (resultAuthors.loading) {
    return <div>loading...</div>
  }
  if (resultBooks.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <ul className='main-navigation'>
        <li>
          <NavLink to='/'>Books</NavLink>
        </li>
        <li>
          <NavLink to='authors'>Authors</NavLink>
        </li>
        {!token ? (
          ''
        ) : (
          <>
            <li>
              <NavLink to='users'>Users</NavLink>
            </li>
            <li>
              <NavLink to='addBook'>Add Book</NavLink>
            </li>
            <li>
              <NavLink to='recommended'>Recommended</NavLink>
            </li>
          </>
        )}
        <li>
          {!token ? (
            <NavLink to='login'>login</NavLink>
          ) : (
            <button className='logout' onClick={logout}>
              logout
            </button>
          )}
        </li>
      </ul>
      <Notify info={message} />
      <div className='main-container'>
        <Routes>
          <Route
            path='/authors'
            element={
              <Authors
                authors={resultAuthors?.data?.allAuthors}
                notify={notify}
                token={token}
              />
            }
          ></Route>
          <Route
            path='/users'
            element={
              <Users users={resultUsers?.data?.allUsers} notify={notify} token={token} />
            }
          ></Route>
          <Route path='/' element={<Books books={resultBooks?.data?.allBooks} />}></Route>
          <Route
            path='/addBook'
            element={<NewBook notify={notify} token={token} />}
          ></Route>
          <Route
            path='/recommended'
            element={<Recommended books={resultBooks?.data?.allBooks} token={token} />}
          ></Route>
          <Route
            path='/login'
            element={<FormLogin notify={notify} setToken={setToken} />}
          ></Route>
          {/* <Route path='/setuser' element={<NewUser notify={notify} />}></Route> */}
        </Routes>
      </div>
    </div>
  )
}

export default App
