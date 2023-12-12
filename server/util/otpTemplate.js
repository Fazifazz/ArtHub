// otpTemplate.js
module.exports = function (otp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
    
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    
        .header {
          text-align: center;
          color: #333;
        }
    
        .content {
          margin-top: 20px;
          text-align: center;
        }
    
        .otp-code {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
        }
    
        .note {
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>ArtHub Email Verification</h2>
        </div>
        <div class="content">
          <p>Hi there!</p>
          <p>Your OTP (One-Time Password) for ArtHub registration is:</p>
          <p class="otp-code">${otp}</p>
          <p class="note">This OTP is only valid for 1 minute.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
