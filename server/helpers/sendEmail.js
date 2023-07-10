const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const { EMAIL, EMAIL_PASSWORD } = require('../config/keys.js')

const sendEmail = async (email, subject, payload) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
      }
    })
    let source
    if (payload.passwordReset) {
      source = fs.readFileSync(path.join(__dirname, '..', 'handlebars', 'requestPasswordReset.handlebars'), 'utf8')
    } else {
      source = fs.readFileSync(path.join(__dirname, '..', 'handlebars', 'requestPasswordSet.handlebars'), 'utf8')
    }

    const compiledTemplate = handlebars.compile(source)
    const options = () => {
      return {
        from: 'm6340089@gmail.com',
        to: email,
        subject,
        html: compiledTemplate(payload)
      }
    }

    // Send email
    try {
      const response = await transporter.sendMail(options())
      console.log(response)
      return response
    } catch (error) {
      console.log(error)
      return error
    }
  } catch (error) {
    return error
  }
}

module.exports = sendEmail
