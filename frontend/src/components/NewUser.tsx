import { useEffect, useState, FormEvent, Dispatch, SetStateAction } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_USERS, CREATE_USER, LOGIN, ME } from '../queries'
import { message, userProps } from '../interfaces'
import { useNavigate } from 'react-router-dom'
import { LIRARY_TOKEN } from '../App'

const NewUser = (props: {
  notify: ({ error, message }: message, seconds: number) => void
  setToken: Dispatch<SetStateAction<string | null>>
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [genre, setGenre] = useState('')

  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: ALL_USERS }],
    onError: (error) => {
      props.notify({ error: true, message: error.message }, 10)
      // eslint-disable-next-line no-console
      //console.error(JSON.stringify(error, null, 2))
    },
    onCompleted: () => {
      zero()
    },
  })

  const zero = () => {
    setUsername('')
    setPassword('')
    setGenre('')
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (username?.length > 15) props.notify({ error: false, message: 'Please try a shorter username' }, 5)
    else {
      const user: userProps = {
        username,
        passwordHash: password,
        favoriteGenre: genre,
        books: [],
      }

      createUser({
        variables: user,
      })
        .then(() => props.notify({ error: false, message: `Successfully made a new user "${username}"` }, 5))
        .then(() => login({ variables: { username, password } }))
        .catch((error) => {
          props.notify({ error: true, message: error.message }, 10)
          // eslint-disable-next-line no-console
          console.error(JSON.stringify(error.message, null, 2))
        })
    }
  }

  const navigate = useNavigate()

  const [login, result] = useMutation(LOGIN, {
    refetchQueries: [{ query: ME }],
    onError: (error) => {
      // eslint-disable-next-line no-console
      //console.error(JSON.stringify(error, null, 2))
      props.notify({ error: true, message: error.message }, 10)
    },
    onCompleted: () => {
      setTimeout(() => {
        navigate('/')
      }, 500)
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem(LIRARY_TOKEN, token) //keep name same also in App.tsx and main.tsx
    }
  }, [result.data, props])

  return (
    <div>
      <h1 className="screen-reader-text">Add User</h1>
      <form onSubmit={submit}>
        <legend>Add User</legend>
        <div className="input-wrap">
          <label>
            <input value={username} required type="text" onChange={({ target }) => setUsername(target.value)} />
            <span>username </span>
          </label>
        </div>
        <div className="input-wrap">
          <label>
            <input type="password" value={password} required onChange={({ target }) => setPassword(target.value)} />
            <span>password </span>
          </label>
        </div>

        <div className="input-wrap">
          <label>
            <input value={genre} required type="text" onChange={({ target }) => setGenre(target.value)} />
            <span>favorite genre </span>
          </label>
        </div>
        <button type="submit">create user</button>
      </form>
    </div>
  )
}

export default NewUser
