import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from '../queries'
import { message } from '../interfaces'
import { updateCache } from '../App'

const NewBook = (props: {
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState<string[]>([])

  const [createBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      props.notify({ error: true, message: error.message }, 10)
      // console.log(JSON.stringify(error, null, 2))
    },
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)
    },
    onCompleted: () => {
      zero()
    },
  })

  const zero = () => {
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    createBook({
      variables: { title, author, genres, published: parseInt(published) },
    }).catch((e) => e.message)
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }
  if (!props.token) return <div></div>
  else
    return (
      <div>
        <h1>Add Book</h1>
        <form onSubmit={submit}>
          <label>
            title
            <input
              name='title'
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
          <label>
            author
            <input
              name='author'
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
          <label>
            published
            <input
              type='number'
              name='published'
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
          </label>
          <label>
            <input
              name='genre'
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
            <button onClick={addGenre} type='button'>
              add&nbsp;genre
            </button>
          </label>
          <div id='genres'>genres: {genres.join(' ')}</div>
          <button type='submit'>create book</button>
        </form>
      </div>
    )
}

export default NewBook
