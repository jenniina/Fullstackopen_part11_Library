import { useMutation } from '@apollo/client'
import { authorProps, message } from '../interfaces'
import { useEffect, useRef, useState } from 'react'
import { EDIT_BORN, ALL_AUTHORS, DELETE_AUTHOR } from '../queries'
import { Link } from 'react-router-dom'
import { Select, SelectOption } from './Select/Select'

const Authors = (props: {
  authors: authorProps[]
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
}) => {
  const [name1, setName1] = useState<SelectOption | undefined>({
    label: 'Choose one',
    value: 'No choice',
  })
  const [name2, setName2] = useState<SelectOption | undefined>({
    label: 'Choose one',
    value: 'No choice',
  })
  const [born, setBorn] = useState<number | string | undefined>('')
  const [born2, setBorn2] = useState<number | string | undefined>('')
  const addRef = useRef<HTMLFormElement>(null)
  const changeRef = useRef<HTMLFormElement>(null)

  const authors = props.authors

  const chooseOne = 'Choose one'

  const authorsWithoutBorn = authors
    ?.map((a) => (!a.born ? a.name : null))
    .filter((a) => a !== null)

  // console.log(authors)
  // const authorsWithoutBornObjects: SelectOption[] = Object.entries(
  //   authorsWithoutBorn
  // ).map(([label, value]) => ({
  //   label: value,
  //   value: value,
  // }))

  let authorsWithoutBornObjects: SelectOption[] = [
    {
      label: chooseOne,
      value: 'nothing chosen',
    },
  ]
  let authorsWithoutBornObjectsHasRun = false

  useEffect(() => {
    if (!authorsWithoutBornObjectsHasRun) {
      for (let object in authorsWithoutBorn) {
        authorsWithoutBornObjects.push({
          label: authorsWithoutBorn[object],
          value: authorsWithoutBorn[object],
        })
      }
    }
    authorsWithoutBornObjectsHasRun = true
  }, [authorsWithoutBorn])

  console.log(authorsWithoutBornObjects)

  const authorsWithBorn = authors
    ?.map((a) => (!a.born ? null : `${a.name}: ${a.born}`))
    .filter((a) => a !== null)

  let authorsWITHBornObjects: SelectOption[] = [
    {
      label: chooseOne,
      value: 'nothing chosen',
    },
  ]
  let authorsWITHBornObjectsHasRun = false

  useEffect(() => {
    if (!authorsWITHBornObjectsHasRun) {
      for (let object in authorsWithBorn) {
        authorsWITHBornObjects.push({
          label: authorsWithBorn[object],
          value: authorsWithBorn[object],
        })
      }
    }
    authorsWITHBornObjectsHasRun = true
  }, [authorsWithoutBorn])

  console.log(authorsWITHBornObjects)

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
    if (noBooks) deleteAuthor({ variables: { name: noBooks?.name } })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name1?.label === chooseOne)
      props.notify({ error: true, message: 'Please choose an author' }, 5)
    else if (!born)
      props.notify({ error: true, message: 'Please fill in the birth year field' }, 5)
    else if (window.confirm(`Add birthdate: ${born}?`)) {
      editAuthorBornYear({ variables: { name: name1?.label, setBornTo: Number(born) } })
      addRef.current?.reset()
    }
  }

  const handleSubmit2 = (e: React.FormEvent) => {
    e.preventDefault()
    if (name2?.label === chooseOne)
      props.notify({ error: true, message: 'Please choose an author' }, 5)
    else if (!born2)
      props.notify({ error: true, message: 'Please fill in the birth year field' }, 5)
    else if (window.confirm(`Change birthdate to ${born2}?`)) {
      editAuthorBornYear({ variables: { name: name2?.label, setBornTo: Number(born2) } })
      changeRef.current?.reset()
    }
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
          {authors
            ?.slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((a: authorProps) => (
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
          <form ref={addRef} className='form-authors' onSubmit={handleSubmit}>
            <legend>Add birthyear</legend>
            <label className='top'>
              <span className='padding'>Author:</span>
              <Select
                id='single'
                className=''
                instructions='Please choose an author to add their birth date'
                hide
                options={authorsWithoutBornObjects}
                value={name1}
                onChange={(e) => {
                  setName1(e)
                }}
              />
            </label>
            <div className='input-wrap'>
              <label>
                <input
                  type='number'
                  name='born'
                  required
                  onChange={({ target }) => setBorn(target.value)}
                />
                <span>Birth Year:</span>
              </label>
            </div>
            <button type='submit'>submit</button>
          </form>

          <form ref={changeRef} className='form-authors' onSubmit={handleSubmit2}>
            <legend>Change birthyear</legend>
            <label className='top'>
              <span className='padding'>Author:</span>
              <Select
                id='single'
                className=''
                instructions='Please choose an author to change their birth date'
                hide
                options={authorsWITHBornObjects}
                value={name2}
                onChange={(e) => {
                  setName2(e)
                }}
              />
            </label>
            <div className='input-wrap'>
              <label>
                <input
                  type='number'
                  name='born'
                  required
                  onChange={({ target }) => setBorn2(target.value)}
                />
                <span>Birth Year:</span>
              </label>
            </div>
            <button type='submit'>submit</button>
          </form>
        </>
      )}
    </div>
  )
}

export default Authors
