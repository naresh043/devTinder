const express = require('express');
const app = express();

// Optional literal 'b' (matches '/abc' and '/ac')
app.get('/a{b}c', (req, res) => res.send('Matched /a{b}c'));

// RegExp route for 'ab+c' (one or more 'b's)
app.get(/^\/ab+c$/, (req, res) => res.send('Matched /^\\/ab+c$/'));

// RegExp route for 'ab*c' (zero or more 'b's)
app.get(/^\/ab*c$/, (req, res) => res.send('Matched /^\\/ab*c$/'));

// RegExp route containing 'a' anywhere
// app.get(/a/, (req, res) => res.send('Matched /a/')); 

// RegExp route with group (matches '/abcd')
app.get(/a(bc)d/, (req, res) => res.send('Matched /(bc)/ group route'));

app.listen(3000, () => console.log('Listening on port 3000'));
