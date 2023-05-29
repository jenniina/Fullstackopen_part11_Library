import { NavLink } from 'react-router-dom'
import { CSSProperties } from 'react'
import useMediaQuery from '../hooks/useMediaQuery'
import { RiHomeSmileLine } from 'react-icons/ri'
import { FaReact } from 'react-icons/fa'
import { RiArrowGoBackFill } from 'react-icons/ri'

const Exit = () => {
  const mediaIsLarge = useMediaQuery('(min-width: 400px)')

  const itemStyleSmall: CSSProperties = {
    paddingTop: '2em',
    display: 'flex',
    flexFlow: 'column wrap',
    justifyContent: 'space-evenly',
    gap: '2em',
  }
  const itemStyleLarge: CSSProperties = {
    paddingTop: '2em',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-evenly',
    gap: '1em',
  }

  return (
    <div className="page-exit">
      <h1 className="screen-reader-text">Exit Site</h1>
      <p>
        <big>Are you sure you want to leave the site?</big>
      </p>
      <div style={mediaIsLarge ? itemStyleLarge : itemStyleSmall}>
        <a href="https://jenniina.fi" className="has-tooltip" aria-describedby="tooltip-home">
          <RiHomeSmileLine />
          Go to Main Site
          <span className="tooltip" role="tooltip" id="tooltip-home">
            go to https://jenniina.fi
          </span>
        </a>
        <a href="https://react.jenniina.fi" className="has-tooltip" aria-describedby="tooltip-react">
          <FaReact />
          Go to React Site
          <span className="tooltip" role="tooltip" id="tooltip-react">
            go to https://react.jenniina.fi
          </span>
        </a>
        <NavLink to="/" className="has-tooltip" aria-describedby="tooltip-back">
          <RiArrowGoBackFill />
          Back to Browsing
          <span className="tooltip" role="tooltip" id="tooltip-back">
            back to welcome page
          </span>
        </NavLink>
      </div>
    </div>
  )
}

export default Exit
