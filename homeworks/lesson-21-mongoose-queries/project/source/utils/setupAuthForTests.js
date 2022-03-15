/**
 * @param server - supertest server wrap
 */
export const setupAuthForTests = async (server, email = 'jdoe@example.com', password = process.env.PASSWORD) => {
  try {
    const authHeader = 'Basic ' + Buffer.from(`${email}:${password}`).toString('base64');

    const response = await server.post('/api/auth/login').set('Authorization', authHeader);
    const authCookies = response.headers['set-cookie'][0];
    server.jar.setCookie(authCookies);
  } catch (error) {
    console.error(error);
  }
}
