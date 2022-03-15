import { NotFoundError } from "./errors";

export const findEntityOrThrow = (req, collection, fieldName = 'id') => {
  const value = req.params[fieldName];
  const entity = collection.find((product) => String(product[fieldName]) === value);
  if (!entity) {
    throw new NotFoundError(`There is no entity with ${fieldName} ${value}`);
  }

  return entity;
}
