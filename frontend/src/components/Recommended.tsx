import { useQuery } from '@apollo/client'
import { OrderBooksBy, OrderDirection, booksProps, userProps } from '../interfaces'
import { FILTER_BOOKS, ME } from '../queries'
import { Link, useNavigate } from 'react-router-dom'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { InView } from 'react-intersection-observer'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'

const Books = (props: {
  token: string | null
  me: userProps
  setGenre: Dispatch<SetStateAction<string>>
  orderByBooks: OrderBooksBy
  setOrderByBooks: Dispatch<SetStateAction<OrderBooksBy>>
  orderDirectionBooks: OrderDirection
  setOrderDirectionBooks: Dispatch<SetStateAction<OrderDirection>>
}) => {
  const [limitBooks, setLimitBooks] = useState(15)
  const [orderByAuthor, setOrderByAuthor] = useState<Boolean>(false)
  const [orderByAuthorASC, setOrderByAuthorASC] = useState<Boolean>(true)

  const favorite = props.me?.favoriteGenre

  const resultFilterByFavoriteGenre = useQuery(FILTER_BOOKS, {
    variables: {
      genre: favorite,
      offset: 0,
      limit: limitBooks,
      orderDirection: props.orderDirectionBooks,
      orderBy: props.orderByBooks,
    },
  })

  useEffect(() => {
    resultFilterByFavoriteGenre.refetch({
      genre: favorite,
      orderBy: props.orderByBooks,
      orderDirection: props.orderDirectionBooks,
    })
  }, [favorite, props.orderDirectionBooks, props.orderByBooks, resultFilterByFavoriteGenre.refetch])

  // extra filtering due to unreliable graphql filter:
  const filteredBooksInGenre = resultFilterByFavoriteGenre?.data?.allBooks?.filter((book: { genres: string[] }) =>
    book.genres.includes(favorite)
  )
  const filteredBooks = filteredBooksInGenre?.filter((book: { user: string }) => book.user !== props.me?.id)

  const books = !orderByAuthor
    ? filteredBooks
    : filteredBooks
        ?.slice()
        .sort((a: { author: { surname: string } }, b: { author: { surname: string } }) =>
          orderByAuthorASC
            ? a.author.surname.localeCompare(b.author.surname)
            : b.author.surname.localeCompare(a.author.surname)
        )

  const navigate = useNavigate()

  const user = useQuery(ME)

  const handleGenreRedirect = (genre: string) => {
    props.setGenre(genre)
    navigate('/books')
  }

  //const favorite = user?.data?.me?.favoriteGenre

  //const filteredBooks = props.books

  const heading = 'Recommendations'

  if (!props.token) {
    setTimeout(() => navigate('/login'), 1000)
    return <div>Please log in</div>
  } else
    return (
      <div>
        <h1>
          <span data-text={heading}>{heading}</span>
        </h1>
        {user?.loading ? (
          <div>
            <big>loading...</big>
          </div>
        ) : (
          <>
            <p>
              Books added by others in your favorite genre
              <button
                style={{ display: 'block', margin: '0 auto' }}
                className="link-btn"
                onClick={() => handleGenreRedirect(favorite)}
              >
                <big>
                  <em>{favorite}</em>
                </big>
              </button>
            </p>
            {books?.length === 0 ? (
              <>
                <p>Oh no! No-one else has added any books in your favorite genre, yet!</p>
                <p>
                  See <Link to={`/users/${props.me?.id}`}>your books</Link>
                </p>
              </>
            ) : (
              <table>
                <tbody>
                  <tr>
                    <th>
                      <button
                        className="reset"
                        onClick={() => {
                          setOrderByAuthor(false)
                          props.setOrderByBooks(OrderBooksBy.TITLE)
                          props.orderDirectionBooks === OrderDirection.ASC
                            ? props.setOrderDirectionBooks(OrderDirection.DESC)
                            : props.setOrderDirectionBooks(OrderDirection.ASC)
                        }}
                        aria-describedby="description1"
                      >
                        Title
                        <span className="screen-reader-text" id="description1">
                          sort by title
                        </span>{' '}
                        {props.orderByBooks === OrderBooksBy.TITLE ? (
                          props.orderDirectionBooks === OrderDirection.ASC ? (
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
                          setOrderByAuthor(true)
                          setOrderByAuthorASC((prev) => !prev)
                          props.setOrderByBooks(OrderBooksBy.AUTHOR)
                          props.orderDirectionBooks === OrderDirection.ASC
                            ? props.setOrderDirectionBooks(OrderDirection.DESC)
                            : props.setOrderDirectionBooks(OrderDirection.ASC)
                        }}
                        aria-describedby="tooltip2"
                      >
                        Author
                        <span className="tooltip" role="tooltip" id="tooltip2">
                          sort&nbsp;by author&nbsp;surname (sorts&nbsp;visible)
                        </span>{' '}
                        {props.orderByBooks === OrderBooksBy.AUTHOR ? (
                          props.orderDirectionBooks === OrderDirection.ASC ? (
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
                        className="reset"
                        onClick={() => {
                          setOrderByAuthor(false)
                          props.setOrderByBooks(OrderBooksBy.PUBLISHED)
                          props.orderDirectionBooks === OrderDirection.ASC
                            ? props.setOrderDirectionBooks(OrderDirection.DESC)
                            : props.setOrderDirectionBooks(OrderDirection.ASC)
                        }}
                        aria-describedby="description3"
                      >
                        Published
                        <span className="screen-reader-text" id="description3">
                          sort by publish date
                        </span>{' '}
                        {props.orderByBooks === OrderBooksBy.PUBLISHED ? (
                          props.orderDirectionBooks === OrderDirection.ASC ? (
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
                  {books?.map((a: booksProps) => (
                    <tr key={a.title}>
                      <td>
                        <Link to={`/books/${a.id}`}>{a.title}</Link>
                      </td>
                      <td>
                        <Link to={`/authors/${a.author.id}`}>{a.author.name}</Link>
                      </td>
                      <td>{a.published && a.published < 0 ? `${Math.abs(a.published)} BC` : a.published}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {books && (
              <InView
                onChange={async (inView) => {
                  if (inView) {
                    setLimitBooks((prev) => prev + 20)
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    )
}

export default Books
