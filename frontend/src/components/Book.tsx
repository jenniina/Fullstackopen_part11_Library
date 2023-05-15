import { useQuery } from '@apollo/client'
import { booksProps } from '../interfaces'
import { useEffect, useState } from 'react'
import { FILTER_BOOKS, ALL_BOOKS } from '../queries'

const Book = (props: { book: booksProps }) => {
  const allBooks = useQuery(ALL_BOOKS)

  const { data, loading, error, refetch } = useQuery(FILTER_BOOKS)

  const book = props.book
  console.log(book)

  if (allBooks.loading || loading) {
    return <div>loading...</div>
  }
  if (allBooks.error || error) {
    return <div>There was an error</div>
  }
  return (
    <div>
      <h1>{book.title}</h1>
      <p>Author: {book.author.name}</p>
      <p>Published: {book.published}</p>
    </div>
  )
}

export default Book
