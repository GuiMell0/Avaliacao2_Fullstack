function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, currentValue]) => {
      if (key.includes('$') || key.includes('.')) {
        return acc;
      }
      acc[key] = sanitizeValue(currentValue);
      return acc;
    }, {});
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  return value;
}

function sanitizeInput(req, _res, next) {
  req.body = sanitizeValue(req.body || {});
  req.query = sanitizeValue(req.query || {});
  req.params = sanitizeValue(req.params || {});
  next();
}

module.exports = { sanitizeInput };
