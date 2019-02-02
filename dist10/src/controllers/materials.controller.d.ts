import { Count, Filter, Where } from '@loopback/repository';
import { Materials } from '../models';
import { MaterialsRepository } from '../repositories';
export declare class MaterialsController {
    materialsRepository: MaterialsRepository;
    constructor(materialsRepository: MaterialsRepository);
    create(materials: Materials): Promise<Materials>;
    count(where?: Where): Promise<Count>;
    find(filter?: Filter): Promise<Materials[]>;
    updateAll(materials: Materials, where?: Where): Promise<Count>;
    findById(id: number): Promise<Materials>;
    updateById(id: number, materials: Materials): Promise<void>;
    replaceById(id: number, materials: Materials): Promise<void>;
    deleteById(id: number): Promise<void>;
}
