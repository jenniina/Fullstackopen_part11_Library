import { Link } from 'react-router-dom'
import { userProps, message } from '../interfaces'
import { ALL_USERS, EDIT_USER, ME } from '../queries'
import { useMutation } from '@apollo/client'
import { useState } from 'react'

const User = (props: {
  user: userProps
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
  me: userProps['id']
}) => {
  const user = props.user

  const [genre, setGenre] = useState('')
  const [username, setUsername] = useState('')

  const [editUser] = useMutation(EDIT_USER, {
    refetchQueries: [{ query: ALL_USERS }, { query: ME }],
    onError: (error) => {
      props.notify({ error: true, message: error.message }, 10)
      //console.log(JSON.stringify(error, null, 2))
    },
    onCompleted: () => {
      props.notify({ error: false, message: 'User edited!' }, 5)
    },
  })

  const handleGenreChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!genre) props.notify({ error: true, message: 'Please enter a genre' }, 10)
    else if (
      window.confirm(`Are you sure you want to change your favorite genre to ${genre}?`)
    ) {
      editUser({ variables: { id: props.me, setGenre: genre } })
      setGenre('')
    }
  }

  const handleUsernameChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) props.notify({ error: true, message: 'Please enter a username' }, 10)
    else if (
      window.confirm(`Are you sure you want to change your username to ${username}?`)
    ) {
      editUser({ variables: { id: props.me, setUsername: username } })
      setUsername('')
    }
  }

  if (!props.token) return <div>Please log in</div>
  return (
    <div>
      <h1>{user?.username}</h1>
      <table>
        <tbody>
          <tr>
            <th>favorite genre</th>
            <th>books added</th>
          </tr>
          <tr>
            <td>{user?.favoriteGenre}</td>
            <td>
              {user?.books
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
      {user.id === props.me ? (
        <div className='forms-wrap'>
          <form onSubmit={handleGenreChange}>
            <label htmlFor='genreInput'>Change favorite genre:</label>
            <input
              id='genreInput'
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
            <button type='submit'>change&nbsp;genre</button>
          </form>

          <form onSubmit={handleUsernameChange}>
            <label htmlFor='usernameInput'>Change username:</label>
            <input
              id='usernameInput'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <button type='submit'>change&nbsp;username</button>
          </form>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default User
