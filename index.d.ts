declare module 'passport-custom' {
    import { Strategy as PassportStrategy } from "passport-strategy";
    interface IVerifyOptions {
        message: string;
    }
    
    interface VerifyFunction {
        (
            data: any,
            done: (error: any, data?: any, options?: IVerifyOptions) => void
        ): void;
    }

    export class Strategy extends PassportStrategy {
        constructor(verify: VerifyFunction);
        name: string;
    }
}