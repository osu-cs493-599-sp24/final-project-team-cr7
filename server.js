require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const redis = require('redis')
const api = require('./api')
const sequelize = require('./lib/sequelize')

const app = express();
const port = process.env.PORT || 8080;

// Redis information
const redisHost = process.env.REDIS_HOST || "localhost"
const redisPort = process.env.REDIS_PORT || "6379"
const redisClient = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`
})

async function connectRedis() {
    await redisClient.connect()
}

const rateLimitWindowMillis = 60000

async function rateLimit(req, res, next) {

    let rateLimitMaxRequests
    let rateLimitRefreshRate
    
    verify = verifyAuthentication(req)

    // Set to 30 for authorized users, else 10
    rateLimitMaxRequests = verify ? 30 : 10
    rateLimitRefreshRate = rateLimitMaxRequests / rateLimitWindowMillis

    let tokenBucket
    try {
        tokenBucket = await redisClient.hGetAll(req.ip)
    } catch (e) {
        next()
        return
    }

    tokenBucket = {
        tokens: parseFloat(tokenBucket.tokens) || rateLimitMaxRequests,
        last: parseInt(tokenBucket.last) || Date.now()
    }

    const timestamp = Date.now()
    const ellapsedMillis = timestamp - tokenBucket.last
    tokenBucket.tokens += ellapsedMillis * rateLimitRefreshRate
    tokenBucket.tokens = Math.min(tokenBucket.tokens, rateLimitMaxRequests)
    tokenBucket.last = timestamp

    if (tokenBucket.tokens >= 1) {
        tokenBucket.tokens -= 1
        await redisClient.hSet(req.ip, [
            [ "tokens", tokenBucket.tokens ],
            [ "last", tokenBucket.last ]
        ])
        next()

    } else {
        await redisClient.hSet(req.ip, [
            [ "tokens", tokenBucket.tokens ],
            [ "last", tokenBucket.last ]
        ])
        res.status(429).send({ error: "Too many requests per minute" })
    }
}

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use(rateLimit)
app.use('/', api);

app.use('/', function (req, res, next) {
    res.status(404).json({
        error: "Requested resource " + req.originalUrl + " does not exist"
    });
});

app.use('/', function (err, req, res, next) {
    console.error("== Error:", err)
    res.status(500).send({
        err: "Server error.  Please try again later."
    })
})

sequelize.sync().then(async function () {
    try {
        await connectRedis()
    } catch (err) {
        console.log("Error connecting to redis server: ", err)
    }
    app.listen(port, function() {
        console.log("== Server is running on port", port);
    });
})

// const express = require('express');
// const app = express();
// const port = process.env.PORT || 3000;

// // Use json middleware
// app.use(express.json());

// // Error handling
// app.use((err, req, res, next) => {
//     if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
//         console.error(err); // Log the error for debugging
//         return res.status(500).json({
//             error: 'Internal Server Error',
//             message: 'An unexpected error occurred on the server',
//         });
//     } else {
//         next();
//     }
// });

// // Routes
// app.use('/', require('./api'));

// // Start server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });