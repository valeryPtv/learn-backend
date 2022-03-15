import jsonSchema from "jsonschema";
import {ValidationError} from "./errors";

const validator = new jsonSchema.Validator();

export const validateAndThrow = (input, schema) => {
  const validationResult = validator.validate(input, schema);

  if(validationResult.errors.length > 0) {
    throw new ValidationError(validationResult.toString());
  }
}

