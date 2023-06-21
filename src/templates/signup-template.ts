const sign_up_html = ({ message, user_first_name }) => {
  return `
        <div style="width: 100%">
            <p>Hi ${user_first_name}</p>
            <div>You have registered successfully and here is your verification code ${message}</div>
        </div>
    `;
};

module.exports = sign_up_html;
