require('dotenv').config();
const express = require('express');
const querystring = require('querystring');
const app = express();
const axios = require('axios');
const port = 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

console.log(process.env.CLIENT_ID);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/', (req, res) => {
    const data = {
        name: 'Hello World',
        isAwesome: true
    };


    res.json(data);
});

const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

const stateKey = 'spotify_auth_state';




app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = 'user-read-private user-read-email';

    const queryParams = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope
    });

    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/callback', (req, res) => {
    const code = req.query.code || null;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:$
            {CLIENT_SECRET}`).toString('base64')}`,
        },
    })
    .then((response) => {
        if (response.status === 200) {
            res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        } else {
            res.send(response);
        }
    })
    .catch((error) => {
        res.send(error);
    });
});





app.listen(port, () => { 
    console.log(`Express app listening at http://localhost:${port}`);
});


// Code from Spotify 

// var client_id = 'CLIENT_ID';
// var redirect_uri = 'http://localhost:8888/callback';


// app.get('/login', function(req, res) {

//   var state = generateRandomString(16);
//   var scope = 'user-read-private user-read-email';

//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: client_id,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state
//     }));
// });