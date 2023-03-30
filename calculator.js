// import express (after npm install express)
const express = require('express');

//import bodyParser and passport libraries to implenent auth in webservice
const bodyParser = require('body-parser');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

// create new express app and save it as "app"
const app = express();

// server configuration
const PORT = 3000;

// Creating Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Creating Passport middleware
app.use(passport.initialize());

// Creating JWT strategy
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: '1234'
};

passport.use(new JwtStrategy(options, function(jwt_payload, done) {
  // check if user exists and return user object if valid
  // else, return false
  if (jwt_payload.username === 'student') {
    return done(null, { username: 'student' });
  } else {
    return done(null, false);
  }
}));

// import winston for logging
const winston = require('winston');

// create logger
const logger = winston.createLogger({ 
    level: 'info', 
    format: winston.format.json(), 
    defaultMeta: { service: 'calculator-microservice' }, 
    transports: [ new winston.transports.Console({ format: winston.format.simple(), }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }), ], });


// insert endpoint - addition
app.post('/addition', passport.authenticate('jwt', { session: false }), (req, res) => {
  // setup operation variable
  const operation = "Addition"
  // first input
  const num1 = Number(req.body.num1);

  // second input
  const num2 = Number(req.body.num2);

  // log operation
  logger.log({ level: 'info', message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`, });

  // check error in inputs - general check if inputs are not numeric
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  // perform basic arithmetic operation
  const result = num1 + num2;
  
  // return results
  res.json({ result });

  
});

// insert endpoint - subtraction
app.post('/subtraction', passport.authenticate('jwt', { session: false }), (req, res) => {
  // setup operation variable
  const operation = "Subtraction"
  
  // first input
  const num1 = Number(req.body.num1);
  
  // second input
  const num2 = Number(req.body.num2);
  
  // log operation
  logger.log({ level: 'info', message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`, });

  // check error in inputs - general check if inputs are not numeric
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  
  // perform basic arithmetic operation
  const result = num1 - num2;
  
  // return results
  res.json({ result });
});

// insert endpoint - multiplication
app.post('/multiplication', passport.authenticate('jwt', { session: false }), (req, res) => {
  // setup operation variable
  const operation = "Multliplication"
  
  // first input
  const num1 = Number(req.body.num1);
  
  // second input
  const num2 = Number(req.body.num2);
  
  // log operation
  logger.log({ level: 'info', message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`, });

  // check error in inputs - general check if inputs are not numeric
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  
  // perform basic arithmetic operation
  const result = num1 * num2;
  
  // return results
  res.json({ result });
});

// insert endpoint - division
app.post('/division', passport.authenticate('jwt', { session: false }), (req, res) => {
  // setup operation variable
  const operation = "Division"
  
  // first input
  const num1 = Number(req.body.num1);
  
  // second input
  const num2 = Number(req.body.num2);
 
  // log operation
  logger.log({ level: 'info', message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`, });

  // check error in inputs - general check if inputs are not numeric
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  if (num2 === 0) {
    return res.status(400).json({ error: 'Division by zero' });
  }
  
  // perform basic arithmetic operation
  const result = num1 / num2;
  
  // return results
  res.json({ result });
});


// create a route for the app
app.get('/', function (req, res) {
    res.send('This is a Calculator microservice \n \
                <br>On this microservice, there are four endpoints:</br> \n \
                    <li>POST /addition</li> \n \
                    <li>POST /subtraction</li> \n\
                    <li>POST /multiplication</li> \n\
                    <li>POST /division</li> \n \
                        <br>Each endpoint should take two input parameters: num1 and num2 </br>\n \
            ');
  });

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'student' && password === '0000') {
    const payload = { username };
    const secretKey = '1234';
    const options = { expiresIn: '1h' };
    const token = jwt.sign(payload, secretKey, options);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
  
// make the server listen to requests
app.listen(PORT, () => {
    console.log(`Calculator microservice listening at: http://localhost:${PORT}/`);
  });

