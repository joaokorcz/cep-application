import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindByCepOutputDto } from './dto/find-by-cep-output.dto';

@Injectable()
export class CepService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly prismaService: PrismaService,
    ) {}

    async findByCepCode(cep_code: string): Promise<FindByCepOutputDto> {
        const possible_ceps = [
            cep_code,
            ...this.replaceNonZeroWithZero(cep_code),
        ];

        const found_ceps = await this.prismaService.cep.findMany({
            where: {
                code: {
                    in: possible_ceps,
                },
            },
            select: {
                code: true,
            },
        });

        for (const cep of possible_ceps) {
            const found = found_ceps.find(
                (cep_found) => cep_found.code === cep,
            );
            if (found) {
                const address = await this.prismaService.cep.findUnique({
                    where: {
                        code: found.code,
                    },
                    select: {
                        code: true,
                        address: true,
                        neighborhood: true,
                        city: { select: { name: true } },
                        state: { select: { name: true } },
                    },
                });
                return address;
            }
        }

        throw new NotFoundException({
            message: 'cep not found on database',
        });
    }

    replaceNonZeroWithZero(cep_code: string): string[] {
        const non_zero_digits: string[] = cep_code.match(/[1-9]/gi) || [];
        non_zero_digits.reverse();

        const variations = non_zero_digits.map((digit) => {
            const index = cep_code.lastIndexOf(digit);
            cep_code =
                cep_code.substring(0, index) +
                '0' +
                cep_code.substring(index + 1);
            return cep_code;
        });

        return variations;
    }
}
