const connection = require('../database/connection');
const generateUniqueId = require('../utils/generateUniqueId');
const generateJwtToken = require('../utils/generateJwtToken');

module.exports = {
  async session(request, response) {
    const { email, password } = request.body;

    const user = await connection('users')
      .where('email', email)
      .first();

    if (!user) {
      return response.status(400).json({ error: 'No user found with this email' });
    }

    if (user.password !== password) {
      return response.status(401).json({ error: 'Invalid password' });
    }

    const token = generateJwtToken('user', user.id);

    return response.json({ token });
  },

  async create(request, response) {
    const {
      name,
      email,
      password,
      whatsapp,
      address,
    } = request.body;

    const id = generateUniqueId();

    await connection('users').insert({
      id,
      name,
      email,
      password,
      whatsapp,
      address,
    })
      .catch((err) => response.status(400).send({ error: err.detail }));

    return response.json({ name });
  },
};
