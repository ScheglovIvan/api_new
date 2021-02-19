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
exports.ChangePasswordDto = void 0;
const class_validator_1 = require("class-validator");
const match_decorator_1 = require("../../../decorators/match.decorator");
class ChangePasswordDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "password", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.MinLength(6, { message: "Минимальная длина пароля 6 символов" }),
    class_validator_1.MaxLength(20, { message: "Максимальная длина пароля 20 символов" }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "new_password", void 0);
__decorate([
    match_decorator_1.Match('new_password', { message: 'Веденные пароли не совпадают' }),
    class_validator_1.IsNotEmpty({ message: "Подвердите веденный пароль" }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "passwordConfirm", void 0);
exports.ChangePasswordDto = ChangePasswordDto;
//# sourceMappingURL=user.passchange.dto.js.map