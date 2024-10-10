import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&display=swap');
        body {
          font-family: 'Plus Jakarta Sans', Arial, sans-serif;
          background-color: #3F3F3F;
          margin: 0;
          padding: 0;
        }
        .container {
          padding: 20px;
          background-color: #3F3F3F;
          border-radius: 8px;
          width: 100%;
          max-width: 600px;
          margin: auto;
        }
        .header {
          color: white;
          text-align: center;
        }
        .content {
          color: white;
        }
        .button {
          display: inline-block;
          padding: 15px 25px;
          margin: 20px 0;
          font-size: 16px;
          font-weight: bold;
          color: #fff; 
          background-color: #04A51E;
          border-radius: 5px;
          text-decoration: none;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #999;
          text-align: center;
        }
      </style>
      <div class="container">
        <h2 class="header" color="white">Password Reset Request</h2>
        <p class="content" color="white">Hello,</p>
        <p class="content" color="white">
          We received a request to reset your password. If you made this request, please click the button below:
        </p>
        <a href="http://localhost:5173/resetPassword?token=${token}" class="button" color="white">Reset Password</a>
        <p class="content" color="white">If you did not request this, you can safely ignore this email.</p>
        <p class="content" color="white">Thank you!</p>
        <footer class="footer">
          <p color="white">This email was sent by CircleApp</p>
          <p style="margin: 5px 0;" color="white">If you have any questions, feel free to contact our support team.</p>
        </footer>
      </div>
    `,
  };
  

  

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send reset password email");
  }
};
