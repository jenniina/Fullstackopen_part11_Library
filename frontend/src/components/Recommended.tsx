import { useQuery } from '@apollo/client'
import { booksProps, userProps } from '../interfaces'
import { ME } from '../queries'
import { Link, useNavigate } from 'react-router-dom'
import { Dispatch, SetStateAction } from 'react'

const Books = (props: {
  books: booksProps[]
  token: string | null
  me: userProps
  setGenre: Dispatch<SetStateAction<string>>
}) => {
  const navigate = useNavigate()

  const user = useQuery(ME)

  const handleGenreRedirect = (genre: string) => {
    props.setGenre(genre)
    navigate('/books')
  }

  const favorite = user?.data?.me?.favoriteGenre

  const books = props.books

  const filteredBooksInGenre = books?.filter((book) => book.genres.includes(favorite))
  const filteredBooks = filteredBooksInGenre?.filter((book) => book.user !== props.me.id)

  const heading = 'Recommendations'

  if (!props.token) {
    setTimeout(() => navigate('/login'), 1000)
    return <div>Please log in</div>
  } else
    return (
      <div>
        <h1>
          <span data-text={heading}>{heading}</span>
        </h1>
        {user?.loading ? (
          <div>
            <big>loading...</big>
          </div>
        ) : (
          <>
            <p>
              Books added by others in your favorite genre
              <button
                style={{ display: 'block', margin: '0 auto' }}
                className="link-btn"
                onClick={() => handleGenreRedirect(favorite)}
              >
                <big>
                  <em>{favorite}</em>
                </big>
              </button>
            </p>
            {filteredBooks?.length === 0 ? (
              <>
                <p>Oh no! No-one else has added any books in your favorite genre, yet!</p>
                <p>
                  See <Link to={`/users/${props.me?.id}`}>your books</Link>
                </p>
              </>
            ) : (
              <table>
                <tbody>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Published</th>
                  </tr>
                  {filteredBooks?.map((a: booksProps) => (
                    <tr key={a.title}>
                      <td>
                        <Link to={`/books/${a.id}`}>{a.title}</Link>
                      </td>
                      <td>
                        <Link to={`/authors/${a.author.id}`}>{a.author.name}</Link>
                      </td>
                      <td>{a.published}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    )
}

export default Books
