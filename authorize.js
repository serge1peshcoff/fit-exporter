require('dotenv').config();

const {google} = require('googleapis');
const readline = require('readline-sync');
const url = require('url');
const fs = require('fs');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.blood_glucose.read',
    'https://www.googleapis.com/auth/fitness.blood_pressure.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.body_temperature.read',
    'https://www.googleapis.com/auth/fitness.location.read',
    'https://www.googleapis.com/auth/fitness.nutrition.read',
    'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
    'https://www.googleapis.com/auth/fitness.reproductive_health.read',
    'https://www.googleapis.com/auth/fitness.sleep.read',
];

const authorizeUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: scopes
});

console.log('Go to this link:');
console.log('   ' + authorizeUrl);
console.log();

const responseUrl = readline.question('Enter the URL you were redirected to: ');

const parsed = url.parse(responseUrl, true);
const code = parsed.query.code;

// This will provide an object with the access_token and refresh_token.
// Save these somewhere safe so they can be used at a later time.
oauth2Client.getToken(code).then(res => {
    fs.writeFileSync('./tokens/tokens.json', JSON.stringify(res.tokens));
    console.log('Token saved!');
    process.exit(0);
})