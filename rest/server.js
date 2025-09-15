const app = require('./app');

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Rest API rodando na porta ${PORT}`);
});
