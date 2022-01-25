import { NotFoundError } from "./errors";

export const findEntityOrThrow = (req, collection) => {
  const id = req.params.id;
  const entity = collection.find((product) => String(product.id) === id);
  if (!entity) {
    throw new NotFoundError(`There is no entity with id ${id}`);
  }

  return entity;
}
