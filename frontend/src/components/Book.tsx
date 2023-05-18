import { Link, useNavigate } from 'react-router-dom'
import { booksProps, message, userProps } from '../interfaces'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, ALL_USERS, DELETE_BOOK } from '../queries'
import { updateCache } from '../App'

const Book = (props: {
  book: booksProps
  token: string | null
  notify: ({ error, message }: message, seconds: number) => void
  me: userProps['id']
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
    navigate('/')
    deleteBook({ variables: { id: book.id } })
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p>
        Author: <Link to={`/authors/${book.author.id}`}>{book.author.name}</Link>
      </p>
      <p>Published: {book.published}</p>
      <p>
        <Link to={`/`}>Genres: </Link>
        {book.genres.join(', ')}
      </p>
      {props.token && props.me === book.user ? (
        <button onClick={handleDelete}>delete book</button>
      ) : (
        ''
      )}
    </div>
  )
}

export default Book
