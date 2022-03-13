import {findEntityOrThrow} from "../../../utils";

const customers = [
  { firstName: 'Oliver', lastName: 'Twist', age: '25', occupation: 'adventurer',  id: 1 },
  { firstName: 'Barak', lastName: 'Obama', age: '48', occupation: 'politician',  id: 2 },
  { firstName: 'Stanley', lastName: 'Kubrick', age: '60', occupation: 'director',  id: 3 },
]

export const getAll = (req, res) => {
  try {
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getOne = (req, res) => {
  try {
    console.log({id: req.params.id});
    const customer = findEntityOrThrow(req, customers);
    res.status(200).json(customer);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const create = (req, res) => {
  try {
    res.status(201).json({
      ...req.body,
      id: (Math.random() * 10).toFixed()
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const update = (req, res) => {
  try {
    const customer = findEntityOrThrow(req, customers);
    res.status(200).json(customer);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const deleteEntity = (req, res) => {
  try {
    const customer = findEntityOrThrow(req, customers);
    res.status(200).json(customer);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
}

