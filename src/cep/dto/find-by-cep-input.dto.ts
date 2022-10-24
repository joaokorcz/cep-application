import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, NotContains } from 'class-validator';
import { IsCEP } from '../../validators/IsCEP';

export class FindByCepInputDto {
    @IsNotEmpty()
    @NotContains('.')
    @NotContains('-')
    @IsCEP({ message: 'CEP inválido' })
    @ApiProperty({
        description: 'CEP Code that you want address',
    })
    cep_code: string;
}
