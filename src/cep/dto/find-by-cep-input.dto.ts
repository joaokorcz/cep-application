import { ApiProperty } from '@nestjs/swagger';
import { IsCEP } from 'brazilian-class-validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindByCepInputDto {
    @IsString()
    @IsNotEmpty()
    @IsCEP({ message: 'CEP inválido' })
    @ApiProperty({
        description: 'CEP Code that you want address',
    })
    cep_code: string;
}
