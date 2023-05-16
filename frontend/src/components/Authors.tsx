import { useMutation } from '@apollo/client'
import { authorProps, message } from '../interfaces'
import { useEffect, useState } from 'react'
import { EDIT_BORN, ALL_AUTHORS, DELETE_AUTHOR } from '../queries'
import { Link } from 'react-router-dom'

const Authors = (props: {
  authors: authorProps[]
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
}) => {
  const [name, setName] = useState<string>('')
  const [born, setBorn] = useState<number | string | undefined>('')

  const authors = props.authors

  const authorsWithoutBorn = authors
    ?.map((a) => (!a.born ? a.name : null))
    .filter((a) => a !== null)

  const authorsWithBorn = authors
    ?.map((a) => (!a.born ? null : a.name))
    .filter((a) => a !== null)

  const [editAuthorBornYear] = useMutation(EDIT_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      props.notify({ error: true, message: error.message }, 10)
    },
    onCompleted: () => {
      props.notify({ error: false, message: 'Birth year changed!' }, 5)
    },
  })

  const [deleteAuthor] = useMutation(DELETE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(error, null, 2))
    },
  })
  useEffect(() => {
    //Delete authors with no books
    const noBooks = authors?.find(
      (author: authorProps, _i: number) => author.bookCount === 0
    )
    console.log('noBooks: ', noBooks)
    if (noBooks) deleteAuthor({ variables: { name: noBooks?.name } })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    editAuthorBornYear({ variables: { name, setBornTo: Number(born) } })
  }

  return (
    <div>
      <h1>Authors</h1>
      <table>
        <tbody>
          <tr>
            <th>author</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors?.map((a: authorProps) => (
            <tr key={a.name}>
              <td>
                <Link to={`/authors/${a.id}`}>{a.name}</Link>
              </td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!props.token ? (
        ''
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <h2>Add birthyear</h2>
            <label>
              <span>Author:</span>
              <select value={name} onChange={({ target }) => setName(target.value)}>
                {authorsWithoutBorn?.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Birth Year:</span>
              <input
                type='number'
                name='born'
                onChange={({ target }) => setBorn(target.value)}
              />
            </label>
            <button type='submit'>submit</button>
          </form>

          <form onSubmit={handleSubmit}>
            <h2>Change birthyear</h2>
            <label>
              <span>Author:</span>
              <select value={name} onChange={({ target }) => setName(target.value)}>
                {authorsWithBorn?.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Birth Year:</span>
              <input
                type='number'
                name='born'
                onChange={({ target }) => setBorn(target.value)}
              />
            </label>
            <button type='submit'>submit</button>
          </form>
        </>
      )}
    </div>
  )
}

export default Authors
