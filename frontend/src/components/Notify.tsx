import { message } from '../interfaces'

interface messageProps {
  info: message | undefined
}
const Notify = (props: messageProps) => {
  if (!props.info?.message) {
    return null
  }
  return (
    <div
      style={
        props.info.error === true
          ? {
              color: 'red',
              position: 'fixed',
              left: 0,
              width: '100%',
              zIndex: '999',
            }
          : {
              color: 'black',
              position: 'fixed',
              left: 0,
              width: '100%',
              zIndex: '999',
            }
      }
    >
      <span
        style={{
          display: 'inline-block',
          backgroundColor: 'white',
          padding: '0.3em 1em',
          outline: '2px solid currentColor',
          outlineOffset: '-3px',
        }}
      >
        <strong aria-live='polite'>{props.info.message}</strong>
      </span>
    </div>
  )
}
export default Notify
