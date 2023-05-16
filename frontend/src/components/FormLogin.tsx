import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN, ME } from '../queries'
import { message } from '../interfaces'
import { useNavigate } from 'react-router-dom'
import { LIRARY_TOKEN } from '../App'

interface loginProps {
  notify: (info: message, seconds: number) => void
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}
const FormLogin = ({ notify, setToken }: loginProps) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const [login, result] = useMutation(LOGIN, {
    refetchQueries: [{ query: ME }],
    onError: (error) => {
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
  }, [result.data])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    login({ variables: { username, password } })
      .then(() => {
        setTimeout(() => {
          navigate('/')
        }, 500)
      })
      .catch((error) => notify({ error: true, message: error.message }, 10))
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <label>
          <span>username: </span>
          <input
            name='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <label>
          <span>password: </span>
          <input
            name='password'
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default FormLogin
