import express from 'express';
import * as handlers from "./handlers";

const router = express.Router();

router.get('/', handlers.getAll);
router.post('/', handlers.create);

export { router as staff };
