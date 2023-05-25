import { useRef, FormEvent } from 'react'
import Accordion from './Accordion'
import emailjs from '@emailjs/browser'
import { RefObject, message } from '../interfaces'

interface contactProps {
  notify: ({ error, message }: message, seconds: number) => void
}
function Contact(props: contactProps) {
  const formCommentRef = useRef(null)

  const form = useRef() as RefObject<HTMLFormElement>

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (form)
      emailjs
        .sendForm(
          import.meta.env.VITE_serviceID,
          import.meta.env.VITE_templateID,
          form.current,
          import.meta.env.VITE_publicKey
        )
        .then(
          (result) => {
            // eslint-disable-next-line no-console
            console.log(result.text)
            props.notify({ error: false, message: 'Thank you for your message!' }, 10)
            form.current?.reset()
          },
          (error) => {
            // eslint-disable-next-line no-console
            console.log(error.message)
            props.notify({ error: true, message: 'There was an error sending the message!' }, 10)
          }
        )
  }

  return (
    <Accordion className="center" text="contact me" ref={formCommentRef}>
      <form className="form-login" onSubmit={submit} ref={form}>
        <legend>Contact me</legend>
        <div className="flex stretch">
          <div className="input-wrap">
            <label>
              <input name="firstname" required type="text" />
              <span>First Name </span>
            </label>
          </div>

          <div className="input-wrap">
            <label>
              <input name="lastname" required type="text" />
              <span>Last name </span>
            </label>
          </div>
        </div>
        <div className="input-wrap">
          <label>
            <input name="email" required type="email" />
            <span>Email </span>
          </label>
        </div>

        <div className="input-wrap">
          <label>
            <input name="message-subject" required type="text" />
            <span>Subject </span>
          </label>
        </div>
        <label className="message-label">
          <span>Message: </span>
          <textarea name="message" required></textarea>
        </label>

        <button type="submit">send&nbsp;message</button>
      </form>
    </Accordion>
  )
}

export default Contact
