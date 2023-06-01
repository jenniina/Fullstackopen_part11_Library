import { KeyboardEvent, useEffect, useRef, useState, FormEvent } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, ALL_USERS, ME } from '../queries'
import { RefObject, message, userProps } from '../interfaces'
import { tester } from '../App'
import { useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'

const NewBook = (props: {
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
  me: userProps
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [surname, setAuthorSurname] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [userId, setUser] = useState('')

  const genreButton = useRef<HTMLButtonElement>(null)
  const form = useRef() as RefObject<HTMLFormElement>

  const user = useQuery(ME)

  const navigate = useNavigate()

  useEffect(() => {
    setUser(user?.data?.me?.id)
  }, [user])

  const [createBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }, { query: ME }, { query: ALL_USERS }],
    update: (cache, { data: { createBook } }) => {
      cache.modify({
        fields: {
          allBooks(existingBooks) {
            const newBookRef = cache.writeFragment({
              data: createBook,
              fragment: gql`
                fragment NewBook on Book {
                  title
                  published
                  author
                  genres
                  id
                  user
                }
              `,
            })
            return [...existingBooks, newBookRef]
          },
        },
      })
      // cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
      //   return {
      //     allBooks: allBooks.concat(response.data),
      //   }
      // })
      //updateCache(cache, { query: ALL_BOOKS }, response.data.createBook)
    },
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch()
    },
    onError: (error) => {
      //eslint-disable-next-line no-console
      console.log(JSON.stringify(error, null, 2))
      props.notify({ error: true, message: error.message }, 10)
    },
    onCompleted: () => {
      props.notify({ error: false, message: `${title} by ${author} added, in the genres: ${genres.join(', ')}` }, 6)
      zero()
    },
  })

  const zero = () => {
    setTitle('')
    setPublished('')
    setAuthor('')
    setAuthorSurname('')
    setGenres([])
    setGenre('')
  }

  useEffect(() => {
    const surname = author.split(' ').splice(-1)[0]
    setAuthorSurname(surname)
  }, [author])

  const submit = async (event: FormEvent) => {
    event.preventDefault()

    if (props.me?.id === tester)
      props.notify(
        {
          error: true,
          message: 'Unfortunately, Tester may not add books! Please request a real account from the admin',
        },
        10
      )
    else if (title.length < 2) props.notify({ error: true, message: 'Title too short' }, 10)
    else {
      createBook({
        variables: {
          title,
          author,
          surname,
          genres,
          published: parseInt(published),
          user: userId,
        },
        refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }, { query: ME }, { query: ALL_USERS }],
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(error, null, 2))
        props.notify({ error: true, message: error.message }, 10)
      })
      if (form && import.meta.env.PROD && (props.me?.username !== 'Ano' || title !== 'Book by Cypress')) {
        emailjs
          .sendForm(
            import.meta.env.VITE_serviceID,
            import.meta.env.VITE_templateID,
            form.current,
            import.meta.env.VITE_publicKey
          )
          .then(
            (result) => {
              // eslint-disable-next-line no-console
              console.log(result.text)
            },
            (error) => {
              // eslint-disable-next-line no-console
              console.log(error.text, error.message)
            }
          )
      }
    }
  }

  const addGenre = () => {
    if (genres.find((g) => g === genre)) props.notify({ error: true, message: `${genre} already added!` }, 10)
    else if (genre.includes(',') || genre.includes('.'))
      props.notify({ error: true, message: 'Please add only one genre at a time!' }, 10)
    else if (genre.includes(' ')) {
      if (window.confirm('Add a single genre?')) {
        setGenres(genres.concat(genre))
        setGenre('')
      }
    } else {
      setGenres(genres.concat(genre))
      setGenre('')
    }
  }

  const clearGenres = () => {
    setGenres([])
    props.notify({ error: false, message: 'Cleared genres list' }, 10)
  }
  const keyHandlerGenre = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.code) {
    case 'Enter':
    case 'Tab':
      e.preventDefault()
      genreButton.current?.click()
      addGenre()
      props.notify({ error: false, message: `Added ${genre} to genres list` }, 10)
    }
  }

  useEffect(() => {
    if (!props.token) {
      setTimeout(() => navigate('/login'), 1500)
    }
  }, [props.token, navigate])

  if (!props.token) {
    return <div>Please log in</div>
  } else {
    return (
      <div>
        <h1 className="screen-reader-text">Add a book to the database</h1>
        <form id="addBookForm" onSubmit={submit} ref={form}>
          <legend>Add Book</legend>
          <div className="flex">
            <div className="input-wrap">
              <label data-test="title">
                <input
                  name="title"
                  value={title}
                  type="text"
                  required
                  onChange={({ target }) => setTitle(target.value)}
                />
                <span>
                  <small>title: </small>
                </span>
              </label>
            </div>
            <div className="input-wrap fourth">
              <label data-test="published">
                <input
                  type="number"
                  name="published"
                  required
                  value={published}
                  onChange={({ target }) => setPublished(target.value)}
                />
                <span>
                  <small>published: </small>
                </span>
              </label>
            </div>
          </div>
          <div className="flex">
            <div className="input-wrap">
              <label data-test="author">
                <input
                  name="author"
                  value={author}
                  type="text"
                  required
                  onChange={({ target }) => setAuthor(target.value)}
                />
                <span>
                  <small>author: </small>
                </span>
              </label>
            </div>
          </div>
          <div className="input-wrap-wrap">
            <div className="input-wrap genre">
              <label id="genreLabel" data-test="genreLabel">
                <input
                  name="genre"
                  value={genre}
                  type="text"
                  onChange={({ target }) => setGenre(target.value)}
                  onKeyDown={(e) => keyHandlerGenre(e)}
                />
                <span>
                  <small>genre: </small>
                </span>
              </label>
            </div>

            <button ref={genreButton} id="add-genre" onClick={addGenre} type="button">
              <small>add&nbsp;genre</small>
            </button>
          </div>
          <div id="genres">
            <span>
              <small>genres: </small>
              {genres.map((genre, i) => (
                <small key={`${genre}${i}`}>{genre} </small>
              ))}{' '}
            </span>
            <button onClick={clearGenres} type="button">
              <small>clear&nbsp;genres</small>
            </button>
          </div>
          <input type="hidden" name="message" value={`A new book was added: ${title} by ${props.me?.username}`} />
          <button type="submit">create&nbsp;book</button>
        </form>
      </div>
    )
  }
}

export default NewBook
