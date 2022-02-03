import { users } from "../users/handlers";

export const login = (req, res) => {
  const wrongCredentialsHandler = () => res.status(401).json({message: 'Wrong credentials'});
  try {
    if(!req.headers.authorization) {
      return wrongCredentialsHandler();
    }

    const credentials = req.headers.authorization.split(' ')[1];
    const [email, password] = Buffer.from(credentials, 'base64').toString('utf8').split(':');

    const foundUser = users.find((user) => user.email === email);

    if(!foundUser || process.env.PASSWORD !== password) {
      return wrongCredentialsHandler();
    }

    req.session.user = { email };

    res.status(200).json({email});
  } catch (error) {
    console.error(error);
  }
}
