import { Link, useNavigate } from 'react-router-dom'
import { userProps, message, OrderDirection, OrderUsersBy } from '../interfaces'
import { Dispatch, SetStateAction, useState } from 'react'
import { FaSortDown, FaSortUp, FaSort } from 'react-icons/fa'

const Users = (props: {
  users: {
    data: {
      allUsers: userProps[]
    }
    loading: boolean
  }
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
  orderByUsers: OrderUsersBy
  setOrderByUsers: Dispatch<SetStateAction<OrderUsersBy>>
  orderDirectionUsers: OrderDirection
  setOrderDirectionUsers: Dispatch<SetStateAction<OrderDirection>>
}) => {
  const [orderByBookCount, setOrderByBookCount] = useState<Boolean>(true)
  const [orderByBookCountASC, setOrderByBookCountASC] = useState<Boolean>(true)
  const [orderDirectionUsersBookCount, setOrderDirectionUsersBookCount] = useState<OrderDirection>(OrderDirection.ASC)

  const users = !orderByBookCount
    ? props.users?.data?.allUsers
    : props.users?.data?.allUsers
        ?.slice()
        .sort((a, b) => (orderByBookCountASC ? b.books.length - a.books.length : a.books.length - b.books.length))

  const navigate = useNavigate()

  const heading = 'Users'

  if (!props.token) {
    setTimeout(() => navigate('/login'), 1000)
    return <div>Please log in</div>
  } else if (props.users.loading)
    return (
      <div>
        <big>Loading...</big>
      </div>
    )
  else
    return (
      <div>
        <h1>
          <span data-text={heading}>{heading}</span>
        </h1>
        <table>
          <tbody>
            <tr>
              <th>
                <button
                  className="reset"
                  onClick={() => {
                    setOrderByBookCount(false)
                    props.setOrderByUsers(OrderUsersBy.USERNAME)
                    props.orderDirectionUsers === OrderDirection.ASC
                      ? props.setOrderDirectionUsers(OrderDirection.DESC)
                      : props.setOrderDirectionUsers(OrderDirection.ASC)
                  }}
                >
                  Username{' '}
                  {props.orderByUsers === OrderUsersBy.USERNAME ? (
                    props.orderDirectionUsers === OrderDirection.ASC ? (
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
                  className="reset"
                  onClick={() => {
                    setOrderByBookCount(false)
                    props.setOrderByUsers(OrderUsersBy.GENRE)
                    props.orderDirectionUsers === OrderDirection.ASC
                      ? props.setOrderDirectionUsers(OrderDirection.DESC)
                      : props.setOrderDirectionUsers(OrderDirection.ASC)
                  }}
                >
                  Favorite genre{' '}
                  {props.orderByUsers === OrderUsersBy.GENRE ? (
                    props.orderDirectionUsers === OrderDirection.ASC ? (
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
                    setOrderByBookCount(true)
                    props.setOrderByUsers(OrderUsersBy.BOOKS)
                    setOrderByBookCountASC((prev) => !prev)
                    orderDirectionUsersBookCount === OrderDirection.ASC
                      ? setOrderDirectionUsersBookCount(OrderDirection.DESC)
                      : setOrderDirectionUsersBookCount(OrderDirection.ASC)
                  }}
                  aria-describedby="tooltip1"
                >
                  Books added
                  <span className="tooltip" role="tooltip" id="tooltip1">
                    sort&nbsp;by book&nbsp;count (sorts&nbsp;visible)
                  </span>{' '}
                  {props.orderByUsers === OrderUsersBy.BOOKS ? (
                    orderDirectionUsersBookCount === OrderDirection.ASC ? (
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
            {users?.map((u: userProps) => (
              <tr key={u.username}>
                <td>
                  <Link to={`/users/${u.id}`}>{u.username}</Link>
                </td>
                <td>{u.favoriteGenre}</td>
                <td>{u.books.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}

export default Users
