const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

const azureAdStrategy = new OIDCStrategy({
  identityMetadata: `https://login.microsoftonline.com/YOUR_TENANT_ID/v2.0/.well-known/openid-configuration`,
  clientID: 'YOUR_CLIENT_ID',
  responseType: 'code',
  responseMode: 'query',
  redirectUrl: 'http://localhost:5000/api/auth/callback', // Change this to your callback URL
  allowHttpForRedirectUrl: true,
  clientSecret: 'YOUR_CLIENT_SECRET',
  validateIssuer: false,
  passReqToCallback: false,
  scope: ['profile', 'offline_access', 'email']
}, (iss, sub, profile, accessToken, refreshToken, done) => {
  if (!profile.oid) {
    return done(new Error("No oid found"), null);
  }
  process.nextTick(() => {
    // Save or update user profile here
    return done(null, profile);
  });
});

module.exports = azureAdStrategy;