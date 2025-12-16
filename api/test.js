/**
 * Test route pour Vercel
 */
module.exports = (req, res) => {
    res.json({ 
        message: 'Test route works!',
        method: req.method,
        path: req.path,
        url: req.url,
        originalUrl: req.originalUrl
    });
};

