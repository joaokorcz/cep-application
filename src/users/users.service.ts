import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserInputDto } from './dto/create-user-input.dto';
import { CreateUserOutputDto } from './dto/create-user-output.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async getByEmail(email: string) {
        return this.prismaService.user.findFirst({
            where: {
                email: email,
                deleted_at: null,
            },
        });
    }

    async create(
        createUserInput: CreateUserInputDto,
    ): Promise<CreateUserOutputDto> {
        const user_exists = await this.getByEmail(createUserInput.email);

        if (user_exists) {
            throw new UnprocessableEntityException({
                message: 'an user with this email is already registered',
            });
        }

        const created_user = await this.prismaService.user.create({
            data: createUserInput,
        });

        return created_user;
    }
}
