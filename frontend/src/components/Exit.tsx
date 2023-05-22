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
    <div className='page-exit'>
      <h1 className='screen-reader-text'>Exit Site</h1>
      <p>
        <big>Are you sure you want to leave the site?</big>
      </p>
      <div style={mediaIsLarge ? itemStyleLarge : itemStyleSmall}>
        <a href='https://jenniina.fi'>
          <RiHomeSmileLine />
          <abbr title='https://jenniina.fi'>Go to Main Site</abbr>
        </a>
        <a href='https://jenniina.fi/react'>
          <FaReact />
          <abbr title='https://jenniina.fi/react'>Go to React Site</abbr>
        </a>
        <NavLink to='/'>
          <RiArrowGoBackFill />
          <abbr title='Welcome'>Back to Browsing</abbr>
        </NavLink>
      </div>
    </div>
  )
}

export default Exit
