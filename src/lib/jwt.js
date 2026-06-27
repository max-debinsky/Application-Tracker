import jwt from "jsonwebtoken";
import 'dotenv/config';

export function signToken(user){
    return jwt.sign({
        sub: String(user.id), email: user.email, name: user.name
        }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token){
    return  jwt.verify(token, process.env.JWT_SECRET);
}