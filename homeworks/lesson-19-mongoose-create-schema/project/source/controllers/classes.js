import { ClassesModel } from "../models";

export class ClassesController {
  // data <- req.body
  constructor() {
    this.models = {
      classes: new ClassesModel()
    };
  }

  async get(query = {}) {
    return await this.models.classes.get(query);
  }

  async create(data) {
    return await this.models.classes.create(data);
  }
}

export const classes = new ClassesController();
