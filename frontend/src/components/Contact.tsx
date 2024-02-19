import { useRef, FormEvent, useState } from 'react'
import { RefObject, message } from '../interfaces'
import { sendEmail } from '../email'

interface contactProps {
  notify: ({ error, message }: message, seconds: number) => void
}
function Contact(props: contactProps) {
  const [email, setEmail] = useState('' as string)
  const [message_, setMessage] = useState('' as string)
  const [subject, setSubject] = useState('' as string)
  const [name, setName] = useState('' as string)
  const [lastname, setLastname] = useState('' as string)

  const form = useRef() as RefObject<HTMLFormElement>

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (form) {
      const text = `From the books app: \n\nName: ${name} ${lastname}\nEmail: ${email}\n\n${subject}\n\n${message_}`
      sendEmail(`New message from ${name} ${lastname}`, text)
        .then(
          () => {
            props.notify({ error: false, message: 'Thank you for your message!' }, 10)
            form.current?.reset()
          },
          (error) => {
            // eslint-disable-next-line no-console
            console.error(error.message)
            props.notify({ error: true, message: 'There was an error sending the message!' }, 10)
          }
        )
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
    }
  }

  return (
    <form className="form-login" onSubmit={submit} ref={form}>
      <legend>Contact me</legend>

      <span className="flex stretch">
        <span className="input-wrap">
          <label>
            <input
              name="firstname"
              required
              type="text"
              autoComplete="given-name"
              onChange={(event) => setName(event.target.value)}
            />
            <span>First Name </span>
          </label>
        </span>

        <span className="input-wrap">
          <label>
            <input
              name="lastname"
              required
              type="text"
              autoComplete="family-name"
              onChange={(event) => setLastname(event.target.value)}
            />
            <span>Last name </span>
          </label>
        </span>
      </span>

      <span className="input-wrap">
        <label>
          <input
            name="email"
            required
            type="email"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <span>Email </span>
        </label>
      </span>

      <span className="input-wrap">
        <label>
          <input
            name="message-subject"
            required
            type="text"
            autoComplete="off"
            onChange={(event) => setSubject(event.target.value)}
          />
          <span>Subject </span>
        </label>
      </span>

      <label className="message-label">
        <span>Message: </span>
        <textarea
          name="message"
          required
          autoComplete="off"
          onChange={(event) => setMessage(event.target.value)}
        ></textarea>
      </label>

      <input
        type="hidden"
        name="address"
        value={window.location.href}
        onChange={(event) => setMessage((prev) => prev + '\n' + event.target.value)}
      />

      <button type="submit">send&nbsp;message</button>
    </form>
  )
}

export default Contact
