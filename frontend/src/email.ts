import axios from 'axios'

export const sendEmail = async (subject: string, text: string) => {
  const emailData = {
    subject: subject,
    text: text,
  }
  // eslint-disable-next-line no-console
  console.log('emailData', emailData)

  try {
    await axios.post('/email', emailData)
    //console.log(response.data.message)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
