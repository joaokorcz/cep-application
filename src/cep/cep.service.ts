import { Injectable, NotFoundException } from '@nestjs/common';
import { FindByCepOutputDto } from './dto/find-by-cep-output.dto';
import { PrismaService } from 'nestjs-prisma';
import { FindByCepInputDto } from './dto/find-by-cep-input.dto';

@Injectable()
export class CepService {
    constructor(private readonly prismaService: PrismaService) {}

    async findByCepCode(
        find_by_cep_input: FindByCepInputDto,
    ): Promise<FindByCepOutputDto> {
        const { cep_code } = find_by_cep_input;
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
                const { code, ...parsed_address } = address;
                return {
                    informed_code: cep_code,
                    code_found: code,
                    ...parsed_address,
                };
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
