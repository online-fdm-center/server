import { Provider, inject, ValueOrPromise } from '@loopback/context';
import { Strategy } from 'passport';
import {
  AuthenticationBindings,
  AuthenticationMetadata,
} from '@loopback/authentication';
import { Strategy as CustomStrategy } from 'passport-custom';
import { repository } from '@loopback/repository';
import { UserRepository, AuthTokenRepository } from '../repositories';
import express = require("express");
import { User } from '../models/user.model'

export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
    @repository('UserRepository')
    public userRepository: UserRepository,
    @repository('AuthTokenRepository')
    public authTokenRepository: AuthTokenRepository,
  ) { }

  value(): ValueOrPromise<Strategy | undefined> {
    // The function was not decorated, so we shouldn't attempt authentication
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    if (name === 'TokenStrategy') {
      return new CustomStrategy(this.verifyToken.bind(this));
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }

  verifyToken(
    req: express.Request,
    cb: (err: Error | null, user?: User | boolean) => void,
  ) {
    const usertoken = req.header('x-auth-token');
    const servertoken = req.header('x-server-token');
    const admintoken = req.header('x-admin-token');
    if (!usertoken && !servertoken && !admintoken) {
      cb(null, false);
      return
    }
    if (usertoken) {
      this.authTokenRepository.findById(usertoken)
        .then(authToken => {
          if (!authToken) {
            return Promise.reject(null)
          } else {
            return Promise.resolve(authToken.userId)
          }
        })
        .then((userId: number) => this.userRepository.findById(userId))
        .then((user) => {
          if (!user) {
            cb(null, false);
          } else {
            cb(null, user);
          }
        })
        .catch(cb)
    } else if (servertoken) {
      if (servertoken === process.env.SERVER_AUTH_TOKEN) {
        cb(null, new User({ id: 0, group: User.groups.SERVER }));
      } else {
        cb(null, false);
      }

    } else if (admintoken) {
      if (admintoken === process.env.ADMIN_AUTH_TOKEN) {
        cb(null, new User({ id: 0, group: User.groups.ADMIN }));
      } else {
        cb(null, false);
      }
    }
  }
}
