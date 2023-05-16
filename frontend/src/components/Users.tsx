import { Link, useNavigate } from 'react-router-dom'
import { userProps, message } from '../interfaces'

const Users = (props: {
  users: userProps[]
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
}) => {
  const users = props.users

  const sortedByBookAmount = users
    ?.slice()
    .sort((a, b) => b.books.length - a.books.length)
    .map((user) => user)

  const navigate = useNavigate()

  if (!props.token) {
    setTimeout(() => navigate('/login'), 1000)
    return <div>Please log in</div>
  } else
    return (
      <div>
        <h1>Users</h1>
        <table>
          <tbody>
            <tr>
              <th>username</th>
              <th>favorite genre</th>
              <th>books added</th>
            </tr>
            {sortedByBookAmount?.map((u: userProps) => (
              <tr key={u.username}>
                <td>
                  <Link to={`/users/${u.id}`}>{u.username}</Link>
                </td>
                <td>{u.favoriteGenre}</td>
                <td>
                  {u.books
                    ?.slice()
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((book) => (
                      <p key={book.id}>
                        <Link to={`/books/${book.id}`}>{book.title}</Link>
                      </p>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}

export default Users
