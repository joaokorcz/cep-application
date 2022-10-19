import {
    CacheInterceptor,
    Controller,
    Get,
    Param,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CepService } from './cep.service';
import { FindByCepInputDto } from './dto/find-by-cep-input.dto';
import { FindByCepOutputDto } from './dto/find-by-cep-output.dto';

@ApiTags('CEP')
@Controller('cep')
@UseInterceptors(CacheInterceptor)
export class CepController {
    constructor(private readonly cepService: CepService) {}

    @Get(':cep_code')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ description: 'Get address from cep_code' })
    @ApiOkResponse({ description: 'Address found', type: FindByCepOutputDto })
    @ApiBadRequestResponse({ description: 'Informed cep_code not valid' })
    async findByCepCode(
        @Param() params: FindByCepInputDto,
    ): Promise<FindByCepOutputDto> {
        console.log('Controller');

        return this.cepService.findByCepCode(params.cep_code);
    }
}
