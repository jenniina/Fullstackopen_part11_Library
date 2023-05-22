import { Link, useNavigate } from 'react-router-dom'
import { userProps, message } from '../interfaces'
import { ALL_USERS, EDIT_USER, ME } from '../queries'
import { useMutation } from '@apollo/client'
import { useState, FormEvent } from 'react'
import { tester } from '../App'

const User = (props: {
  user: userProps
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
  me: userProps
}) => {
  const user = props.user

  const [genre, setGenre] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const navigate = useNavigate()

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

  const handleGenreChange = (e: FormEvent) => {
    e.preventDefault()
    if (!genre) props.notify({ error: true, message: 'Please enter a genre' }, 10)
    else if (props.me?.id === tester)
      props.notify(
        {
          error: true,
          message: 'Unfortunately, Tester may not change the settings! Please request a real account from the admin',
        },
        10
      )
    else if (window.confirm(`Are you sure you want to change your favorite genre to ${genre}?`)) {
      editUser({ variables: { id: props.me?.id, setGenre: genre } })
      setGenre('')
    }
  }

  const handleUsernameChange = (e: FormEvent) => {
    e.preventDefault()
    if (!username) props.notify({ error: true, message: 'Please enter a username' }, 10)
    else if (props.me?.id === tester)
      props.notify(
        {
          error: true,
          message: 'Unfortunately, Tester may not change the settings! Please request a real account from the admin',
        },
        10
      )
    else if (window.confirm(`Are you sure you want to change your username to ${username}?`)) {
      editUser({ variables: { id: props.me?.id, setUsername: username } })
      setUsername('')
    }
  }

  const handlePasswordChange = (e: FormEvent) => {
    e.preventDefault()
    if (!password) props.notify({ error: true, message: 'Please enter a password' }, 10)
    else if (password !== passwordConfirm) props.notify({ error: true, message: 'Passwords do not match!' }, 10)
    else if (props.me?.id === tester)
      props.notify(
        {
          error: true,
          message: 'Unfortunately, Tester may not change the settings! Please request a real account from the admin',
        },
        10
      )
    else if (window.confirm('Are you sure you want to change your password?')) {
      editUser({ variables: { id: props.me?.id, setPassword: password } })
      setPassword('')
      setPasswordConfirm('')
    }
  }

  const heading = user?.username

  if (!props.token) {
    setTimeout(() => navigate('/login'), 1000)
    return <div>Please log in</div>
  } else
    return (
      <div>
        <h1>
          <span data-text={heading}>{heading}</span>
        </h1>

        <p>
          <span>Favorite genre: </span>
          <span>
            <Link to={'/recommended'}>
              <em>{user?.favoriteGenre}</em>
            </Link>
          </span>
        </p>
        {user?.books.length === 0 || user?.books === undefined ? (
          <>
            <p>No books added yet!</p>
            {user.id === props.me?.id && user.id !== tester ? (
              <p>
                <Link to="/addBook">Add a book</Link>
              </p>
            ) : (
              ''
            )}
          </>
        ) : (
          <table>
            <tbody>
              <tr>
                <th>Books added</th>
                <th>Author</th>
              </tr>

              {user?.books
                ?.slice()
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((book) => (
                  <tr key={book?.id}>
                    <td>
                      <Link to={`/books/${book?.id}`}>{book?.title}</Link>
                    </td>
                    <td>
                      <Link to={`/authors/${book?.author?.id}`}>{book?.author?.name}</Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {user?.id === props.me?.id ? (
          <>
            <h2>Settings</h2>
            <div className="forms-wrap">
              <div>
                <form className="form-user" onSubmit={handleGenreChange}>
                  <legend>Change favorite genre</legend>
                  <div className="input-wrap">
                    <label htmlFor="genreInput">
                      <input
                        id="genreInput"
                        value={genre}
                        required
                        type="text"
                        onChange={({ target }) => setGenre(target.value)}
                      />
                      <span>
                        <small>Change favorite genre</small>
                      </span>
                    </label>
                  </div>
                  <button type="submit">change&nbsp;genre</button>
                </form>

                <form className="form-user" onSubmit={handleUsernameChange}>
                  <legend>Change username</legend>
                  <div className="input-wrap">
                    <label htmlFor="usernameInput">
                      <input
                        id="usernameInput"
                        required
                        type="text"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                      />
                      <span>
                        <small>Change username</small>
                      </span>
                    </label>
                  </div>
                  <button type="submit">change&nbsp;username</button>
                </form>
              </div>
              <div>
                <form className="form-user" onSubmit={handlePasswordChange}>
                  <legend>Change password</legend>

                  <div className="input-wrap">
                    <label htmlFor="passwordInput">
                      <input
                        id="passwordInput"
                        value={password}
                        required
                        type="password"
                        onChange={({ target }) => setPassword(target.value)}
                      />
                      <span>
                        <small>Change password</small>
                      </span>
                    </label>
                  </div>
                  <div className="input-wrap">
                    <label htmlFor="passwordInputConfirm">
                      <input
                        id="passwordInputConfirm"
                        value={passwordConfirm}
                        required
                        type="password"
                        onChange={({ target }) => setPasswordConfirm(target.value)}
                      />
                      <span>
                        <small>Confirm password</small>
                      </span>
                    </label>
                  </div>
                  <button type="submit">change&nbsp;password</button>
                </form>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    )
}

export default User
