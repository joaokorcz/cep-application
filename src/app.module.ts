import { CacheModule, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { CepModule } from './cep/cep.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            store: async () =>
                await redisStore({
                    socket: {
                        host: process.env.REDIS_HOST,
                        port: +process.env.REDIS_PORT,
                    },
                    ttl: 30,
                }),
            isGlobal: true,
            max: 1000,
        }),
        PrismaModule.forRoot({ isGlobal: true }),
        CepModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
