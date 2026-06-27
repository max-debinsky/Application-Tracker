import ApiError from "../../lib/ApiError.js";
import * as authService from './auth.service.js';
import { loginSchema, registerSchema } from "./auth.schema.js";

export async function register(req, res, next){
    try{
        const data = registerSchema.parse(req.body);

        const result = await authService.register(data);

        res.status(201).json({data: result});
    }catch(err){
        next(err);
    }
}

export async function login(req, res, next){
    try{
        const data = loginSchema.parse(req.body);

        const result = await authService.login(data);

        res.status(200).json({data: result});
    }catch(err){
        next(err);
    }
}

export function me(req, res, next){
    try{
        res.status(200).json({data: req.user});
    }catch(err){
        next(err);
    }
}