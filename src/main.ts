import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    const config = new DocumentBuilder()
        .setTitle('CEP-Application')
        .setDescription('Endpoints documentation of cep-applications')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'CEP-Application docs',
        swaggerOptions: {
            defaultModelsExpandDepth: -1,
            displayRequestDuration: true,
        },
    });

    await app.listen(configService.get('PORT'));
}
bootstrap();
