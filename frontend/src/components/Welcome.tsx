import { Link, useNavigate } from 'react-router-dom'
import { userProps, message, RefObject } from '../interfaces'
import { ALL_USERS, EDIT_USER, ME } from '../queries'
import { useMutation } from '@apollo/client'
import { useRef, useState } from 'react'
import Contact from './Contact'
import { tester } from '../App'

const Welcome = (props: {
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
  me: userProps
}) => {
  const heading = `Welcome`

  return (
    <div className='page-welcome'>
      <h1>
        <span data-text={heading}>{heading}</span>
      </h1>
      <p>
        Hello{`${props.token && props.me ? `, ${props.me?.username}!` : '!'}`} My name is{' '}
        <a href='https://jenniina.fi'>Jenniina Laine.</a>
      </p>
      {!props.me ? (
        <>
          <h2>Logging in</h2>
          <p>
            You may see the logged-in state of the site by logging in with the following
            credentials:{' '}
            <div style={{ padding: '1em' }}>
              <span style={{ display: 'block', padding: '1em 0 0.5em' }}>
                username:{' '}
                <big>
                  <em style={{ padding: '1em' }}>Tester</em>
                </big>
              </span>{' '}
              <span style={{ display: 'block', padding: '0.5em 0 1em' }}>
                password:{' '}
                <big>
                  <em style={{ padding: '1em' }}>TestiTestaaja</em>
                </big>
              </span>
            </div>
            These credentials do not allow for actual modification of the database,
            besides editing the birth dates of the authors.
          </p>
        </>
      ) : (
        ''
      )}
      {!props.me || props.me.id === tester ? (
        <div>
          If you are a recruiter, hiring manager or potential client that wishes to demo
          the site with fully working credentials, <Contact notify={props.notify} />
        </div>
      ) : (
        ''
      )}
      <h2>About This Site</h2>
      <p>
        This site began as an entry for{' '}
        <a href='https://fullstackopen.com/en/part8'>Part 8</a> of the{' '}
        <a href='https://fullstackopen.com/en/'>Fullstack Open</a> course offered by{' '}
        <a href='https://www.helsinki.fi/en'>the University of Helsinki.</a> I developed
        the app further in <a href='https://fullstackopen.com/en/part11'>Part 11</a> and
        edited it to fit in a little better with the appearance of my{' '}
        <a href='https://jenniina.fi/react'>React sub-site.</a>
      </p>
      <p>
        <a href='https://github.com/jenniina/Fullstackopen_part11_Library/'>
          Github Repository
        </a>
      </p>
      <h3>Languages and dependencies</h3>
      <h4>Backend</h4>
      <ul>
        <li>
          <a href='https://graphql.org/'>GraphQL</a>
        </li>
        <li>
          <a href='https://www.apollographql.com/docs/apollo-server/'>Apollo Server</a>
        </li>
        <li>
          <a href='https://www.apollographql.com/docs/react/get-started/'>
            Apollo Client
          </a>
        </li>
        <li>JavaScript</li>
        <li>mongoose</li>
        <li>mongoose-unique-validator</li>
        <li>
          <a href='http://expressjs.com/'>express</a>
        </li>
        <li>
          <a href='https://github.com/motdotla/dotenv#readme'>dotenv</a>
        </li>
        <li>
          <a href='https://github.com/expressjs/cors#readme'>cors</a>
        </li>
        <li>jsonwebtoken</li>
        <li>
          <a href='https://github.com/websockets/ws'>ws: websocket client</a>
        </li>
        <li>
          <a href='https://github.com/enisdenjo/graphql-ws#readme'>graphql-ws</a>
        </li>
        <li>
          <a href='https://github.com/apollostack/graphql-subscriptions#readme'>
            graphql-subscriptions
          </a>
        </li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <h4>Frontend</h4>
      <ul>
        <li>
          <a href='https://www.apollographql.com/docs/react/get-started/'>
            Apollo Client
          </a>
        </li>
        <li>React</li>
        <li>TypeScript</li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <h2>Contact me</h2>
      <Contact notify={props.notify} />
    </div>
  )
}

export default Welcome
