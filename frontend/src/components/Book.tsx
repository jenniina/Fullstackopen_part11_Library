import { Link, useNavigate } from 'react-router-dom'
import { booksProps, message, userProps } from '../interfaces'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, ALL_USERS, DELETE_BOOK } from '../queries'
import { Dispatch, SetStateAction } from 'react'

const Book = (props: {
  book: booksProps
  token: string | null
  notify: ({ error, message }: message, seconds: number) => void
  me: userProps
  setGenre: Dispatch<SetStateAction<string>>
}) => {
  const book = props.book

  const navigate = useNavigate()

  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_USERS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(error, null, 2))
      props.notify({ error: true, message: error.message }, 10)
    },
    onCompleted: () => {
      props.notify({ error: false, message: 'Successfully deleted book' }, 5)
    },
  })

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      navigate('/books')
      deleteBook({ variables: { id: book.id } })
    }
  }

  const handleGenre = (genre: string) => {
    props.setGenre(genre)
    navigate('/books')
  }

  return (
    <div className="page-book smaller-title">
      <h1>{book.title}</h1>
      <p>
        Author: <Link to={`/authors/${book.author.id}`}>{book.author.name}</Link>
      </p>
      <p>Published: {book.published && book.published < 0 ? `${Math.abs(book.published)} BC` : book.published}</p>
      <div>
        <h2>Genres:</h2>
        {book.genres.map((genre) => {
          return (
            <button key={genre} onClick={() => handleGenre(genre)}>
              {genre}
            </button>
          )
        })}
      </div>
      {props.token && props.me?.id === book.user ? (
        <button onClick={handleDelete} data-test="deleteBook">
          delete book
        </button>
      ) : (
        ''
      )}
    </div>
  )
}

export default Book
