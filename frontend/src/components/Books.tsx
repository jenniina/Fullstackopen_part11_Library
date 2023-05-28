import { useQuery } from '@apollo/client'
import { OrderBy, OrderDirection, booksProps } from '../interfaces'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FILTER_BOOKS } from '../queries'
import FeedBooks from './FeedBooks'
import { InView } from 'react-intersection-observer'
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti'

interface BookProps {
  genre: string
  setGenre: Dispatch<SetStateAction<string>>
  booklist: booksProps[]
}
const Books = ({ genre, setGenre, booklist }: BookProps) => {
  const [limit, setLimit] = useState(6)
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.ASC)
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.TITLE)
  const [currentGenre, setCurrentGenre] = useState(genre)

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

  const books = data?.allBooks?.slice()
  // .sort(function (a: { title: string }, b: { title: string }) {
  //   let aTitle = a.title.toLowerCase()
  //   let bTitle = b.title.toLowerCase()
  //   if (aTitle > bTitle) {
  //     return 1
  //   } else if (aTitle < bTitle) {
  //     return -1
  //   } else {
  //     return 0
  //   }
  // })

  let genres = Array.prototype.concat.apply(
    [],
    booklist?.map((b: { genres: booksProps['genres'] }) => b.genres)
  )
  genres = [...new Set(genres)]

  useEffect(() => {
    refetch({ genre })
  }, [genre, refetch])

  useEffect(() => {
    refetch({ orderDirection })
  }, [orderDirection, refetch])

  useEffect(() => {
    refetch({ orderBy })
  }, [orderBy, refetch])

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
              <tbody>
                <tr>
                  <th>
                    <button
                      className="reset"
                      onClick={() => {
                        orderDirection === OrderDirection.ASC
                          ? setOrderDirection(OrderDirection.DESC)
                          : setOrderDirection(OrderDirection.ASC)
                      }}
                    >
                      Title{' '}
                      {orderDirection === OrderDirection.ASC ? (
                        <TiArrowSortedUp style={{ marginBottom: -2 }} />
                      ) : (
                        <TiArrowSortedDown style={{ marginBottom: -2 }} />
                      )}
                    </button>
                  </th>
                  <th>Author</th>
                  <th>Published</th>
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
                    setLimit((prev) => prev + 6)
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
