import { useState, CSSProperties, useEffect } from 'react'
import Notify from './components/Notify'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {
  OrderDirection,
  OrderBooksBy,
  OrderAuthorsBy,
  OrderUsersBy,
  authorProps,
  message,
  userProps,
} from './interfaces'
import { ALL_AUTHORS, ALL_BOOKS, ALL_USERS, BOOK_ADDED, FILTER_BOOKS, ME } from './queries'
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

export const TEST_MONGODB_URI = import.meta.env.VITE_TEST_MONGODB_URI
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

  const [limitAuthors, setLimitAuthors] = useState(15)
  const [limitUsers, setLimitUsers] = useState(15)

  const [orderDirectionAuthorsName, setOrderDirectionAuthorsName] = useState<OrderDirection>(OrderDirection.ASC)
  const [orderDirectionAuthorsBorn, setOrderDirectionAuthorsBorn] = useState<OrderDirection>(OrderDirection.ASC)

  const [orderDirectionUsers, setOrderDirectionUsers] = useState<OrderDirection>(OrderDirection.ASC)

  const [orderDirectionBooks, setOrderDirectionBooks] = useState<OrderDirection>(OrderDirection.ASC)

  const [orderByAuthors, setOrderByAuthors] = useState<OrderAuthorsBy>(OrderAuthorsBy.NAME)
  const [orderByUsers, setOrderByUsers] = useState<OrderUsersBy>(OrderUsersBy.BOOKS)
  const [orderByBooks, setOrderByBooks] = useState<OrderBooksBy>(OrderBooksBy.TITLE)

  const resultBooks = useQuery(ALL_BOOKS, {
    variables: {
      //do not add limit
      orderDirection: OrderDirection.ASC,
      orderBy: OrderBooksBy.TITLE,
    },
  })
  const resultAuthors = useQuery(ALL_AUTHORS, {
    variables: {
      offset: 0,
      limit: limitAuthors,
      orderDirection: orderDirectionAuthorsName,
      orderBy: orderByAuthors,
    },
  })
  const resultUsers = useQuery(ALL_USERS, {
    variables: {
      offset: 0,
      limit: limitUsers,
      orderDirection: orderDirectionUsers,
      orderBy: orderByUsers,
    },
  })

  useEffect(() => {
    resultAuthors.refetch({ orderBy: orderByAuthors, orderDirection: orderDirectionAuthorsName })
  }, [orderDirectionAuthorsName, orderByAuthors, resultAuthors.refetch])

  useEffect(() => {
    resultAuthors.refetch({ orderBy: orderByAuthors, orderDirection: orderDirectionAuthorsBorn })
  }, [orderDirectionAuthorsBorn, orderByAuthors, resultAuthors.refetch])

  useEffect(() => {
    resultUsers.refetch({ orderBy: orderByUsers, orderDirection: orderDirectionUsers })
  }, [orderDirectionUsers, orderByUsers, resultUsers.refetch])

  useEffect(() => {
    resultBooks.refetch({ orderBy: orderByBooks, orderDirection: orderDirectionBooks })
  }, [orderDirectionBooks, orderByBooks, resultBooks.refetch])

  const { data } = useQuery(ME)

  // eslint-disable-next-line no-console

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
              <NavLink to="addBook" data-test="AddBook" className="addbook">
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
          <Route path="*" element={<Welcome notify={notify} token={token} me={data?.me} />} />
          <Route
            path="/authors"
            element={
              <Authors
                authors={resultAuthors}
                notify={notify}
                token={token}
                me={data?.me}
                setLimitAuthors={setLimitAuthors}
                orderDirectionAuthorsName={orderDirectionAuthorsName}
                setOrderDirectionAuthorsName={setOrderDirectionAuthorsName}
                orderByAuthors={orderByAuthors}
                setOrderByAuthors={setOrderByAuthors}
                orderDirectionAuthorsBorn={orderDirectionAuthorsBorn}
                setOrderDirectionAuthorsBorn={setOrderDirectionAuthorsBorn}
              />
            }
          />
          <Route
            path="/users"
            element={
              <Users
                users={resultUsers}
                notify={notify}
                token={token}
                orderByUsers={orderByUsers}
                setOrderByUsers={setOrderByUsers}
                orderDirectionUsers={orderDirectionUsers}
                setOrderDirectionUsers={setOrderDirectionUsers}
                setLimitUsers={setLimitUsers}
              />
            }
          />
          <Route
            path="/users/:id"
            element={
              <User
                user={user}
                notify={notify}
                token={token}
                me={data?.me}
                setGenre={setGenre}
                orderByBooks={orderByBooks}
                setOrderByBooks={setOrderByBooks}
                orderDirectionBooks={orderDirectionBooks}
                setOrderDirectionBooks={setOrderDirectionBooks}
              />
            }
          />

          <Route
            path="/books"
            element={<Books genre={genre} setGenre={setGenre} booklist={resultBooks?.data?.allBooks} />}
          />
          <Route
            path="/books/:id"
            element={<Book book={book} token={token} notify={notify} me={data?.me} setGenre={setGenre} />}
          />
          <Route path="/authors/:id" element={<Author author={author} />} />
          <Route path="/addBook" element={<NewBook notify={notify} token={token} me={data?.me} />} />
          <Route
            path="/recommended"
            element={
              <Recommended
                token={token}
                me={data?.me}
                setGenre={setGenre}
                orderDirectionBooks={orderDirectionBooks}
                setOrderDirectionBooks={setOrderDirectionBooks}
                orderByBooks={orderByBooks}
                setOrderByBooks={setOrderByBooks}
              />
            }
          />
          <Route path="/login" element={<FormLogin notify={notify} setToken={setToken} token={token} />} />
          {/* Uncomment the following line to get new user page: */}
          {/* <Route path="/setuser" element={<NewUser notify={notify} setToken={setToken} />} /> */}
        </Routes>
      </div>
    </div>
  )
}

export default App
