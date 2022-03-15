import express from 'express';
import * as handlers from "./handlers";
import { authMiddleware } from "../../middlewares";

const router = express.Router();

const ignoreAuth = true;
const middlewares = [];

if(!ignoreAuth) {
    middlewares.push(authMiddleware);
}

router.get('/', handlers.getAll);
router.post('/', ...middlewares, handlers.create);
router.get('/:id', ...middlewares, handlers.getOne);
router.put('/:id', ...middlewares, handlers.update);
router.delete('/:id', ...middlewares, handlers.deleteEntity);

// Materials
router.get('/:lessonId/videos/:videoId', ...middlewares, handlers.getVideoFromLesson);
router.post('/:lessonId/videos', ...middlewares, handlers.addVideoToLesson);
router.delete('/:lessonId/videos/:videoId', ...middlewares, handlers.deleteVideoFromLesson);

router.get('/:lessonId/keynotes/:keynoteId', authMiddleware, handlers.addKeynoteToLesson);
router.post('/:lessonId/keynotes', authMiddleware, handlers.addKeynoteToLesson);
router.delete('/:lessonId/keynotes/:keynoteId', authMiddleware, handlers.deleteKeynoteFromLesson);

export { router as lessons };
