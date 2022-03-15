import express from 'express';
import * as handlers from "./handlers";
import {authMiddleware} from "../../middlewares";

const router = express.Router();
// const authMiddleware = (req, res, next) => next();
const ignoreAuth = true;
const middlewares = [];

if(!ignoreAuth) {
  middlewares.push(authMiddleware);
}

router.get('/', handlers.getAll);
router.post('/', ...middlewares, handlers.create);
router.post('/', handlers.create);
router.get('/:id', ...middlewares, handlers.getOne);
router.put('/:id', ...middlewares, handlers.update);
router.delete('/:id', ...middlewares, handlers.deleteEntity);

router.post('/:id/enroll', ...middlewares, handlers.enrollStudentToClass);
router.post('/:id/expel', ...middlewares, handlers.expelStudentFromClass);

export { router as classes };
