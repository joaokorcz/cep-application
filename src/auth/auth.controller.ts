import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInputDto } from './dto/login-input.dto';
import { LoginOutputDto } from './dto/login-output.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async login(
        @Body() login_input_dto: LoginInputDto,
    ): Promise<LoginOutputDto> {
        return this.authService.login(login_input_dto);
    }
}
