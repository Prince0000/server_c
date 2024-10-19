const nodemailer = require("nodemailer");

const sendOTPEmail = async (to, otp) => {
  // Add logging to check if environment variables are set
  //   console.log("EMAIL_USER:", process.env.EMAIL_USER);
  //   console.log(
  //     "EMAIL_PASS:",
  //     process.env.EMAIL_PASS ? "Set (not shown for security)" : "Not set"
  //   );

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "OTP for Job Portal",
    text: `Your OTP for Job Portal is: ${otp}`,
    html: `
      <h1>OTP for Job Portal</h1>
      <p>Your OTP for Job Portal is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
    `,
  };

  try {
    // Verify transporter configuration
    await transporter.verify();

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Error details:", error);
    return { success: false, error: error.message };
  }
};

const sendCandidateEmail = async (to, jobTitle, companyName) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: `Job Application Update: ${jobTitle}`,
    html: `
      <h1>Job Application Update</h1>
      <p>Dear Candidate,</p>
      <p>Thank you for your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
      <p>We have received your application and are currently reviewing it. We will contact you soon with further information about the next steps in the hiring process.</p>
      <p>Best regards,<br>${companyName} Hiring Team</p>
    `,
  };

  try {
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendCandidateEmail,
};
