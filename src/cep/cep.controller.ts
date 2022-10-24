import {
    CacheInterceptor,
    Controller,
    Get,
    Param,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
        return this.cepService.findByCepCode(params.cep_code);
    }

    @Get('/protected/:cep_code')
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(new ValidationPipe())
    @ApiBearerAuth()
    @ApiOperation({ description: 'Get address from cep_code' })
    @ApiOkResponse({ description: 'Address found', type: FindByCepOutputDto })
    @ApiBadRequestResponse({ description: 'Informed cep_code not valid' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized, token invalid' })
    async protectedFindByCepCode(
        @Param() params: FindByCepInputDto,
    ): Promise<FindByCepOutputDto> {
        return this.cepService.findByCepCode(params.cep_code);
    }
}
