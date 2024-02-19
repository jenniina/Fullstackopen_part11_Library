const express = require('express')
const nodemailer = require('nodemailer')
const router = express.Router()

router.post('/', async (req, res) => {
  let { from, subject, text } = req.body

  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  })

  let mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: process.env.NODEMAILER_USER,
    subject,
    text,
  }

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return res.status(500).send({ message: err.message })
    }
    res.status(200).send({ message: 'Email sent successfully!' })
  })
})

module.exports = router
