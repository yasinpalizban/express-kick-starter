import { AppInterface } from '@/interfaces/app.interface';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from './configs/config';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import DB from './databases/database';
import { Routes } from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';
import path from 'path';
import corsMiddleware from '@/middlewares/cors.middleware';
import urlMiddleware from '@/middlewares/url.middleware';
import contentNegotiationMiddleware from '@/middlewares/content.negotiation.middleware';
import dataInputMiddleware from '@/middlewares/data.input.middleware';
import userAgent from 'express-useragent';
import { default as i18n } from 'i18next';
import Backend from 'i18next-fs-backend';
import { LanguageDetector, handle } from 'i18next-http-middleware';
class App implements AppInterface {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.connectToDatabase();
    this.initializeI18n();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    DB.sequelize.sync({ force: false });
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(userAgent.express());

    this.app.use('/public', express.static(path.join(__dirname, '../public')));
    this.app.use(corsMiddleware);
    this.app.use(urlMiddleware);
    this.app.use(contentNegotiationMiddleware);
    this.app.use(dataInputMiddleware);
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }
  private initializeI18n(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    i18n
      .use(Backend)
      .use(LanguageDetector)
      .init({
        lng: 'en',
        whitelist: ['en', 'fa'],
        fallbackLng: 'en',
        preload: ['en', 'fa'],
        // have a common namespace used around the full app
        ns: ['translation'],
        debug: false,
        backend: {
          loadPath: path.join(__dirname + '/locales/{{lng}}/{{ns}}.json'),
          // jsonIndent: 2
        },
      });
    this.app.use(handle(i18n));
  }
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
