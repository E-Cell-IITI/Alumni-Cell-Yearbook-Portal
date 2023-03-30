require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { default: mongoose } = require('mongoose')
const userDataRoutes = require('./routes/userDataRoutes')
const authRoutes = require('./routes/authRoutes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
// const https=require('https');
// const fs=require('fs');
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/yearbookportal-iiti.co.in/alumni cell.pem', 'utf8'); // key
// const credentials = {
//   key: privateKey,
// };
const app = express()
// app.use(express.static('public'));
// const httpsServer = https.createServer(credentials, app);
// httpsServer.listen('5000', () => {
//     console.log('listening on https://yearbookportal-iiti.co.in:5000');
// });

const port = process.env.PORT || 5000

//We are using cors to allow cross-origin requests.
//We are using app.use() to add the cors middleware to the Express application.

//To parse the incoming requests with JSON payloads we are using express.json()
//which is a built-in middleware function in Express.

// ADDING ENVIRENMENT VARIABLES
mongodbLink = process.env.MONGODB_LINK;
clientLink = process.env.CLIENT_LINK;
// console.log(mongodbLink);
// console.log(clientLink);

//Middlewares



app.use(
  cors({
    origin: [clientLink],
    methods: ['GET', 'POST', 'UPDATE', 'PUT'],
    credentials: true,
  }),
)

app.use(express.json())

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

// log in development environment

const morgan = require('morgan')
app.use(morgan('dev'))

app.get('/', (req, res) => {
  // res.json({message: "Hello from server!!"});
  res.send('Hello from server')
})

app.listen(port, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Listening on port ${port}!`)
  }
})

mongoose
  .connect(
    mongodbLink,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log('DB Connection Succesfull')
  })
  .catch((err) => {
    console.log(err.message)
  })

app.use(authRoutes)
app.use(userDataRoutes)

// app.post('/profile', (req,res)=>{
//     userEmail: req.userEmail;

// })

// page not found error handling  middleware

app.use('*', (req, res, next) => {
  const error = {
    status: 404,
    message: 'API Endpoint does not found',
  }
  next(error)
})

// global error handling middleware
app.use((err, req, res, next) => {
  console.log(err)
  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  const data = err.data || null
  res.status(status).json({
    type: 'error',
    message,
    data,
  })
})