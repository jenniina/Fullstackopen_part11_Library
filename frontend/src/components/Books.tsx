import { useQuery } from '@apollo/client'
import { OrderAuthorsBy, OrderBooksBy, OrderDirection, booksProps } from '../interfaces'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FILTER_BOOKS } from '../queries'
import FeedBooks from './FeedBooks'
import { InView } from 'react-intersection-observer'
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa'

interface BookProps {
  genre: string
  setGenre: Dispatch<SetStateAction<string>>
  booklist: booksProps[]
}
const Books = ({ genre, setGenre, booklist }: BookProps) => {
  const [limit, setLimit] = useState(15)
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.ASC)
  const [orderBy, setOrderBy] = useState<OrderBooksBy>(OrderBooksBy.TITLE)
  const [currentGenre, setCurrentGenre] = useState(genre)

  const [orderByAuthor, setOrderByAuthor] = useState<Boolean>(false)
  const [orderByAuthorASC, setOrderByAuthorASC] = useState<Boolean>(true)

  const { data, loading, error, refetch } = useQuery(FILTER_BOOKS, {
    variables: {
      genre,
      offset: 0,
      limit,
      orderDirection,
      orderBy,
    },
  })
  // eslint-disable-next-line no-console

  const books = !orderByAuthor
    ? data?.allBooks
    : data?.allBooks
        ?.slice()
        .sort((a: { author: { surname: string } }, b: { author: { surname: string } }) =>
          orderByAuthorASC
            ? a.author.surname.localeCompare(b.author.surname)
            : b.author.surname.localeCompare(a.author.surname)
        )

  let genres = Array.prototype.concat.apply(
    [],
    booklist?.map((b: { genres: booksProps['genres'] }) => b.genres)
  )
  genres = [...new Set(genres)]

  useEffect(() => {
    refetch({ genre, orderDirection, orderBy })
  }, [genre, orderDirection, orderBy, refetch])

  const heading = 'Books'

  if (error) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(error, null, 2))
    return (
      <div>
        <big>There was an error loading the books</big>
      </div>
    )
  } else
    return (
      <div>
        <h1>
          <span data-text={heading}>{heading}</span>
        </h1>
        {loading ? (
          <div>
            <big>loading...</big>
          </div>
        ) : (
          <>
            <p>You may filter the books by pressing one of the buttons below:</p>
            <div className="genresButtons">
              <div>
                <button
                  className={`${currentGenre === '' ? 'active' : genre}`}
                  onClick={() => {
                    setGenre('')
                    setCurrentGenre('')
                  }}
                >
                  all genres
                </button>
              </div>
              {genres
                ?.sort((a, b) => a.localeCompare(b))
                .map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      setGenre(genre)
                      setCurrentGenre(genre)
                    }}
                    className={`${genre === currentGenre ? 'active' : genre}`}
                  >
                    {genre}
                  </button>
                ))}
            </div>
            <table className="tablebooks">
              <caption className="screen-reader-text">List of books</caption>
              <tbody>
                <tr>
                  <th>
                    <button
                      className="reset has-tooltip"
                      onClick={() => {
                        setOrderByAuthor(false)
                        setOrderBy(OrderBooksBy.TITLE)
                        orderDirection === OrderDirection.ASC
                          ? setOrderDirection(OrderDirection.DESC)
                          : setOrderDirection(OrderDirection.ASC)
                      }}
                      aria-describedby="description1"
                    >
                      Title
                      <span className="tooltip" role="tooltip" id="tooltip3">
                        sort&nbsp;by title
                      </span>{' '}
                      {orderBy === OrderBooksBy.TITLE ? (
                        orderDirection === OrderDirection.ASC ? (
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
                        setOrderBy(OrderBooksBy.AUTHOR)
                        setOrderByAuthorASC((prev) => !prev)
                        orderDirection === OrderDirection.ASC
                          ? setOrderDirection(OrderDirection.DESC)
                          : setOrderDirection(OrderDirection.ASC)
                      }}
                      aria-describedby="tooltip2"
                    >
                      Author
                      <span className="tooltip" role="tooltip" id="tooltip2">
                        sort&nbsp;by author&nbsp;surname <small>(sorts&nbsp;visible)</small>
                      </span>{' '}
                      {orderBy === OrderBooksBy.AUTHOR ? (
                        orderDirection === OrderDirection.ASC ? (
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
                        setOrderByAuthor(false)
                        setOrderBy(OrderBooksBy.PUBLISHED)
                        orderDirection === OrderDirection.ASC
                          ? setOrderDirection(OrderDirection.DESC)
                          : setOrderDirection(OrderDirection.ASC)
                      }}
                      aria-describedby="tooltip3"
                    >
                      Published
                      <span className="tooltip" role="tooltip" id="tooltip3">
                        sort&nbsp;by publish&nbsp;date
                      </span>{' '}
                      {orderBy === OrderBooksBy.PUBLISHED ? (
                        orderDirection === OrderDirection.ASC ? (
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
                  <FeedBooks key={a.title} a={a} />
                ))}
              </tbody>
            </table>
            {data && (
              <InView
                onChange={async (inView) => {
                  if (inView) {
                    setLimit((prev) => prev + 20)
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

//const books = props.books
//const [filteredBooks, setFilteredBooks] = useState(props.books)

// let genres = Array.prototype.concat.apply(
//   [],
//   filteredBooks.map((b) => b.genres)
// )
// genres = [...new Set(genres)]

// const handleGenre = (genre: string) => {
//   const filtered = books.filter((book) => book.genres.includes(genre))
//   setFilteredBooks(filtered)
// }
//   return (
//     <div>
//       <h2>books</h2>
//       <div>
//         <button onClick={() => setFilteredBooks(props.books)}>all genres</button>
//         {genres.map((genre) => (
//           <button key={genre} onClick={() => handleGenre(genre)}>
//             {genre}
//           </button>
//         ))}
//       </div>
//       <table>
//         <tbody>
//           <tr>
//             <th></th>
//             <th>author</th>
//             <th>published</th>
//           </tr>
//           {filteredBooks.map((a: booksProps) => (
//             <tr key={a.title}>
//               <td>{a.title}</td>
//               <td>{a.author.name}</td>
//               <td>{a.published}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default Books
