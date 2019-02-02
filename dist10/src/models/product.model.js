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
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
const index_1 = require("./index");
let Product = class Product extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    repository_1.property({
        type: 'number',
        id: true,
        generated: true,
    }),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    repository_1.property({
        type: 'string',
    }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    repository_1.belongsTo(() => index_1.User),
    __metadata("design:type", Number)
], Product.prototype, "userId", void 0);
__decorate([
    repository_1.belongsTo(() => index_1.File),
    __metadata("design:type", Number)
], Product.prototype, "fileId", void 0);
__decorate([
    repository_1.belongsTo(() => index_1.Materials),
    __metadata("design:type", Number)
], Product.prototype, "materialId", void 0);
__decorate([
    repository_1.property({
        type: 'number',
        required: true,
        default: 1,
    }),
    __metadata("design:type", Number)
], Product.prototype, "count", void 0);
__decorate([
    repository_1.property({
        type: 'string',
    }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
Product = __decorate([
    repository_1.model({
        settings: {
            foreignKeys: {
                userId: {
                    name: 'FK_Product_User',
                    foreignKey: 'userId',
                    entityKey: 'id',
                    entity: 'User'
                },
                materialId: {
                    name: 'FK_Product_Material',
                    foreignKey: 'materialId',
                    entityKey: 'id',
                    entity: 'Materials'
                },
                fileId: {
                    name: 'FK_Product_File',
                    foreignKey: 'fileId',
                    entityKey: 'id',
                    entity: 'File'
                }
            }
        }
    }),
    __metadata("design:paramtypes", [Object])
], Product);
exports.Product = Product;
//# sourceMappingURL=product.model.js.map