import bcrypt from "bcryptjs";
import ApiError from "../../lib/ApiError.js";
import database from "../../lib/db.js";
import { signToken } from "../../lib/jwt.js"

const saltRounds = 10;

export async function register({ email, password, name }) {

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const params = {
        email,
        password_hash: hashedPassword,
        name
    };

    let result;

    try{
        result = database.prepare(
            'INSERT INTO users (email, password_hash, name) VALUES (@email, @password_hash, @name) RETURNING *'
        ).get(params);
    }catch(err){
        if(err.code === 'SQLITE_CONSTRAINT_UNIQUE') throw new ApiError(409, "User already exists.");
        throw err;
    }

    const token = signToken(result);
    return { user: { id: result.id, email: result.email, name: result.name, created_at: result.created_at }, token };
};

export async function login({ email, password }) {
    
    const user = database.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if(!user) throw new ApiError(401, "Invalid credentials.");

    const valid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if(!valid) throw new ApiError(401, "Invalid credentials.");

    const token = signToken(user);

    return { user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at }, token };
}