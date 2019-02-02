import { Entity } from '@loopback/repository';
export declare class Product extends Entity {
    id?: number;
    name: string;
    description?: string;
    userId?: number;
    fileId?: number;
    materialId?: number;
    count: number;
    status?: string;
    constructor(data?: Partial<Product>);
}
