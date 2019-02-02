import { Entity } from '@loopback/repository';
import { Product } from './product.model';
export declare class Materials extends Entity {
    id?: number;
    type: string;
    color?: string;
    count?: number;
    products?: Product[];
    constructor(data?: Partial<Materials>);
}
