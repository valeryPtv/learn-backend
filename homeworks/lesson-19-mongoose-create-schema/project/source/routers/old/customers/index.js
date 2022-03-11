import express from 'express';
import * as handlers from "./handlers";

const router = express.Router();

router.get('/', handlers.getAll);
router.post('/', handlers.create);
router.get('/:id', handlers.getOne);
router.put('/:id', handlers.update);
router.delete('/:id', handlers.deleteEntity);

export { router as customers };
