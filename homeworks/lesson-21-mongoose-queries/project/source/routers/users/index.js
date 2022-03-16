import express from 'express';
import * as handlers from "./handlers";
import {authMiddleware} from "../../middlewares";

const router = express.Router();

const ignoreAuth = true;
const middlewares = [];

if(!ignoreAuth) {
    middlewares.push(authMiddleware);
}

router.get('/', ...middlewares, handlers.getAll);
router.post('/', handlers.create);
router.get('/:userHash', ...middlewares, handlers.getOne);
router.put('/:userHash', ...middlewares, handlers.update);
router.delete('/:userHash', ...middlewares, handlers.deleteEntity);

export { router as users };
