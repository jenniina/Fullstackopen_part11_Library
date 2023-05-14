import { userProps, message } from '../interfaces'

const Users = (props: {
  users: userProps[]
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
}) => {
  const users = props.users
  console.log(users?.map((user) => user.books?.map((book) => book)))
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
          {users?.map((a: userProps) => (
            <tr key={a.username}>
              <td>{a.username}</td>
              <td>{a.favoriteGenre}</td>
              <td>
                {a.books?.map((book) => (
                  <p key={book.title}>{book.title}</p>
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
