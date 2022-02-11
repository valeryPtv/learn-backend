import {findEntityOrThrow} from "../../../utils";

const orders = [
  { name: 'Delicious food', description: 'Tasty stuff', price: 700,  id: 1 },
  { name: 'Strawberry pie', description: 'Sweet and delicious',  price: 400, id: 2 },
  { name: 'Elven sword', description: 'Sword', price: 16200, id: 3 },
]

export const getAll = (req, res) => {
  try {
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getOne = (req, res) => {
  try {
    console.log({id: req.params.id});
    const order = findEntityOrThrow(req, orders);
    res.status(200).json(order);
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
    const order = findEntityOrThrow(req, orders);
    res.status(200).json(order);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const deleteEntity = (req, res) => {
  try {
    const order = findEntityOrThrow(req, orders);
    res.status(200).json(order);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
}

