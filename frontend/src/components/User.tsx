import { Link } from 'react-router-dom'
import { userProps, message } from '../interfaces'

const User = (props: {
  user: userProps
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
}) => {
  const user = props.user

  if (!props.token) return <div>Please log in</div>
  return (
    <div>
      <h1>{user.username}</h1>
      <table>
        <tbody>
          <tr>
            <th>favorite genre</th>
            <th>books added</th>
          </tr>
          <tr>
            <td>{user.favoriteGenre}</td>
            <td>
              {user.books
                ?.slice()
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((book) => (
                  <p key={book.id}>
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                  </p>
                ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default User
