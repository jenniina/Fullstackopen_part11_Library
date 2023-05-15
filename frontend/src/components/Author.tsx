import { useQuery } from '@apollo/client'
import { authorProps } from '../interfaces'
import { useEffect } from 'react'
import { GET_BOOKS_OF_AUTHOR } from '../queries'
import { Link } from 'react-router-dom'

const Author = (props: { author: authorProps }) => {
  const author = props.author

  const { data, refetch } = useQuery(GET_BOOKS_OF_AUTHOR)

  useEffect(() => {
    refetch({ author: author.name })
  }, [data])

  return (
    <div>
      <h1>{author.name}</h1>
      <p>Born: {author.born}</p>
      <p>Books: {author.bookCount}</p>
      <h2>Books by {author.name}</h2>
      {data?.allBooks?.map((book: { id: string; title: string }) => (
        <ul key={book.id}>
          <li style={{ listStyle: 'none' }}>
            <Link to={`/books/${book.id}`}>{book.title}</Link>
          </li>
        </ul>
      ))}
    </div>
  )
}

export default Author
