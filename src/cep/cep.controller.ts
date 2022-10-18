import {
    Controller,
    Get,
    Param,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { CepService } from './cep.service';
import { FindByCepInputDto } from './dto/find-by-cep-input.dto';
import { FindByCepOutputDto } from './dto/find-by-cep-output.dto';

@ApiTags('CEP')
@Controller('cep')
export class CepController {
    constructor(private readonly cepService: CepService) {}

    @Get(':cep_code')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ description: 'Get address from cep_code' })
    @ApiOkResponse({ description: 'Address found', type: FindByCepOutputDto })
    @ApiBadRequestResponse({ description: 'Informed cep_code not valid' })
    findByCepCode(
        @Param() params: FindByCepInputDto,
    ): Promise<FindByCepOutputDto> {
        return this.cepService.findByCepCode(params.cep_code);
    }
}
