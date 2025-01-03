import jwt from 'jsonwebtoken';
const { verify } = jwt;

export default async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const verified = verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};