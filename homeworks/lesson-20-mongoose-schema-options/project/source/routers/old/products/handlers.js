import {findEntityOrThrow} from "../../../utils";

const products = [
  { name: 'Ketchup', price: 200, id: 1 },
  { name: 'Chicken Seasoning', price: 100, id: 2 },
  { name: 'Beef', price: 500, id: 3 },
]

export const getProducts = (req, res) => {
  try {
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getProduct = (req, res) => {
  try {
    const product = findEntityOrThrow(req, products);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const createProduct = (req, res) => {
  try {
    res.status(201).json({
      ...req.body,
      id: (Math.random() * 10).toFixed()
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const updateProduct = (req, res) => {
  try {
    const product = findEntityOrThrow(req, products);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const deleteProduct = (req, res) => {
  try {
    const product = findEntityOrThrow(req, products);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
}

