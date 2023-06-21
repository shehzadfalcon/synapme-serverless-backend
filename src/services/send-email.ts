require('dotenv').config();
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const sign_template = require('../templates/signup-template');
const forgot_password_link_html = require('../templates/forgot-password-link-template');
const custome_message = ['Email failed to send'];

const sesClient = new SESClient({});

const template = {
  signup: sign_template,
  'forgot-password-link': forgot_password_link_html,
};

const errorResponse = async (response) => {
  if (response['$metadata']?.httpStatusCode !== 200) {
    throw {
      isError: true,
      status: response['$metadata']?.httpStatusCode,
      error: custome_message[0],
    };
  }
};

export default async function sendEmail({
  type,
  user_email,
  user_first_name,
  subject,
  message,
}) {
  try {
    const params = {
      Destination: {
        ToAddresses: [user_email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: template[type]({ message, user_first_name }),
          },
        },
        Subject: { Data: subject },
      },
      Source: process.env.AWS_SES_SENDER_EMAIL,
    };

    const sendEmailCommand = new SendEmailCommand(params);
    const response = await sesClient.send(sendEmailCommand);
    await errorResponse(response);
  } catch (error) {
    throw {
      isError: true,
      error,
      type: 'Email failed to send',
    };
  }
}
