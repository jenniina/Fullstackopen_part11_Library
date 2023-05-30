import React from 'react'
import { booksProps } from '../interfaces'
import { Link } from 'react-router-dom'

interface Props {
  a: booksProps
}

function FeedBooks({ a }: Props) {
  return (
    <>
      <tr key={a.title}>
        <td>
          <Link to={`/books/${a.id}`}>{a.title}</Link>
        </td>
        <td>
          <Link to={`/authors/${a.author.id}`}>{a.author.name}</Link>
        </td>
        <td>{a.published && a.published < 0 ? `${Math.abs(a.published)} BC` : a.published}</td>
      </tr>
    </>
  )
}

export default FeedBooks
