import { ApiProperty } from '@nestjs/swagger';

export class LoginOutputDto {
    @ApiProperty()
    token: string;
}
