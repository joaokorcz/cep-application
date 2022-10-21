import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    await prisma.$executeRaw`COPY states FROM '/dataset/states/states.csv' DELIMITER ',' CSV;`;
    await prisma.$executeRaw`COPY cities FROM '/dataset/cities/cities.csv' DELIMITER ',' CSV;`;
    await prisma.$executeRaw`COPY ceps FROM '/dataset/ceps/all_ceps.csv' DELIMITER ',' CSV;`;
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
