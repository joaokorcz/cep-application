import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CepService {
    constructor(private readonly prismaService: PrismaService) {}

    async findByCepCode(cep_code: string) {
        const cep_found = await this.prismaService.cep.findUnique({
            where: {
                code: cep_code,
            },
            select: {
                address: true,
                neighborhood: true,
                city: {
                    select: {
                        name: true,
                    },
                },
                state: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return cep_found;
    }
}
