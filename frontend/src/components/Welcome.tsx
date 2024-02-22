import { userProps, message } from '../interfaces'
import Contact from './Contact'
import { tester } from '../App'
import Accordion from './Accordion'
import { FC, useMemo } from 'react'
import styles from './welcome.module.css'
import { useTheme } from '../hooks/useTheme'

interface colorProps {
  i: number
  e: number
  background: string
}

const ColorComponent: FC<{ array: colorProps[] }> = ({ array }) => {
  const lightTheme = useTheme()
  return (
    <ul style={{ marginTop: '3em' }} className={`fullwidth1 ${styles['color-ul']}`}>
      {array.map((item, index: number) => {
        const itemStyle: React.CSSProperties = {
          backgroundColor: `${item.background}`,
          color: lightTheme
            ? item.i < 14
              ? 'var(--color-primary-20)'
              : 'var(--color-primary-1)'
            : item.i < 9
              ? 'var(--color-primary-20)'
              : 'var(--color-primary-1)',
          ['--i' as string]: `${item.i}`,
          ['--e' as string]: `${item.e}`,
        }
        const spanStyle: React.CSSProperties = {
          ['--i' as string]: `${item.i}`,
          ['--e' as string]: `${item.e}`,
        }

        return (
          <li key={`${item.background}${index}`} className={styles.shape} style={itemStyle}>
            <span style={spanStyle}>{itemStyle.backgroundColor}</span>
          </li>
        )
      })}
    </ul>
  )
}

const Welcome = (props: {
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
  me: userProps
}) => {
  const setupColorblocks: colorProps[] = useMemo(() => {
    let colorsArray: colorProps[] = []
    for (let i: number = 1; i <= 20; i++) {
      const item: colorProps = {
        i: i,
        e: 21 - i,
        background: `var(--color-primary-${i})`,
      }
      colorsArray.push(item)
    }
    return colorsArray
  }, [])

  const heading = 'Welcome'

  return (
    <div className="page-welcome">
      <h1>
        <span data-text={heading}>{heading}</span>
      </h1>
      <p>
        Hello
        {props.token && props.me ? (
          <strong>
            <em>
              , <a href={`/users/${props.me?.id}`}>{`${props.me?.username}!`}</a>
            </em>
          </strong>
        ) : (
          '!'
        )}{' '}
        My name is <a href="https://jenniina.fi">Jenniina Laine,</a> a freelance visual designer.{' '}
      </p>
      <Accordion className="center" text="get in touch">
        <Contact notify={props.notify} />
      </Accordion>

      <h2>About This Site</h2>
      <p>
        This site began as an entry for <a href="https://fullstackopen.com/en/part8">Part 8</a> of the{' '}
        <a href="https://fullstackopen.com/en/">Fullstack Open</a> course offered by{' '}
        <a href="https://www.helsinki.fi/en">the University of Helsinki.</a> I developed the app further in{' '}
        <a href="https://fullstackopen.com/en/part11">Part 11</a>, added new features and edited it to fit in a little
        better with the appearance of my <a href="https://jenniina.fi/react">React sub-site.</a>
      </p>
      <p>
        <a href="https://github.com/jenniina/Fullstackopen_part11_Library/">Github Repository</a>
      </p>
      <p>
        The site contains a list of books and their authors, with individual pages for both, as well as a page for the
        list of users and individual user pages with their book contributions. The books list may be filtered by genre.
      </p>
      {!props.me ? (
        <>
          <h3>Logging in</h3>
          <p>You may see the logged-in state of the site by logging in with the following credentials: </p>
          <p>
            <span style={{ display: 'block', padding: '1em 0 0.5em' }}>
              username:{' '}
              <big>
                <em style={{ padding: '1em' }}>Tester</em>
              </big>
            </span>
            <span style={{ display: 'block', padding: '0.5em 0 1em' }}>
              password:{' '}
              <big>
                <em style={{ padding: '1em' }}>TestiTestaaja</em>
              </big>
            </span>
          </p>
          <p>
            These credentials do not allow for actual modification of the database, besides editing the birth dates of
            the authors.
          </p>
        </>
      ) : (
        ''
      )}
      {!props.me || props.me.id === tester ? (
        <div style={{ textAlign: 'left' }}>
          If you are a recruiter, hiring manager or potential client who wishes to demo the site with fully working
          credentials,{' '}
          <Accordion className="center" text="contact me">
            <Contact notify={props.notify} />
          </Accordion>
        </div>
      ) : (
        ''
      )}
      <h3>CI/CD</h3>
      <p>
        I used <a href="https://github.com/features/actions">GitHub Actions</a> to set up the deployment pipeline. The
        web service is hosted at Render.com for free, with 512 MB RAM and 0.1 CPU, hence requiring a little patience to
        browse..
      </p>
      <h3>Backend</h3>
      <p>
        The Apollo server is connected to a <a href="https://www.mongodb.com/atlas/database">MongoDB Atlas database</a>.
      </p>
      <div className="flex">
        <div>
          <label htmlFor="dep-backend">Dependencies:</label>
          <ul id="dep-backend">
            <li>
              <a href="https://graphql.org/">GraphQL</a>
            </li>
            <li>
              <a href="https://github.com/ardatan/graphql-tools#readme">@graphql-tools/schema</a>
            </li>
            <li>
              <a href="https://www.apollographql.com/docs/apollo-server/">Apollo Server</a>
            </li>
            <li>
              <a href="https://github.com/apollographql/apollo-server#readme">apollo-server-core</a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">JavaScript</a>
            </li>
            <li>
              <a href="https://mongoosejs.com">mongoose</a>
            </li>
            <li>
              <a href="https://github.com/blakehaswell/mongoose-unique-validator#readme">mongoose-unique-validator</a>
            </li>
            <li>
              <a href="http://expressjs.com/">express</a>
            </li>
            <li>
              <a href="https://github.com/motdotla/dotenv#readme">dotenv</a>
            </li>
            <li>
              <a href="https://github.com/expressjs/cors#readme">cors</a>
            </li>
            <li>
              <a href="https://github.com/auth0/node-jsonwebtoken#readme">jsonwebtoken</a>
            </li>
            <li>
              <a href="https://github.com/dcodeIO/bcrypt.js#readme">bcryptjs</a>
            </li>
            <li>
              <a href="https://github.com/websockets/ws">ws: websocket client</a>
            </li>
            <li>
              <a href="https://github.com/enisdenjo/graphql-ws#readme">graphql-ws</a>
            </li>
            <li>
              <a href="https://github.com/apollostack/graphql-subscriptions#readme">graphql-subscriptions</a>
            </li>
            <li>
              <a href="https://github.com/kentcdodds/cross-env#readme">cross-env</a>
            </li>
            <li>
              <a href="https://nodemailer.com/">nodemailer</a>
            </li>
          </ul>
        </div>
        <div>
          <label htmlFor="dev-backend">Dev-dependencies:</label>

          <ul id="dev-backend">
            <li>
              <a href="https://nodemon.io">nodemon</a>
            </li>
            <li>
              <a href="https://github.com/cypress-io/cypress">cypress</a>
            </li>
            <li>
              <a href="https://github.com/Zaista/cypress-mongodb">cypress-mongodb</a>
            </li>
            <li>
              <a href="https://eslint.org">eslint</a>
            </li>
            <li>
              <a href="https://github.com/cypress-io/eslint-plugin-cypress#readme">eslint-plugin-cypress</a>
            </li>
            <li>
              <a href="https://github.com/aminya/eslint-plugin-yaml#readme">eslint-plugin-yaml</a>
            </li>
          </ul>
        </div>
      </div>
      <h3>Frontend</h3>
      <div className="flex">
        <p>The React frontend is build with Vite and is served as a static site by the backend.</p>
        <div>
          <label htmlFor="dep-frontend">Dependencies:</label>
          <ul id="dep-frontend">
            <li>
              <a href="https://www.apollographql.com/docs/react/get-started/">Apollo Client</a>
            </li>
            <li>
              <a href="https://react.dev/">React</a>
            </li>
            <li>
              <a href="https://reactjs.org/">react-dom</a>
            </li>
            <li>
              <a href="https://github.com/react-icons/react-icons#readme">react-icons</a>
            </li>
            <li>
              <a href="https://github.com/thebuilder/react-intersection-observer#readme">react-intersection-observer</a>
            </li>
            <li>
              <a href="https://github.com/remix-run/react-router#readme">react-router-dom</a>
            </li>
            <li>
              <a href="https://github.com/kentcdodds/cross-env#readme">cross-env</a>
            </li>
          </ul>
        </div>
        <div>
          <label htmlFor="dev-frontend">Dev-dependencies:</label>
          <ul id="dev-frontend">
            <li>
              <a href="https://vitejs.dev/guide/why.html">Vite</a>
            </li>
            <li>
              <a href="https://github.com/vitest-dev/vitest#readme">vitest</a>
            </li>
            <li>
              <a href="https://eslint.org">eslint</a>
            </li>
            <li>
              <a href="https://github.com/facebook/create-react-app#readme">eslint-config-react-app</a>
            </li>
            <li>
              <a href="https://www.typescriptlang.org/">TypeScript</a>
            </li>
            <li>
              <a href="https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react">@types/react</a>
            </li>
            <li>
              <a href="https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom">
                @types/react-dom
              </a>
            </li>
            <li>
              <a href="https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#readme">
                @vitejs/plugin-react
              </a>
            </li>
          </ul>
        </div>
      </div>
      <h2>Get in touch</h2>
      <Accordion className="center" text="contact me">
        <Contact notify={props.notify} />
      </Accordion>

      <section className={`fullwidth ${styles.sectioncolor}`}>
        <div className={styles.colortextwrap}>
          <div>
            <div className="wide">
              <h3 id="color" className="left" style={{ marginTop: 0 }}>
                Site Colors
              </h3>
              <p>
                The site colors' lightnesses switch in light mode, wherein var(--color-primary-1) becomes the lightest
                color instead of the darkest.{' '}
              </p>
              <p>Animated clip-paths and text rotation on hover, with dynamic delay.</p>
            </div>
          </div>
        </div>

        <ColorComponent array={setupColorblocks} />
      </section>
    </div>
  )
}

export default Welcome
