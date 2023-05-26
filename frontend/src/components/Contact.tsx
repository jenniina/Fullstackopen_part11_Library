import { useRef, FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { RefObject, message } from '../interfaces'

interface contactProps {
  notify: ({ error, message }: message, seconds: number) => void
}
function Contact(props: contactProps) {
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
    <form className="form-login" onSubmit={submit} ref={form}>
      <legend>Contact me</legend>

      <span className="flex stretch">
        <span className="input-wrap">
          <label>
            <input name="firstname" required type="text" />
            <span>First Name </span>
          </label>
        </span>

        <span className="input-wrap">
          <label>
            <input name="lastname" required type="text" />
            <span>Last name </span>
          </label>
        </span>
      </span>

      <span className="input-wrap">
        <label>
          <input name="email" required type="email" />
          <span>Email </span>
        </label>
      </span>

      <span className="input-wrap">
        <label>
          <input name="message-subject" required type="text" />
          <span>Subject </span>
        </label>
      </span>

      <label className="message-label">
        <span>Message: </span>
        <textarea name="message" required></textarea>
      </label>

      <input type="hidden" name="address" value={window.location.href} />

      <button type="submit">send&nbsp;message</button>
    </form>
  )
}

export default Contact
