const staff = [
  { name: 'Robert', description: 'Manager', salary: 20700,  id: 1 },
  { name: 'Annie', description: 'Developer', salary: 18700,  id: 2 },
]

export const getAll = (req, res) => {
  try {
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message })
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
