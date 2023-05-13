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
              position: 'absolute',
              left: 0,
              width: '100%',
            }
          : {
              color: 'black',
              position: 'absolute',
              left: 0,
              width: '100%',
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
        <strong>{props.info.message}</strong>
      </span>
    </div>
  )
}
export default Notify
