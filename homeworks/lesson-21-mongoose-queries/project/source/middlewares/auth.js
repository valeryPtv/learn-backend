export const authMiddleware= (req, res, next) => {
  if(!req.session?.user?.email) {
    console.log({'req.session': req.session});
    return res.status(401).json({ error: 'Login required'});
  }

  return next();
}
