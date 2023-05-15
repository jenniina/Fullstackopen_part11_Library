import { Link } from 'react-router-dom'
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

  if (!props.token) return <div></div>
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
              <td>{u.username}</td>
              <td>{u.favoriteGenre}</td>
              <td>
                {u.books
                  ?.slice()
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((book) => (
                    <p>
                      <Link to={`/books/${book.id}`} key={book.title}>
                        {book.title}
                      </Link>
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
