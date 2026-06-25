import ApiError from "../../lib/ApiError.js";
import * as applicationService from "./applications.service.js";
import { createApplicationSchema, updateApplicationSchema, idSchema } from "./applications.schema.js";

export function list(req, res, next){
    try{
        const result = applicationService.list();

        res.status(200).json({data: result});
    }catch(err){
        next(err);
    }

}

export function getOne(req, res, next){
    try{
        const id = idSchema.parse(req.params.id);

        const row = applicationService.getById(id);

        if(row === undefined) throw new ApiError(404, "Application not found.");

        res.status(200).json({data: row});
    }catch(err){
        next(err);
    }
}

export function create(req, res, next){
    try{
        const data = createApplicationSchema.parse(req.body);

        const application = applicationService.create(data);

        res.status(201).json({data: application});
    }catch(err){
        next(err);
    }
}

export function update(req, res, next){
    try{
        const id = idSchema.parse(req.params.id);
        const data = updateApplicationSchema.parse(req.body);

        const application = applicationService.update(id, data);

        if(application === undefined) throw new ApiError(404, "Application not found");

        res.status(200).json({data: application});
    }catch(err){
        next(err);
    }
}

export function remove(req, res, next){
    try{
        const id = idSchema.parse(req.params.id);

        const notDeleted = applicationService.remove(id);

        if(notDeleted) throw new ApiError(404, "Application not found.");

        res.status(204).end();   
    }catch(err){
        next(err);
    }
}