import { useQuery } from '@apollo/client'
import { booksProps } from '../interfaces'
import { useEffect, useState } from 'react'
import { FILTER_BOOKS, ALL_BOOKS } from '../queries'

const Books = (props: { books: booksProps[] }) => {
  const [genre, setGenre] = useState<string>('')

  const allBooks = useQuery(ALL_BOOKS)

  const { data, loading, error, refetch } = useQuery(FILTER_BOOKS)

  const books = props.books

  let genres = Array.prototype.concat.apply(
    [],
    books.map((b) => b.genres)
  )
  genres = [...new Set(genres)]

  useEffect(() => {
    refetch({ genre: genre })
  }, [genre])

  if (allBooks.loading || loading) {
    return <div>loading...</div>
  }
  if (allBooks.error || error) {
    return <div>There was an error</div>
  }
  return (
    <div>
      <h1>Books</h1>
      <div className='genresButtons'>
        <button onClick={() => setGenre('')}>all genres</button>
        {genres.map((genre) => (
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
          {genre === ''
            ? allBooks?.data?.allBooks?.map((a: booksProps) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))
            : data?.allBooks?.map((a: booksProps) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
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
