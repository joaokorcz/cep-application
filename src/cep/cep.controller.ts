import {
    Controller,
    Get,
    Param,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CepService } from './cep.service';

@Controller('cep')
export class CepController {
    constructor(private readonly cepService: CepService) {}

    @Get(':cep_code')
    @UsePipes(new ValidationPipe())
    findByCepCode(@Param() params) {
        return this.cepService.findByCepCode(params.cep_code);
    }
}
