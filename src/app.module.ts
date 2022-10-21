import { CacheModule, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { CepModule } from './cep/cep.module';

@Module({
    imports: [
        CacheModule.register({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            store: async () =>
                await redisStore({
                    socket: {
                        host: 'localhost',
                        port: 6379,
                    },
                    ttl: 30,
                }),
            isGlobal: true,
            max: 1000,
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule.forRoot({ isGlobal: true }),
        CepModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
