import { IsCEP } from 'brazilian-class-validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindByCepDto {
    @IsString()
    @IsNotEmpty()
    @IsCEP({ message: 'CEP inválido' })
    cep_code: string;
}
