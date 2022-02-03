import express from 'express';
import * as handlers from "./handlers";
import { authMiddleware } from "../../middlewares";

const router = express.Router();

router.get('/', handlers.getAll);
router.post('/', authMiddleware, handlers.create);
router.get('/:userHash', authMiddleware, handlers.getOne);
router.put('/:userHash', authMiddleware, handlers.update);
router.delete('/:userHash', authMiddleware, handlers.deleteEntity);

// Materials
router.get('/:lessonHash/videos/:videoHash', authMiddleware, handlers.getVideoFromLesson);
router.post('/:lessonHash/videos', authMiddleware, handlers.addVideoToLesson);
router.delete('/:lessonHash/videos/:videoHash', authMiddleware, handlers.deleteVideoFromLesson);

router.get('/:lessonHash/keynotes/:keynoteHash', authMiddleware, handlers.addKeynoteToLesson);
router.post('/:lessonHash/keynotes', authMiddleware, handlers.addKeynoteToLesson);
router.delete('/:lessonHash/keynotes/:keynoteHash', authMiddleware, handlers.deleteKeynoteFromLesson);

export { router as lessons };
