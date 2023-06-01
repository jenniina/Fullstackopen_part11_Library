import { useState, useEffect, FormEvent, Dispatch, SetStateAction } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN, ME } from '../queries'
import { message } from '../interfaces'
import { useNavigate } from 'react-router-dom'
import { LIRARY_TOKEN } from '../App'

interface loginProps {
  notify: (info: message, seconds: number) => void
  setToken: Dispatch<SetStateAction<string | null>>
  token: string | null
}
const FormLogin = ({ notify, setToken, token }: loginProps) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const [login, result] = useMutation(LOGIN, {
    refetchQueries: [{ query: ME }],
    onError: (error) => {
      // eslint-disable-next-line no-console
      //console.log(JSON.stringify(error, null, 2))
      notify({ error: true, message: error.message }, 10)
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem(LIRARY_TOKEN, token) //keep name same also in App.tsx and main.tsx
    }
  }, [result.data, setToken])

  const submit = async (event: FormEvent) => {
    event.preventDefault()

    login({ variables: { username, password } })
      .then(() => {
        window.location.reload()
      })
      .catch((error) => notify({ error: true, message: error.message }, 10))
  }

  useEffect(() => {
    if (token) {
      setTimeout(() => navigate('/'), 2000)
    }
  }, [token, navigate])

  if (token) {
    return <div>Thank you for logging in</div>
  } else
    return (
      <div>
        <h1 className="screen-reader-text">Login</h1>
        <form className="form-login" onSubmit={submit}>
          <legend>Login</legend>
          <div className="input-wrap">
            <label data-test="username">
              <input
                name="username"
                value={username}
                required
                type="text"
                onChange={({ target }) => setUsername(target.value)}
              />
              <span>username: </span>
            </label>
          </div>
          <div className="input-wrap">
            <label data-test="password">
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
              <span>password: </span>
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
}

export default FormLogin
