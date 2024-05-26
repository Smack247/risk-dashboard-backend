const nodemailer = require('nodemailer');
const logger = require('../logger');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

let subscribers = [];

exports.subscribe = (req, res) => {
  const subscriberId = req.body.id;
  if (!subscribers.includes(subscriberId)) {
    subscribers.push(subscriberId);
  }
  res.status(200).send('Subscribed successfully');
};

exports.notify = (req, message) => {
  const io = req.app.get('socketio');
  io.emit('notification', message);
  
  // Send email notifications
  subscribers.forEach(subscriber => {
    const mailOptions = {
      to: subscriber,
      from: 'your-email@gmail.com',
      subject: 'New Notification',
      text: message
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        logger.error('Error sending email notification', err);
      } else {
        logger.info(`Email sent to ${subscriber}`);
      }
    });
  });
};