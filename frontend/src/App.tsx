import { useState, CSSProperties, useEffect } from 'react'
import Notify from './components/Notify'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { authorProps, message, userProps } from './interfaces'
import { ALL_AUTHORS, ALL_BOOKS, ALL_USERS, BOOK_ADDED, ME } from './queries'
import FormLogin from './components/FormLogin'
import { ApolloCache, DocumentNode, useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { Route, Routes, NavLink, useMatch, Link, useLocation } from 'react-router-dom'
import Recommended from './components/Recommended'
import { booksProps } from './interfaces'
import Users from './components/Users'
import Book from './components/Book'
import Author from './components/Author'
import User from './components/User'
import NewUser from './components/NewUser'
import { useScrollbarWidth } from './hooks/useScrollbarWidth'
import { useTheme, useThemeUpdate } from './hooks/useTheme'
import ThemeToggle from './components/ThemeToggle'
import Welcome from './components/Welcome'
import Exit from './components/Exit'
import useWindowSize from './hooks/useWindowSize'

// function that takes care of manipulating cache
export const updateCache = (cache: ApolloCache<any>, query: { query: DocumentNode }, addedBook: booksProps) => {
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

export const tester = '64673513aaa627ac7b5a37ec'

const App = () => {
  const client = useApolloClient()

  const [token, setToken] = useState<string | null>(localStorage.getItem(LIRARY_TOKEN))

  const [message, setMessage] = useState<message>()

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)
  const resultUsers = useQuery(ALL_USERS)

  const { data } = useQuery(ME)

  const [genre, setGenre] = useState<string>('')

  const where = useLocation()

  useEffect(() => {
    setGenre('') //reset genres on refresh
  }, [])

  const notify = (info: message, seconds: number) => {
    setMessage(info)
    setTimeout(() => {
      setMessage({ error: true, message: undefined })
    }, seconds * 1000)
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      notify(
        {
          error: false,
          message: `${addedBook.title} by ${addedBook.author.name} added, in the genres: ${addedBook.genres.join(
            ', '
          )}`,
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

  const matchBook = useMatch('/books/:id')
  const matchAuthor = useMatch('/authors/:id')
  const matchUser = useMatch('/users/:id')

  const book = matchBook
    ? resultBooks?.data?.allBooks?.find((book: booksProps) => book.id === matchBook.params.id)
    : null

  const author: authorProps = matchAuthor
    ? resultAuthors?.data?.allAuthors?.find((author: authorProps) => author.id === matchAuthor.params.id)
    : null

  const user: userProps = matchUser
    ? resultUsers?.data?.allUsers?.find((user: userProps) => user.id === matchUser.params.id)
    : null

  const scrollbarWidth = useScrollbarWidth()

  const style: CSSProperties = {
    ['--scrollbar_width' as string]: `${scrollbarWidth}px`,
  }

  const lightTheme = useTheme()
  const toggleTheme = useThemeUpdate()

  const { windowWidth } = useWindowSize()

  if (resultAuthors.loading) {
    return <div>loading...</div>
  }
  if (resultBooks.loading) {
    return <div>loading...</div>
  }

  return (
    <div style={style}>
      <ul className={`main-navigation ${windowWidth < 800 ? 'small-screen' : ''}`}>
        <li>
          <NavLink to="/exit">&laquo;&nbsp;Exit</NavLink>
        </li>
        <li>
          <NavLink to="/">Welcome</NavLink>
        </li>
        <li>
          <NavLink to="/books" data-test="Books">
            Books
          </NavLink>
        </li>
        <li>
          <NavLink to="authors">Authors</NavLink>
        </li>
        {!token ? (
          ''
        ) : (
          <>
            <li>
              <NavLink to="users">Users</NavLink>
            </li>
            <li>
              <NavLink to="addBook" data-test="Add Book">
                Add Book
              </NavLink>
            </li>
            <li>
              <NavLink to="recommended">Recommended</NavLink>
            </li>
          </>
        )}
        <li>
          {!token ? (
            <NavLink to="login" data-test="login">
              login
            </NavLink>
          ) : (
            <button className="logout" onClick={logout} data-test="logout">
              logout
            </button>
          )}
        </li>
        <li>
          <ThemeToggle lightTheme={lightTheme} toggleTheme={toggleTheme} />
        </li>
      </ul>
      {data?.me ? (
        <p>
          <small>
            logged in as {/* make name non-clickable if already on the user page: */}
            {where.pathname === `/users/${data?.me?.id}` ? (
              `${data?.me?.username}`
            ) : (
              <Link to={`/users/${data?.me?.id}`} className="no-underline">
                {data?.me?.username}
              </Link>
            )}
          </small>
        </p>
      ) : (
        ''
      )}
      <Notify info={message} />
      <div className="main-container">
        <Routes>
          <Route path="/exit" element={<Exit />} />
          <Route path="/" element={<Welcome notify={notify} token={token} me={data?.me} />} />
          <Route
            path="/authors"
            element={<Authors authors={resultAuthors?.data?.allAuthors} notify={notify} token={token} me={data?.me} />}
          />
          <Route path="/users" element={<Users users={resultUsers?.data?.allUsers} notify={notify} token={token} />} />
          <Route
            path="/users/:id"
            element={<User user={user} notify={notify} token={token} me={data?.me} setGenre={setGenre} />}
          />

          <Route path="/books" element={<Books genre={genre} setGenre={setGenre} />} />
          <Route
            path="/books/:id"
            element={<Book book={book} token={token} notify={notify} me={data?.me} setGenre={setGenre} />}
          />
          <Route path="/authors/:id" element={<Author author={author} />} />
          <Route path="/addBook" element={<NewBook notify={notify} token={token} me={data?.me} />} />
          <Route
            path="/recommended"
            element={
              <Recommended books={resultBooks?.data?.allBooks} token={token} me={data?.me} setGenre={setGenre} />
            }
          />
          <Route path="/login" element={<FormLogin notify={notify} setToken={setToken} token={token} />} />
          {/* Uncomment the following line to get new user page: */}
          <Route path="/setuser" element={<NewUser notify={notify} setToken={setToken} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
