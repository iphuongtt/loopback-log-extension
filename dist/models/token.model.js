"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Token = class Token extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        id: true,
        generated: false,
        required: false,
    }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: false,
    }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "username", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: false,
    }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "token", void 0);
Token = tslib_1.__decorate([
    repository_1.model({}),
    tslib_1.__metadata("design:paramtypes", [Object])
], Token);
exports.Token = Token;
//# sourceMappingURL=token.model.js.map