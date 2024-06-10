const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Use json middleware
app.use(express.json());

// Error handling
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred on the server',
        });
    } else {
        next();
    }
});

// Routes
app.use('/', require('./api'));

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
