import { useQuery } from '@apollo/client'
import { booksProps } from '../interfaces'
import { useEffect, useState } from 'react'
import { FILTER_BOOKS, ALL_BOOKS } from '../queries'
import { Link } from 'react-router-dom'

const Books = () => {
  const [genre, setGenre] = useState<string>('')

  const { data, loading, error, refetch } = useQuery(FILTER_BOOKS)

  const books = data?.allBooks
    ?.slice()
    .sort(function (a: { title: string }, b: { title: string }) {
      let aTitle = a.title.toLowerCase()
      let bTitle = b.title.toLowerCase()
      if (aTitle > bTitle) {
        return 1
      } else if (aTitle < bTitle) {
        return -1
      } else {
        return 0
      }
    })

  let genres = Array.prototype.concat.apply(
    [],
    books?.map((b: { genres: booksProps['genres'] }) => b.genres)
  )
  genres = [...new Set(genres)]

  useEffect(() => {
    refetch({ genre: genre })
  }, [genre])

  if (loading || loading) {
    return <div>loading...</div>
  }
  if (error || error) {
    return <div>There was an error</div>
  }
  return (
    <div>
      <h1>Books</h1>
      <div className='genresButtons'>
        <button onClick={() => setGenre('')}>all genres</button>
        {genres?.map((genre) => (
          <button key={genre} onClick={() => setGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books?.map((a: booksProps) => (
            <tr key={a.title}>
              <td>
                <Link to={`/books/${a.id}`}>{a.title}</Link>
              </td>
              <td>
                <Link to={`/authors/${a.author.id}`}>{a.author.name}</Link>
              </td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
