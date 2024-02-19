import axios from 'axios'

export const sendEmail = async (from: string, subject: string, text: string) => {
  const emailData = {
    from,
    subject,
    text,
  }

  try {
    await axios.post('/email', emailData)
    //console.log(response.data.message)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
