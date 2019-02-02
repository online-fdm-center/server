declare module 'passport-custom' {
  import { Strategy as PassportStrategy } from "passport-strategy";
  import express = require("express");
  interface IVerifyOptions {
    message: string;
  }

  interface VerifyFunction {
    (
      data: express.Request,
      done: (error: any, data?: any, options?: IVerifyOptions) => void
    ): void;
  }

  export class Strategy extends PassportStrategy {
    constructor(verify: VerifyFunction);
    name: string;
  }
}
