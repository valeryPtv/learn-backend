import express from 'express';
import * as handlers from "./handlers";
import {authMiddleware} from "../../middlewares";
import passport from "passport";
import {jwtProtectedExample} from "./handlers";

const router = express.Router();

router.get('/', authMiddleware, handlers.getAll);
router.post('/', handlers.create);
router.get('/:userHash', authMiddleware, handlers.getOne);
router.put('/:userHash', authMiddleware, handlers.update);
router.delete('/:userHash', authMiddleware, handlers.deleteEntity);

export { router as users };
