import { useQuery } from '@apollo/client'
import { booksProps } from '../interfaces'
import { ME } from '../queries'
import { Link, useNavigate } from 'react-router-dom'

const Books = (props: { books: booksProps[]; token: string | null }) => {
  if (!props.token) return <div></div>

  const user = useQuery(ME)

  if (user.loading) return <div>loading...</div>

  const favorite = user?.data?.me?.favoriteGenre

  const books = props.books

  const filteredBooks = books?.filter((book) => book.genres.includes(favorite))

  const navigate = useNavigate()

  if (!props.token) {
    setTimeout(() => navigate('/login'), 1000)
    return <div>Please log in</div>
  } else
    return (
      <div>
        <h2>Recommendations</h2>
        <p>
          Books in your favorite genre: <em>{favorite}</em>
        </p>
        <table>
          <tbody>
            <tr>
              <th>title</th>
              <th>author</th>
              <th>published</th>
            </tr>
            {filteredBooks.map((a: booksProps) => (
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
      </div>
    )
}

export default Books
