const errorHandler = (err, req, res, next) => {
  if (err.status === 400) return res.status(400).json({ message: err.message });
  if (err.status === 404) return res.status(404).json({ message: err.message });
  if (err.status === 409) return res.status(409).json({ message: err.message });
  console.error(err);
  return res.status(500).json({ message: 'Error interno' });
};

module.exports = errorHandler;
