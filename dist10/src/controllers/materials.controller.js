"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let MaterialsController = class MaterialsController {
    constructor(materialsRepository) {
        this.materialsRepository = materialsRepository;
    }
    async create(materials) {
        return await this.materialsRepository.create(materials);
    }
    async count(where) {
        return await this.materialsRepository.count(where);
    }
    async find(filter) {
        return await this.materialsRepository.find(filter);
    }
    async updateAll(materials, where) {
        return await this.materialsRepository.updateAll(materials, where);
    }
    async findById(id) {
        return await this.materialsRepository.findById(id);
    }
    async updateById(id, materials) {
        await this.materialsRepository.updateById(id, materials);
    }
    async replaceById(id, materials) {
        await this.materialsRepository.replaceById(id, materials);
    }
    async deleteById(id) {
        await this.materialsRepository.deleteById(id);
    }
};
__decorate([
    rest_1.post('/materials', {
        responses: {
            '200': {
                description: 'Materials model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Materials } } },
            },
        },
    }),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.Materials]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "create", null);
__decorate([
    rest_1.get('/materials/count', {
        responses: {
            '200': {
                description: 'Materials model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Materials))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "count", null);
__decorate([
    rest_1.get('/materials', {
        responses: {
            '200': {
                description: 'Array of Materials model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: { 'x-ts-type': models_1.Materials } },
                    },
                },
            },
        },
    }),
    __param(0, rest_1.param.query.object('filter', rest_1.getFilterSchemaFor(models_1.Materials))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "find", null);
__decorate([
    rest_1.patch('/materials', {
        responses: {
            '200': {
                description: 'Materials PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    __param(0, rest_1.requestBody()),
    __param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Materials))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.Materials, Object]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "updateAll", null);
__decorate([
    rest_1.get('/materials/{id}', {
        responses: {
            '200': {
                description: 'Materials model instance',
                content: { 'application/json': { schema: { 'x-ts-type': models_1.Materials } } },
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "findById", null);
__decorate([
    rest_1.patch('/materials/{id}', {
        responses: {
            '204': {
                description: 'Materials PATCH success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __param(1, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, models_1.Materials]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "updateById", null);
__decorate([
    rest_1.put('/materials/{id}', {
        responses: {
            '204': {
                description: 'Materials PUT success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __param(1, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, models_1.Materials]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "replaceById", null);
__decorate([
    rest_1.del('/materials/{id}', {
        responses: {
            '204': {
                description: 'Materials DELETE success',
            },
        },
    }),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "deleteById", null);
MaterialsController = __decorate([
    __param(0, repository_1.repository(repositories_1.MaterialsRepository)),
    __metadata("design:paramtypes", [repositories_1.MaterialsRepository])
], MaterialsController);
exports.MaterialsController = MaterialsController;
//# sourceMappingURL=materials.controller.js.map