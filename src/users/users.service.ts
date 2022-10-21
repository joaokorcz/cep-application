import * as bcrypt from 'bcrypt';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserInputDto } from './dto/create-user-input.dto';
import { CreateUserOutputDto } from './dto/create-user-output.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async findByEmail(email: string) {
        return this.prismaService.user.findFirst({
            where: {
                email: email,
                deleted_at: null,
            },
        });
    }

    async create(
        create_user_input: CreateUserInputDto,
    ): Promise<CreateUserOutputDto> {
        const user_exists = await this.findByEmail(create_user_input.email);

        if (user_exists) {
            throw new UnprocessableEntityException({
                message: 'an user with this email is already registered',
            });
        }

        const salt = bcrypt.genSaltSync(10);

        const created_user = await this.prismaService.user.create({
            data: {
                ...create_user_input,
                password: bcrypt.hashSync(create_user_input.password, salt),
            },
            select: {
                id: true,
                email: true,
                created_at: true,
                updated_at: true,
                deleted_at: true,
            },
        });

        return created_user;
    }
}
