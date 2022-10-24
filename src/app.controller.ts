import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('HealthCheck')
@Controller()
export class AppController {
    @Get()
    @ApiOkResponse({ description: 'Check if API is ON' })
    async healthCheck(): Promise<any> {
        return { message: 'hello world from cep-application :)' };
    }
}
