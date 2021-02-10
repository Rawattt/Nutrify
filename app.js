const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const config_path = path.resolve(__dirname, 'config.env');
dotenv.config({ path: config_path });

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const mealRouter = require('./routes/meal');
const basicRouter = require('./routes/basic');
const adminRouter = require('./routes/admin');

const app = express();

const { EXPIRES_TIME, NAME, SECRET, DEV } = process.env;
const max_age = EXPIRES_TIME * 60 * 60 * 24 * 1000;

app.use(
    session({
        name: NAME,
        secret: SECRET,
        saveUninitialized: true,
        resave: true,
        store: new MongoStore({
            url: `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster.glwj2.mongodb.net/nutrify?retryWrites=true&w=majority`
        }),
        cookie: {
            maxAge: max_age,
            sameSite: true,
            secure: !DEV
        }
    })
);

const db = require('./db/db');
db();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

//  Sanitize data
app.use(sanitize());

// //Set security headers
// app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Prevent http params pollution
app.use(hpp());

// // Enable CORS
// app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', basicRouter);
app.use('/api/v1/auth', authRouter);
app.use('/user', userRouter);
app.use('/meal', mealRouter);
app.use('/admin', adminRouter);

// Undefined urls
app.get('/not-found', (req, res) => res.render('error'));
app.get('/*', (req, res) => res.redirect('/not-found'));

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(`ERROR: ${err}`);
        process.exit();
    }
    console.log(`Server is running on port ${process.env.PORT}`);
});
