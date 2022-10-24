import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginInputDto } from './dto/login-input.dto';
import { LoginOutputDto } from './dto/login-output.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    @ApiOperation({ description: 'Login to get a access token' })
    @ApiOkResponse({
        description: 'Logged succesfully',
        type: LoginOutputDto,
    })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    @ApiForbiddenResponse({
        description: 'User with informed credentials not found',
    })
    async login(
        @Body() login_input_dto: LoginInputDto,
    ): Promise<LoginOutputDto> {
        return this.authService.login(login_input_dto);
    }
}
