function errorHandler(error, _req, res, _next) {
  const status = error.status || error.statusCode || 500;

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ erro: 'E-mail já cadastrado.' });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ erro: error.message });
  }

  return res.status(status).json({
    erro: status === 500 ? 'Erro interno do servidor.' : error.message,
  });
}

module.exports = { errorHandler };
