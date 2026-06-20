const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const { env } = require('./config/env');
const routes = require('./routes');
const swaggerSpec = require('./docs/swagger');
const { globalLimiter } = require('./middlewares/rateLimit');
const { sanitizeInput } = require('./middlewares/sanitizeInput');
const { notFound } = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
app.use(express.json({ limit: '10kb' }));
app.use(sanitizeInput);

if (env.nodeEnv !== 'test') {
  app.use(globalLimiter);
  app.use(morgan('combined'));
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
