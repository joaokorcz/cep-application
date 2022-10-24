import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserInputDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}
