import { userProps, message } from '../interfaces'
import Contact from './Contact'
import { tester } from '../App'

const Welcome = (props: {
  notify: ({ error, message }: message, seconds: number) => void
  token: string | null
  me: userProps
}) => {
  const heading = 'Welcome'

  return (
    <div className="page-welcome">
      <h1>
        <span data-text={heading}>{heading}</span>
      </h1>
      <p>
        Hello
        <strong>
          <em>
            <a href={`/users/${props.me?.id}`} className="no-underline">{`${
              props.token && props.me ? `, ${props.me?.username}!` : '!'
            }`}</a>
          </em>
        </strong>{' '}
        My name is <a href="https://jenniina.fi">Jenniina Laine,</a> a freelance visual designer.
      </p>

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
        list of users and individual user pages with their book contributions.
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
          credentials, <Contact notify={props.notify} />
        </div>
      ) : (
        ''
      )}
      <h3>CI/CD</h3>
      <p>
        I used <a href="https://github.com/features/actions">GitHub Actions</a> to set up the deployment pipeline,
        deploying the Apollo server backend as a <a href="https://render.com/">Render.com</a> web service and the
        frontend as a static site.
      </p>
      <p>
        The web service is hosted at Render.com for free, with 512 MB RAM and 0.1 CPU, hence requiring a little patience
        to browse.
      </p>
      <h3>Backend</h3>
      <p>
        The Apollo server is hosted as a render.com web service, using GraphQL and JavaScript, connecting to a{' '}
        <a href="https://www.mongodb.com/atlas/database">MongoDB Atlas database</a>.
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
          </ul>
        </div>
        <div>
          <label htmlFor="dev-backend">Dev-dependencies:</label>

          <ul id="dev-backend">
            <li>
              <a href="https://nodemon.io">nodemon</a>
            </li>
            <li>
              <a href="https://github.com/kentcdodds/cross-env#readme">cross-env</a>
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
      <p>The frontend is hosted on render.com as a static site.</p>
      <div className="flex">
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
              <a href="https://vitejs.dev/guide/why.html">Vite</a>
            </li>
            <li>
              <a href="https://reactjs.org/">react-dom</a>
            </li>
            <li>
              <a href="https://github.com/react-icons/react-icons#readme">react-icons</a>
            </li>
            <li>
              <a href="https://github.com/remix-run/react-router#readme">react-router-dom</a>
            </li>
            <li>
              <a href="https://www.emailjs.com">emailjs</a>
            </li>
          </ul>
        </div>
        <div>
          <label htmlFor="dev-frontend">Dev-dependencies:</label>
          <ul id="dev-frontend">
            <li>
              <a href="https://github.com/vitest-dev/vitest#readme">vitest</a>
            </li>
            <li>
              <a href="https://github.com/bahmutov/start-server-and-test#readme">start-server-and-test</a>
            </li>
            <li>
              <a href="https://github.com/cypress-io/cypress">cypress</a>
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
      <Contact notify={props.notify} />
    </div>
  )
}

export default Welcome
