import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from 'src/users/users.service';
import { LoginInputDto } from './dto/login-input.dto';
import { JwtStrategyService } from './jwt-strategy/jwt-strategy.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtStrategyService,
    ) {}
}
