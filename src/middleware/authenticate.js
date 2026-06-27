import { verifyToken } from "../lib/jwt.js";
import ApiError from "../lib/ApiError.js";

export default function authenticate(req, res, next){
    const header = req.headers.authorization;

    if(!header || !header.startsWith('Bearer ')) throw new ApiError(401, 'Missing or malformed token');

    let payload;
    try {
    payload = verifyToken(header.slice(7));
    } catch (err) {
    throw new ApiError(401, 'Missing or malformed token');
    }

    req.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name
    }
    next();
};