const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Prevent sensitive error leakage in production
    const isProd = process.env.NODE_ENV === 'production';

    res.status(err.status || 500).json({
        success: false,
        message: isProd ? "Internal Server Error" : err.message || "Internal Server Error",
        ...(isProd ? {} : { stack: err.stack })
    });
};

module.exports = errorHandler;
