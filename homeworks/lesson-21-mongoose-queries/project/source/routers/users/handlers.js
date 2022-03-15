import { findEntityOrThrow } from "../../utils";

export const users = [
  {
    "name": "John Doe",
    "email": "jdoe@example.com",
    "phone": "+380662332377",
    "password": "ab12345Cd",
    "sex": "m",
    "role": "newbie",
    "hash": "1",
  },
  {
    "name": "Kurt Kobain",
    "email": "jdoe@example.com",
    "phone": "+380662332377",
    "password": "ab12345Cd",
    "sex": "m",
    "role": "expert",
    "hash": "2",
  },
  {
    "name": "Stanley Kubrick",
    "email": "jdoe@example.com",
    "phone": "+380662332377",
    "password": "ab12345Cd",
    "sex": "m",
    "role": "expert",
    "hash": "3",
  },
  {
    "name": "Me",
    "login": "valeryPtv",
    "email": "jdoe@example.com",
    "phone": "+380662332377",
    "password": "ab12345Cd",
    "sex": "m",
    "role": "expert",
    "hash": "3",
  }
];

export const getAll = (req, res) => {
  try {
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getOne = (req, res) => {
  try {
    const customer = findEntityOrThrow(req, users, 'hash');
    res.status(200).json(customer);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const create = (req, res) => {
  try {
    res.status(201).json({
      ...req.body,
      hash: (Math.random() * 10).toFixed()
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const update = (req, res) => {
  try {
    const customer = findEntityOrThrow(req, users, 'hash');
    res.status(200).json(customer);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message })
  }
}

export const deleteEntity = (req, res) => {
  try {
    const customer = findEntityOrThrow(req, users, 'hash');
    res.status(200).json(customer);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
}
