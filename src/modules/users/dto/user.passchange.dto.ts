import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Match } from "src/decorators/match.decorator";

export class ChangePasswordDto {

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @MinLength(6, { message: "Минимальная длина пароля 6 символов"})
    @MaxLength(20, { message: "Максимальная длина пароля 20 символов"})
    readonly new_password: string;

    @Match('new_password', {message: 'Веденные пароли не совпадают'})
    @IsNotEmpty({message: "Подвердите веденный пароль"})
    readonly passwordConfirm: string;

}