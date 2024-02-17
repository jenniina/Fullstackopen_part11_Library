import axios from 'axios'

export const sendEmail = async (from: string, subject: string, text: string) => {
  const emailData = {
    from,
    subject,
    text,
  }

  const VITE_URI = import.meta.env.VITE_RENDER_URI

  try {
    await axios.post(`${VITE_URI}/email`, emailData)
    //console.log(response.data.message)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
