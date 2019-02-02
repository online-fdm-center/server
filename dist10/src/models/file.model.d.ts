import { Entity } from '@loopback/repository';
import { Product } from './product.model';
export declare class File extends Entity {
    id?: number;
    mimetype?: string;
    originalName?: string;
    size?: number;
    destination: string;
    filename: string;
    status?: string;
    amount?: number;
    products?: Product[];
    constructor(data?: Partial<File>);
}
