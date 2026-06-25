import { Router } from "express";
import * as applicationsController from "./applications.controller.js";

const router = Router();

router.post('/', applicationsController.create);
router.get('/', applicationsController.list);
router.get('/:id', applicationsController.getOne);
router.patch('/:id', applicationsController.update);
router.delete('/:id', applicationsController.remove);

export default router;