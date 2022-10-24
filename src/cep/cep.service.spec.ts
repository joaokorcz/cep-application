import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { CepService } from './cep.service';

describe('CepService', () => {
    let service: CepService;

    const mockPrismaService = {
        cep: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CepService, PrismaService],
        })
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .compile();

        service = module.get<CepService>(CepService);
    });

    it('should be definedd', () => {
        expect(service).toBeDefined();
    });

    beforeEach(() => {
        mockPrismaService.cep.findMany = jest.fn().mockReturnValue([{}]);
        mockPrismaService.cep.findUnique = jest.fn().mockReturnValue({});
    });

    it('should return an address with same cep informed', async () => {
        mockPrismaService.cep.findMany = jest
            .fn()
            .mockReturnValue([{ code: '87340000' }]);
        mockPrismaService.cep.findUnique = jest.fn().mockReturnValue({
            code: '87340000',
            address: 'Avenida Manoel Francisco da Silva',
            neighborhood: null,
            city: { name: 'Mamborê' },
            state: { name: 'Paraná' },
        });

        expect(await service.findByCepCode('87340000')).toEqual({
            informed_code: '87340000',
            code_found: '87340000',
            address: expect.any(String),
            neighborhood: null,
            city: expect.objectContaining({ name: expect.any(String) }),
            state: expect.objectContaining({ name: expect.any(String) }),
        });
        expect(mockPrismaService.cep.findMany).toBeCalledTimes(1);
        expect(mockPrismaService.cep.findUnique).toBeCalledTimes(1);
    });

    it('should return an address with different cep', async () => {
        mockPrismaService.cep.findMany = jest
            .fn()
            .mockReturnValue([
                { code: '13566570' },
                { code: '13566500' },
                { code: '13566000' },
            ]);
        mockPrismaService.cep.findUnique = jest.fn().mockReturnValue({
            code: '13566570',
            address: 'Alameda das Crisandálias',
            neighborhood: 'Cidade Jardim',
            city: { name: 'São Carlos' },
            state: { name: 'São Paulo' },
        });

        expect(await service.findByCepCode('13566572')).toEqual({
            informed_code: '13566572',
            code_found: '13566570',
            address: expect.any(String),
            neighborhood: expect.any(String),
            city: expect.objectContaining({ name: expect.any(String) }),
            state: expect.objectContaining({ name: expect.any(String) }),
        });
        expect(mockPrismaService.cep.findMany).toBeCalledTimes(1);
        expect(mockPrismaService.cep.findUnique).toBeCalledTimes(1);
    });

    it('should return a not found exception with message', async () => {
        expect(
            await service.findByCepCode('13500000').catch((error) => {
                expect(mockPrismaService.cep.findMany).toBeCalledTimes(1);
                expect(mockPrismaService.cep.findUnique).toBeCalledTimes(0);
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.response).toEqual({
                    message: 'cep not found on database',
                });
            }),
        );
    });

    it('should return a not found exception with message', async () => {
        // the function should run normally since the parse and validation
        // are done in other layers
        expect(
            await service.findByCepCode('1a3b5c6d0e0f0g0h').catch((error) => {
                expect(mockPrismaService.cep.findMany).toBeCalledTimes(1);
                expect(mockPrismaService.cep.findUnique).toBeCalledTimes(0);
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.response).toEqual({
                    message: 'cep not found on database',
                });
            }),
        );
    });
});
