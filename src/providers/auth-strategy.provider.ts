import { Provider, inject, ValueOrPromise } from '@loopback/context';
import { Strategy } from 'passport';
import {
  AuthenticationBindings,
  AuthenticationMetadata,
  UserProfile,
} from '@loopback/authentication';
import { Strategy as LocalStrategy } from 'passport-local';
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
    if (name === 'LoginPasswordStrategy') {
      return new LocalStrategy(this.verifyLoginPassword);
    } if (name === 'TokenStrategy') {
      return new CustomStrategy(this.verifyToken.bind(this));
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }

  verifyToken(
    req: express.Request,
    cb: (err: Error | null, user?: User | false) => void,
  ) {
    console.log(req.header('x-auth-token'));
    const token = req.header('x-auth-token');
    if (!token) {
      cb(null, false);
      return
    }
    this.authTokenRepository.findById(token)
      .then(authToken => {
        console.log('authToken', authToken);
        if (!authToken) {
          cb(null, false);
        } else {
          return authToken.userId;
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

  }

  verifyLoginPassword(
    username: string,
    password: string,
    cb: (err: Error | null, user?: User | false) => void,
  ) {
    // find user by name & password
    // call cb(null, false) when user not found
    // call cb(null, user) when user is authenticated
    cb(null, false);
  }
}
