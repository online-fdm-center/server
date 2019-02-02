import { Entity } from '@loopback/repository';
import { Product } from './product.model';
export declare class User extends Entity {
    id?: number;
    name?: string;
    mail?: string;
    password?: string;
    address?: string;
    balance?: number;
    isTemporary: boolean;
    products?: Product[];
    constructor(data?: Partial<User>);
}
