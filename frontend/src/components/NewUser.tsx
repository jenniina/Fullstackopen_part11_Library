import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_USERS, CREATE_USER } from '../queries'
import { message, userProps } from '../interfaces'

const NewUser = (props: {
  notify: ({ error, message }: message, seconds: number) => void
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [genre, setGenre] = useState('')

  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: ALL_USERS }],
    onError: (error) => {
      props.notify({ error: true, message: error.message }, 10)
      //console.log(JSON.stringify(error, null, 2))
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

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    const user: userProps = {
      username,
      passwordHash: password,
      favoriteGenre: genre,
      books: [],
    }

    createUser({
      variables: user,
    })
      .then(() =>
        props.notify(
          { error: false, message: `Successfully made a new user "${username}"` },
          5
        )
      )
      .catch((e) =>
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(e.message, null, 2))
      )
  }

  return (
    <div>
      <h1>Add User</h1>
      <form onSubmit={submit}>
        <label>
          username:
          <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </label>
        <label>
          password:
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>

        <label>
          favorite genre:{' '}
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
        </label>
        <button type='submit'>create user</button>
      </form>
    </div>
  )
}

export default NewUser
