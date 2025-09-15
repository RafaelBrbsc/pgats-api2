const transferService = require('../../src/service/transferService');
const userService = require('../../src/service/userService');

exports.transfer = (req, res) => {
  const { from, to, amount } = req.body;
  if (!from || !to || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Remetente, destinatário e valor são obrigatórios.' });
  }
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const decoded = userService.verifyToken(token);
  if (!decoded || decoded.user.username != from) {
    return res.status(403).json({ error: 'Token inválido.' });
  }
  const result = transferService.transfer({ from, to, amount });
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json(result.transfer);
};

exports.getTransfers = (req, res) => {
  res.json(transferService.getTransfers());
};
