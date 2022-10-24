import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    const path = '/cep';

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET) - should get city and state by correct cep informed', async () => {
        return request(app.getHttpServer())
            .get(`${path}/87340000`)
            .expect(200)
            .expect((response) => {
                expect(response.body).toEqual({
                    informed_code: '87340000',
                    code_found: '87340000',
                    address: null,
                    neighborhood: null,
                    city: { name: 'Mamborê' },
                    state: { name: 'Paraná' },
                });
            });
    });

    it('/ (GET) - should get full address by correct cep informed', async () => {
        return request(app.getHttpServer())
            .get(`${path}/04236183`)
            .expect(200)
            .expect((response) => {
                expect(response.body).toEqual({
                    informed_code: '04236183',
                    code_found: '04236183',
                    address: 'Via de Pedestre Abricó',
                    neighborhood: 'Cidade Nova Heliópolis',
                    city: { name: 'São Paulo' },
                    state: { name: 'São Paulo' },
                });
            });
    });

    it('/ (GET) - should get full address of different cep than informed', async () => {
        return request(app.getHttpServer())
            .get(`${path}/13566572`)
            .expect(200)
            .expect((response) => {
                expect(response.body).toEqual({
                    informed_code: '13566572',
                    code_found: '13566570',
                    address: 'Alameda das Crisandálias',
                    neighborhood: 'Cidade Jardim',
                    city: { name: 'São Carlos' },
                    state: { name: 'São Paulo' },
                });
            });
    });

    it('/ (GET) - should get a bad request error because informed cep is invalid', async () => {
        return request(app.getHttpServer())
            .get(`${path}/1234567`) // 7 digits
            .expect(400)
            .expect((response) => {
                expect(response.body.message).toContainEqual('CEP inválido');
            });
    });

    it('/ (GET) - should get a bad request error because informed cep is invalid', async () => {
        return request(app.getHttpServer())
            .get(`${path}/1234567a`) // 7 digits plus letter a
            .expect(400)
            .expect((response) => {
                expect(response.body.message).toContainEqual('CEP inválido');
            });
    });

    it('/ (GET) - should get a bad request error because informed cep is invalid', async () => {
        return request(app.getHttpServer())
            .get(`${path}/87.340-000`) // 8 digits with point and hyphen
            .expect(400)
            .expect((response) => {
                expect(response.body.message).toEqual([
                    'cep_code should not contain a . string',
                ]);
            });
    });

    it('/ (GET) - should get a bad request error because informed cep is invalid', async () => {
        return request(app.getHttpServer())
            .get(`${path}/87.340000`) // 8 digits with point
            .expect(400)
            .expect((response) => {
                expect(response.body.message).toEqual([
                    'cep_code should not contain a . string',
                ]);
            });
    });

    it('/ (GET) - should get a bad request error because informed cep is invalid', async () => {
        return request(app.getHttpServer())
            .get(`${path}/87340-000`) // 8 digits with hyphen
            .expect(400)
            .expect((response) => {
                expect(response.body.message).toEqual([
                    'cep_code should not contain a - string',
                ]);
            });
    });
});
