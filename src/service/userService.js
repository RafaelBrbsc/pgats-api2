const { users } = require('../model/userModel');
const jwt = require('jsonwebtoken');

function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

function registerUser({ username, password, favorecido }) {
  if (findUserByUsername(username)) {
    return { error: 'Usuário já existe.' };
  }
  const user = { username, password, favorecido: !!favorecido, balance: 0 };
  users.push(user);
  return { user };
}

function loginUser({ username, password }) {
  const user = findUserByUsername(username);
  if (!user || user.password !== password) {
    return { error: 'Credenciais inválidas.' };
  }
  const token = jwt.sign({ user }, process.env.JWT_SECRET || 'segredo', { expiresIn: '1h' });
  return { token };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'segredo')
  } catch {
    return null
  }
}

function getAllUsers() {
  return users;
}

module.exports = {
  findUserByUsername,
  registerUser,
  loginUser,
  verifyToken,
  getAllUsers,
};
