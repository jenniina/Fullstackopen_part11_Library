import { useQuery } from '@apollo/client'
import { OrderBooksBy, OrderDirection, booksProps, userProps } from '../interfaces'
import { ME } from '../queries'
import { Link, useNavigate } from 'react-router-dom'
import { Dispatch, SetStateAction } from 'react'
import { InView } from 'react-intersection-observer'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'

const Books = (props: {
  books: booksProps[]
  token: string | null
  me: userProps
  setGenre: Dispatch<SetStateAction<string>>
  setLimitBooks: Dispatch<SetStateAction<number>>
  orderByBooks: OrderBooksBy
  setOrderByBooks: Dispatch<SetStateAction<OrderBooksBy>>
  orderDirectionBooks: OrderDirection
  setOrderDirectionBooks: Dispatch<SetStateAction<OrderDirection>>
}) => {
  const navigate = useNavigate()

  const user = useQuery(ME)

  const handleGenreRedirect = (genre: string) => {
    props.setGenre(genre)
    navigate('/books')
  }

  const favorite = user?.data?.me?.favoriteGenre

  const books = props.books

  const filteredBooksInGenre = books?.filter((book) => book.genres.includes(favorite))
  const filteredBooks = filteredBooksInGenre?.filter((book) => book.user !== props.me.id)

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
            {filteredBooks?.length === 0 ? (
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
                    <th>Title</th>
                    <th>Author</th>
                    <th>
                      <button
                        className="reset"
                        onClick={() => {
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
            {filteredBooks && (
              <InView
                onChange={async (inView) => {
                  if (inView) {
                    props.setLimitBooks((prev) => prev + 5)
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
