export interface message {
  error: boolean
  message: string | undefined
}
export interface notification {
  info: message
  seconds: number
}
export interface userProps {
  username: string
  passwordHash: string
  favoriteGenre: string
  books:
    | [
        {
          title: booksProps['title']
          id: booksProps['id']
          author: {
            name: string
            id: string
          }
        }
      ]
    | []
  id?: string
}
export interface booksProps {
  title: string
  published: number
  author: { name: string; id: string }
  genres: string[]
  user?: userProps['id']
  id?: string
}
export interface authorProps {
  name: string
  born?: number
  bookCount: number
  id?: string
}

export interface RefObject<T> {
  readonly current: T
}

export enum OrderDirection {
  ASC = 1,
  DESC = -1,
}

export enum OrderBooksBy {
  TITLE = 'title',
  PUBLISHED = 'published',
  AUTHOR = 'name',
}
export enum OrderAuthorsBy {
  NAME = 'surname',
  BORN = 'born',
  BOOKS = 'bookCount',
}
export enum OrderUsersBy {
  USERNAME = 'username',
  GENRE = 'favoriteGenre',
  BOOKS = 'books',
}
