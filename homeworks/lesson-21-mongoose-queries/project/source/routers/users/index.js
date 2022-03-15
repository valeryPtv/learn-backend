import express from 'express';
import * as handlers from "./handlers";
import {authMiddleware} from "../../middlewares";

const router = express.Router();

router.get('/', authMiddleware, handlers.getAll);
router.post('/', handlers.create);
router.get('/:userId', authMiddleware, handlers.getOne);
router.put('/:userId', authMiddleware, handlers.update);
router.delete('/:userId', authMiddleware, handlers.deleteEntity);

export { router as users };
