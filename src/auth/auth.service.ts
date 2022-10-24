import * as bcrypt from 'bcrypt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginInputDto } from './dto/login-input.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateCredentials(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new ForbiddenException(
                'user with this credentials not found',
            );
        }

        return user;
    }

    async login(login_input: LoginInputDto) {
        const { email, password } = login_input;

        const user = await this.validateCredentials(email, password);

        const payload = {
            user_id: user.id,
        };

        return {
            token: this.jwtService.sign(payload),
        };
    }
}
