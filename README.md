# cep-application

> API to provide address information

## Tecnologias usadas

- NestJs
  - Framework escolhido por prover uma série de integrações entre diferentes serviços como Redis, Swagger com OpenAPI, Jest e SuperTest e, por apresentar a exposição de rotas com facilidade, coisa que poderia ser feita com qualquer framework.
- Postgres
  - Banco de dados escolhido para armazenar os dados. Estados, cidades e ceps.
- Prisma
  - "ORM" escolhido para interação entre o typescript/ nestjs e o banco de dados.
- Redis
  - Banco de dados em memória usado como serviço de cache para requisições.
- Swagger e OpenAPI
  - Usado para documentar as rotas expostas pela aplicação.
    - Acesso com a rota padrão `/api`
- PgAdmin
  - Utilizado para visualização e facilidade na interação com o banco de dados.
    - Para acesso utilizar a url [localhost:9000](http://localhost:9000)
      - Para login
        - usuário: admin@cep.com
        - senha: 123456
- Docker e docker-compose
  - Utilizado para "conteinerizar" a aplicação e fornecer outras ferramentas necessárias que podem ser trabalhosas de instalar e manusear versões.
  
## Sobre o dataset encontrado

- Utilizei os dados fornecidos pelo [cep aberto](https://www.cepaberto.com/), no qual foi necessário fazer um cadastro para então realizar o download de arquivos CSV referentes aos registros de estados, cidades e ceps.

- Os arquivos baixados possuíam a seguinte estrutura:
    - Estados (arquivo único)
      - id
      - nome
      - sigla
    - Cidades (arquivo único)
      - id
      - nome
      - id do estado
    - Ceps (5 arquivos para cada estado brasileiro) 
      - cep
      - logradouro
      - bairro
      - id da cidade
      - id do estado
- Foi necessário realizar um "parse" dos dados dos ceps
  - Eles possuíam, em alguns registros, na coluna de logradouro, o caractece , (vírgula), sem estar entre aspas duplas, o que fazia determinadas linhas terem uma coluna a mais e não permitia a importação do arquivo csv pelo postgres, via sql utilizando `COPY FROM`. Para tornar possível, criei um script em python para remover a coluna de "complemento" (número) formada pela vírgula que não aparecia em todos os registros. O python identificava corretamente as colunas.
- Os dados podem (e são necessários para preencher o banco) ser baixados executando o shell script `download-files-and-parse` ou `download-parsed`, encontrado no diretório dataset.
  - Para ambos os scripts é necessário ter `curl` instalado.
  - Para utilizar o `download-files-and-parse` é necessário ter python3 instalado e disponível via linha de comando.
  - Para utilizar o `download-parsed` é necessário ter o programa `unzip` instalado.
- Subi, em formato zip no dropbox para permitir o download por fora do cepaberto.

## Para rodar a aplicação
```bash
# Clonar o repositório
git clone https://github.com/joaokorcz/cep-application

# Entrar no diretório criado
cd cep-application

# Criar um arquivo de variáveis de ambiente
# Copiar a prórpria .env.example já promete funcionar
cp .env.example .env

# Entrar no dirétorio dataset
cd dataset

# Executar shell script para download dos dados
./download-files-and-parse
# Ou
./download-parsed

# Inicializar o docker-compose que será responsável por
# A instância da aplicacação disponível na PORT da .env
# A instância do postgres para servir o banco de dados
# A instância do regis para servir o cache
# A instância do pgadmin para visualização dos dados
docker-compose up # em um segundo terminal ou
docker-compose up -d

# Rodar as migrações das tabelas do banco de dados
docker-compose run --rm cep-application yarn prisma migrate deploy

# Para preencher as tabelas de estados, cidades e ceps
docker-compose run --rm cep-application yarn db:fill_ceps
```

## Sobre a consulta no banco de dados