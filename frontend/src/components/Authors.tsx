import { useMutation } from '@apollo/client'
import { OrderAuthorsBy, OrderDirection, authorProps, message, userProps } from '../interfaces'
import { useEffect, useRef, useState, FormEvent, useMemo, Dispatch, SetStateAction } from 'react'
import { EDIT_BORN, ALL_AUTHORS, DELETE_AUTHOR } from '../queries'
import { Link } from 'react-router-dom'
import { Select, SelectOption } from './Select/Select'
import { InView } from 'react-intersection-observer'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'

const Authors = (props: {
  authors: {
    data: {
      allAuthors: authorProps[]
    }
    loading: boolean
  }
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
  me: userProps
  setLimitAuthors: Dispatch<SetStateAction<number>>
  orderDirectionAuthorsName: OrderDirection
  orderDirectionAuthorsBorn: OrderDirection
  orderByAuthors: OrderAuthorsBy
  setOrderByAuthors: Dispatch<SetStateAction<OrderAuthorsBy>>
  setOrderDirectionAuthorsName: Dispatch<SetStateAction<OrderDirection>>
  setOrderDirectionAuthorsBorn: Dispatch<SetStateAction<OrderDirection>>
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

  const [orderByBookCount, setOrderByBookCount] = useState<Boolean>(false)
  const [orderByBookCountASC, setOrderByBookCountASC] = useState<Boolean>(true)
  const [orderDirectionAuthorsBookCount, setOrderDirectionAuthorsBookCount] = useState<OrderDirection>(
    OrderDirection.ASC
  )

  const authors = !orderByBookCount
    ? props.authors?.data?.allAuthors
    : props.authors?.data?.allAuthors
        ?.slice()
        .sort((a, b) => (orderByBookCountASC ? b.bookCount - a.bookCount : a.bookCount - b.bookCount))

  const chooseOne = 'Choose one'

  const authorsWithoutBorn = authors?.map((a) => (!a.born ? a.name : null)).filter((a) => a !== null)

  // const authorsWithoutBornObjects: SelectOption[] = Object.entries(
  //   authorsWithoutBorn
  // ).map(([label, value]) => ({
  //   label: value,
  //   value: value,
  // }))

  let authorsWithoutBornObjects: SelectOption[] = useMemo(
    () => [
      {
        label: chooseOne,
        value: 'nothing chosen',
      },
    ],
    []
  )

  useEffect(() => {
    if (authorsWithoutBornObjects?.length < authorsWithoutBorn?.length) {
      authorsWithoutBornObjects = [
        {
          label: chooseOne,
          value: 'nothing chosen',
        },
      ]

      for (let object in authorsWithoutBorn) {
        authorsWithoutBornObjects.push({
          label: authorsWithoutBorn[object],
          value: authorsWithoutBorn[object],
        })
      }
    }
  }, [authorsWithoutBorn?.length, authorsWithoutBornObjects?.length])

  const authorsWithBorn = authors?.map((a) => (!a.born ? null : `${a.name}: ${a.born}`)).filter((a) => a !== null)

  let authorsWITHBornObjects: SelectOption[] = useMemo(
    () => [
      {
        label: chooseOne,
        value: 'nothing chosen',
      },
    ],
    []
  )

  useEffect(() => {
    if (authorsWITHBornObjects?.length < authorsWithBorn?.length) {
      authorsWITHBornObjects = [
        {
          label: chooseOne,
          value: 'nothing chosen',
        },
      ]

      for (let object in authorsWithBorn) {
        authorsWITHBornObjects.push({
          label: authorsWithBorn[object],
          value: authorsWithBorn[object],
        })
      }
    }
  }, [authorsWithBorn?.length, authorsWITHBornObjects?.length])

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
    const noBooks = authors?.find((author: authorProps) => author.bookCount === 0)
    if (noBooks) deleteAuthor({ variables: { name: noBooks?.name } })
  }, [authors, deleteAuthor])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (name1?.label === chooseOne) props.notify({ error: true, message: 'Please choose an author' }, 5)
    else if (!born) props.notify({ error: true, message: 'Please fill in the birth year field' }, 5)
    else if (Number(born) > 2023) props.notify({ error: true, message: 'Please try an earlier year' }, 5)
    else if (Number(born) < -5000) props.notify({ error: true, message: 'Please try a later year' }, 5)
    else if (window.confirm(`Add birthdate: ${born}?`)) {
      editAuthorBornYear({ variables: { name: name1?.label, setBornTo: Number(born) } })
      addRef.current?.reset()
    }
  }

  const handleSubmit2 = (e: FormEvent) => {
    e.preventDefault()
    if (name2?.label === chooseOne) props.notify({ error: true, message: 'Please choose an author' }, 5)
    else if (!born2) props.notify({ error: true, message: 'Please fill in the birth year field' }, 5)
    else if (window.confirm(`Change birthdate to ${born2}?`)) {
      editAuthorBornYear({ variables: { name: name2?.label, setBornTo: Number(born2) } })
      changeRef.current?.reset()
    }
  }

  const heading = 'Authors'

  return (
    <div>
      <h1>
        <span data-text={heading}>{heading}</span>
      </h1>
      {authors.length === 0 ? (
        <div>No authors yet!</div>
      ) : (
        <>
          <p>
            It may be wise to take the birth years listed here with a grain of salt, as anyone who is logged in may
            change them! Even <em>Tester.</em>
          </p>
          {props.authors?.loading ? (
            <div>
              <big>Loading...</big>
            </div>
          ) : (
            <>
              <table className="tableauthors">
                <caption className="screen-reader-text">
                  List of authors, with author name, birth date and book count. Note that anyone can edit the birth
                  dates.
                </caption>
                <tbody>
                  <tr>
                    <th>
                      <button
                        className="reset has-tooltip"
                        onClick={() => {
                          setOrderByBookCount(false)
                          props.setOrderByAuthors(OrderAuthorsBy.NAME)
                          props.orderDirectionAuthorsName === OrderDirection.ASC
                            ? props.setOrderDirectionAuthorsName(OrderDirection.DESC)
                            : props.setOrderDirectionAuthorsName(OrderDirection.ASC)
                        }}
                        aria-describedby="tooltip1"
                      >
                        Author
                        <span className="tooltip" role="tooltip" id="tooltip1">
                          sort&nbsp;by author&nbsp;surname
                        </span>{' '}
                        {props.orderByAuthors === OrderAuthorsBy.NAME ? (
                          props.orderDirectionAuthorsName === OrderDirection.ASC ? (
                            <FaSortUp style={{ marginBottom: -2 }} />
                          ) : (
                            <FaSortDown style={{ marginBottom: -2 }} />
                          )
                        ) : (
                          <FaSort style={{ marginBottom: -2 }} />
                        )}
                      </button>
                    </th>
                    <th>
                      <button
                        className="reset has-tooltip"
                        onClick={() => {
                          setOrderByBookCount(false)
                          props.setOrderByAuthors(OrderAuthorsBy.BORN)
                          props.orderDirectionAuthorsBorn === OrderDirection.ASC
                            ? props.setOrderDirectionAuthorsBorn(OrderDirection.DESC)
                            : props.setOrderDirectionAuthorsBorn(OrderDirection.ASC)
                        }}
                        aria-describedby="tooltip2"
                      >
                        Born
                        <span className="tooltip" role="tooltip" id="tooltip2">
                          sort&nbsp;by birth&nbsp;date
                        </span>{' '}
                        {props.orderByAuthors === OrderAuthorsBy.BORN ? (
                          props.orderDirectionAuthorsBorn === OrderDirection.ASC ? (
                            <FaSortUp style={{ marginBottom: -2 }} />
                          ) : (
                            <FaSortDown style={{ marginBottom: -2 }} />
                          )
                        ) : (
                          <FaSort style={{ marginBottom: -2 }} />
                        )}
                      </button>
                    </th>
                    <th>
                      <button
                        className="reset has-tooltip"
                        onClick={() => {
                          setOrderByBookCount(true)
                          props.setOrderByAuthors(OrderAuthorsBy.BOOKS)
                          setOrderByBookCountASC((prev) => !prev)
                          orderDirectionAuthorsBookCount === OrderDirection.ASC
                            ? setOrderDirectionAuthorsBookCount(OrderDirection.DESC)
                            : setOrderDirectionAuthorsBookCount(OrderDirection.ASC)
                        }}
                        aria-describedby="tooltip3"
                      >
                        Books
                        <span className="tooltip" role="tooltip" id="tooltip3">
                          sort&nbsp;by book&nbsp;count <small>(sorts&nbsp;visible)</small>
                        </span>{' '}
                        {props.orderByAuthors === OrderAuthorsBy.BOOKS ? (
                          orderDirectionAuthorsBookCount === OrderDirection.ASC ? (
                            <FaSortUp style={{ marginBottom: -2 }} />
                          ) : (
                            <FaSortDown style={{ marginBottom: -2 }} />
                          )
                        ) : (
                          <FaSort style={{ marginBottom: -2 }} />
                        )}
                      </button>
                    </th>
                  </tr>
                  {authors?.slice().map((a: authorProps) => (
                    <tr key={a.name}>
                      <td>
                        <Link to={`/authors/${a.id}`}>{a.name}</Link>
                      </td>
                      <td>{a.born && a.born < 0 ? `${Math.abs(a.born)} BC` : a.born}</td>
                      <td>{a.bookCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {authors && (
                <InView
                  onChange={async (inView) => {
                    if (inView) {
                      props.setLimitAuthors((prev) => prev + 20)
                    }
                  }}
                />
              )}
            </>
          )}{' '}
          {!props.token ? (
            ''
          ) : (
            <>
              {authorsWithoutBorn?.length > 1 ? (
                <form ref={addRef} className="form-authors" onSubmit={handleSubmit}>
                  <legend>Add birthyear</legend>
                  <label className="top">
                    <span className="padding">Author:</span>
                    <Select
                      id="single"
                      className=""
                      instructions="Please choose an author to add their birth date"
                      hide
                      options={authorsWithoutBornObjects}
                      value={name1}
                      onChange={(e) => {
                        setName1(e)
                      }}
                    />
                  </label>
                  <div className="input-wrap">
                    <label>
                      <input type="number" name="born" required onChange={({ target }) => setBorn(target.value)} />
                      <span>Birth Year:</span>
                    </label>
                  </div>
                  <button type="submit">submit</button>
                </form>
              ) : (
                ''
              )}

              <form ref={changeRef} className="form-authors" onSubmit={handleSubmit2}>
                <legend>Change birthyear</legend>
                <label className="top">
                  <span className="padding">Author:</span>
                  <Select
                    id="single"
                    className=""
                    instructions="Please choose an author to change their birth date"
                    hide
                    options={authorsWITHBornObjects}
                    value={name2}
                    onChange={(e) => {
                      setName2(e)
                    }}
                  />
                </label>
                <div className="input-wrap">
                  <label>
                    <input type="number" name="born" required onChange={({ target }) => setBorn2(target.value)} />
                    <span>Birth Year:</span>
                  </label>
                </div>
                <button type="submit">submit</button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Authors
