import { Provider, ValueOrPromise } from '@loopback/context';
import { Strategy } from 'passport';
import { AuthenticationMetadata, UserProfile } from '@loopback/authentication';
export declare class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
    private metadata;
    constructor(metadata: AuthenticationMetadata);
    value(): ValueOrPromise<Strategy | undefined>;
    verify(username: string, password: string, cb: (err: Error | null, user?: UserProfile | false) => void): void;
}
