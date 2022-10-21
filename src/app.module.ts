import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { CepModule } from './cep/cep.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule.forRoot({ isGlobal: true }),
        CepModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
