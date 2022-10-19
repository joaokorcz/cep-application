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

        const found_on_cache = await this.searchFirstAddressOnCacheByCepArray(
            possible_ceps,
        );
        if (found_on_cache) return found_on_cache;

        const ceps_found = await this.prismaService.cep.findMany({
            where: {
                code: {
                    in: possible_ceps,
                },
            },
            select: {
                code: true,
                address: true,
                neighborhood: true,
                city: { select: { name: true } },
                state: { select: { name: true } },
            },
        });

        for await (const cep_found of ceps_found) {
            await this.cacheManager.set(cep_found.code, cep_found);
        }

        for (const cep of possible_ceps) {
            const found = ceps_found.find(
                (cep_found) => cep_found.code === cep,
            );
            if (found) return found;
        }

        throw new NotFoundException({
            message: 'cep not found on database',
        });
    }

    async searchFirstAddressOnCacheByCepArray(
        keys: string[],
    ): Promise<FindByCepOutputDto> {
        for await (const key of keys) {
            const value: FindByCepOutputDto = await this.cacheManager.get(key);

            if (value) return value;
        }
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
