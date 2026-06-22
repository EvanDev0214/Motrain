import { Router } from 'express';
import basicAuth from 'express-basic-auth';
import env from '@/configs/env';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '@/swagger/docs';
import { isDev } from '@/utils/env';

const swaggerMiddleware = Router();

if (isDev && env.SWAGGER_PASSWORD && env.SWAGGER_USER) {
  swaggerMiddleware.use('/api-docs',
    basicAuth({
      users: { [env.SWAGGER_USER]: env.SWAGGER_PASSWORD },
      challenge: true,
      realm: 'API Documentation'
    }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
  );
}

export default swaggerMiddleware;
