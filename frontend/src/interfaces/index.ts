export interface message {
  error: boolean
  message: string | undefined
}
export interface notification {
  info: message
  seconds: number
}
export interface booksProps {
  title: string
  published: number
  author: { name: string }
  genres: string[]
  id?: string
}
export interface authorProps {
  name: string
  born?: number
  bookCount: number
  id?: string
}
