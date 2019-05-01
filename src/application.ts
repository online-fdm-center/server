import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MySequence } from './sequence';
import { MyAuthStrategyProvider } from './providers/auth-strategy.provider';
import {
  AuthenticationComponent,
  AuthenticationBindings,
} from '@loopback/authentication';

export class OnlineFdmCenterApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.component(AuthenticationComponent);
    this.bind(AuthenticationBindings.STRATEGY).toProvider(
      MyAuthStrategyProvider,
    );

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.api({
      openapi: '3.0.0',
      info: {
        title: process.env.REST_APPLICATION_NAME || 'online.fdm.center api server',
        description: 'Описание API для работы с сервисом онлайн заказа 3d печати',
        version: process.env.REST_APPLICATION_NAME || '1.0.0',
      },
      paths: {},
      tags: [
        {
          name: 'AuthController',
          description: 'Контроллер авторизации'
        }
      ],
      components: {
        securitySchemes: {
          authToken: {
            type: 'apiKey',
            name: 'x-auth-token',
            in: 'header'
          },
          adminToken: {
            type: 'apiKey',
            name: 'x-admin-token',
            in: 'header',
          },
          serverToken: {
            type: 'apiKey',
            name: 'x-server-token',
            in: 'header',
          }
        }
      }
    })

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
