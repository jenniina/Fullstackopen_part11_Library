import { useQuery } from '@apollo/client'
import { booksProps } from '../interfaces'
import { ME } from '../queries'

const Books = (props: { books: booksProps[]; token: string | null }) => {
  if (!props.token) return <div></div>

  const user = useQuery(ME)

  if (user.loading) return <div>loading...</div>

  const favorite = user?.data?.me?.favoriteGenre
  console.log(user)

  const books = props.books

  const filteredBooks = books?.filter((book) => book.genres.includes(favorite))

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
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
