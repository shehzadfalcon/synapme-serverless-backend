const forgot_password_link_html = ({ message, user_first_name }) => {
  return `
             <h2>Hi ${user_first_name}</h2>
            <h2>You have requested a password forgot password token.</h2>
            <div>Please copy the code, if you need to reset password.</div>
            <div>This code is valid for 5 minutes only from now.</div>
            
             <p>${message}</p>
            <hr/>
            <div style="color: red">Note: Please ignore this link if you didn't request it.</div>
    `;
};

module.exports = forgot_password_link_html;
