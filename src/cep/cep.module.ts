import { Module } from '@nestjs/common';
import { CepService } from './cep.service';
import { CepController } from './cep.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [CepController],
    providers: [CepService, PrismaService],
})
export class CepModule {}
