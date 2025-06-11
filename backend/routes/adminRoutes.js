import express from 'express';
const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).json({
        message: 'User route is working',
        user: req.user || null
    });
});

export default router;