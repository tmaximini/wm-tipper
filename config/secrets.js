module.exports = {
  db: process.env.MONGODB || 'mongodb://localhost:27017/wm-tipper-test',

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  localAuth: true,

  mailgun: {
    login: process.env.MAILGUN_LOGIN || 'Your Mailgun SMTP Username',
    password: process.env.MAILGUN_PASSWORD || 'Your Mailgun SMTP Password'
  },

  sendgrid: {
    user: process.env.SENDGRID_USER || 'Your SendGrid Username',
    password: process.env.SENDGRID_PASSWORD || 'Your SendGrid Password'
  },


  facebookAuth: true,
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'Your Facebook Username',
    clientSecret: process.env.FACEBOOK_SECRET || 'Your Facebook Secret',
    callbackURL: 'http://wm-tipper.de/auth/facebook/callback',
    passReqToCallback: true
  },

  twitterAuth: true,
  twitter: {
    consumerKey: process.env.TWITTER_KEY || 'Your Consumer Key',
    consumerSecret: process.env.TWITTER_SECRET  || 'Your Consumer Secret',
    callbackURL: 'http://wm-tipper.de/auth/twitter/callback',
    passReqToCallback: true
  },

  googleAuth: true,
  google: {
    clientID: process.env.GOOGLE_ID || 'Your Client ID',
    clientSecret: process.env.GOOGLE_SECRET || 'Your Client Secret',
    callbackURL: 'http://wm-tipper.de/auth/google/callback',
    passReqToCallback: true
  }

};
