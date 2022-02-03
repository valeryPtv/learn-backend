import express from 'express';
import * as handlers from "./handlers";
import {enrollStudentToClass} from "./handlers";
import {authMiddleware} from "../../middlewares";

const router = express.Router();

router.get('/', handlers.getAll);
router.post('/', authMiddleware, handlers.create);
router.get('/:userHash', authMiddleware, handlers.getOne);
router.put('/:userHash', authMiddleware, handlers.update);
router.delete('/:userHash', authMiddleware, handlers.deleteEntity);

router.delete('/:classHas/enroll', authMiddleware, handlers.enrollStudentToClass);
router.delete('/:classHash/expelStudentFromClass', authMiddleware, handlers.enrollStudentToClass);

export { router as classes };
