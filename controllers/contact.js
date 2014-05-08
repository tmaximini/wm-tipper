var secrets = require('../config/secrets');
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport('SMTP', {
//  service: 'Mailgun',
//  auth: {
//    user: secrets.mailgun.login,
//    pass: secrets.mailgun.password
//  }
  service: 'SendGrid',
  auth: {
       user: secrets.sendgrid.user,
       pass: secrets.sendgrid.password
  }
});

/**
 * GET /contact
 * Contact form page.
 */

exports.getContact = function(req, res) {
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 * @param email
 * @param name
 * @param message
 */

exports.postContact = function(req, res) {
  req.assert('name', 'Bitte einen Namen angeben').notEmpty();
  req.assert('email', 'Ungültige Email').isEmail();
  req.assert('message', 'Nachricht darf nicht leer sein').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  var from = req.body.email;
  var name = req.body.name;
  var body = req.body.message;
  var to = 'info@wm-tipper.de';
  var subject = 'Kontakt Form | WM Tipper';

  var mailOptions = {
    to: to,
    from: from,
    subject: subject,
    text: body
  };

  smtpTransport.sendMail(mailOptions, function(err) {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Ihre Email wurde erfolgreich gesendet!' });
    res.redirect('/contact');
  });
};
