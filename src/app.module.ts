import { CacheModule, Module } from '@nestjs/common';
import { CepModule } from './cep/cep.module';

@Module({
    imports: [
        CacheModule.register({
            ttl: 10,
        }),
        CepModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
