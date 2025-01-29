import nodemailer from 'nodemailer';
import config from '../config';

interface PurchaseDetails {
  updatedAt: string
  price: number
  coinPlanId: {
    planName: string
    price: number
    coins: number
  }

}

class EmailService {
  static async sendEmail(to: string, subject: string, name: string, details: PurchaseDetails) {

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: config.mailLogin,
        pass: config.mailPassword,
      },
    });

    const mailOptions = {
      from: 'versatileinnovations@udayk.tech',
      to,
      subject,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: rgb(251, 209, 162);
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      font-size: 16px;
      line-height: 1.5;
      color: #333333;
    }
    .order-details {
      margin-top: 20px;
      padding: 10px;
      background-color: #f9f9f9;
      border: 1px solid #dddddd;
    }
    .footer {
      padding: 20px;
      font-size: 12px;
      color: #777777;
      text-align: center;
      background-color: #f4f4f4;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      color: #ffffff;
      background-color: #4CAF50;
      text-decoration: none;
      border-radius: 4px;
    }
    @media (max-width: 600px) {
      .container {
        width: 100%;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Your Purchase!</h1>
    </div>
    <div class="content">
      <p>Hi ${name}</p>
      <p>We’re excited to let you know that your order of ${details.coinPlanId.coins} coins is successful. Here’s a summary of your purchase:</p>
     
        <p><strong>Order Date:</strong>${details.updatedAt}</p>
        <p><strong>Total Amount:</strong> $${details.price}</p>
       <h3>Order Summary:</h3>
      <ul>
        <li>${details.coinPlanId.planName} - $${details.coinPlanId.price} - ${details.coinPlanId.coins} Coins</li>
      </ul>
    </div>
    <div class="footer">
      <p>Thank you for shopping with us!</p>
      <p>Best regards, <br> Versatile Innovations Team</p>
    </div>
  </div>
</body>
</html>
`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Error:', error);
      }
      console.log('Email sent:', info.response);
    });
  }

}

export default EmailService