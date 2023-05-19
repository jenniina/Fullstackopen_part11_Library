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

  const heading = 'Users'

  if (!props.token) {
    setTimeout(() => navigate('/login'), 1000)
    return <div>Please log in</div>
  } else
    return (
      <div>
        <h1>
          <span data-text={heading}>{heading}</span>
        </h1>
        <table>
          <tbody>
            <tr>
              <th>Username</th>
              <th>Favorite genre</th>
              <th>Books added</th>
            </tr>
            {sortedByBookAmount?.map((u: userProps) => (
              <tr key={u.username}>
                <td>
                  <Link to={`/users/${u.id}`}>{u.username}</Link>
                </td>
                <td>{u.favoriteGenre}</td>
                <td>{u.books.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}

export default Users
