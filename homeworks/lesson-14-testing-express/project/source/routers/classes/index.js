import express from 'express';
import * as handlers from "./handlers";
import {expelStudentFromClass} from "./handlers";
// import {authMiddleware} from "../../middlewares";

const router = express.Router();

const authMiddleware = (req, res, next) => next();

router.get('/', handlers.getAll);
router.post('/', authMiddleware, handlers.create);
router.get('/:hash', authMiddleware, handlers.getOne);
router.put('/:hash', authMiddleware, handlers.update);
router.delete('/:hash', authMiddleware, handlers.deleteEntity);

router.post('/:hash/enroll', authMiddleware, handlers.enrollStudentToClass);
router.post('/:hash/expel', authMiddleware, handlers.expelStudentFromClass);

export { router as classes };
