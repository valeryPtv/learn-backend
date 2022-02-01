export const authMiddleware= (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(authHeader && authHeader === process.env.PASSWORD) {
    return next();
  }

  res.status(401).json({ error: 'Wrong password'});
}
