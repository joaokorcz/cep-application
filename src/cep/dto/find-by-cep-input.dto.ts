import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsCEP } from '../../validators/IsCEP';

export class FindByCepInputDto {
    @IsNotEmpty()
    @IsCEP({ message: 'CEP informado é inválido' })
    @ApiProperty({
        description: 'CEP Code that you want address',
    })
    cep_code: string;
}
