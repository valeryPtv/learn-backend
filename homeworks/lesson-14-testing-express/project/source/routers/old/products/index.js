import express from 'express';
import * as handlers from "./handlers";

const router = express.Router();

router.get('/', handlers.getProducts);
router.post('/', handlers.createProduct);
router.get('/:id', handlers.getProduct);
router.put('/:id', handlers.updateProduct);
router.delete('/:id', handlers.deleteProduct);

export { router as products };
