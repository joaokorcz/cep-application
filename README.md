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
  - Eles possuíam, em alguns registros, na mesma coluna de logradouro, o caractece , (vírgula), sem estar entre aspas duplas, o que fazia determinadas linhas terem uma coluna a mais e não permitia a importação do arquivo csv pelo postgres, via sql utilizando `COPY FROM`. Para tornar possível, criei um script em python para remover a coluna de "complemento" (número) mal colocada formada pela vírgula "extra" que não aparecia em todos os registros. O python identificava corretamente as colunas.
- Os dados podem (e são necessários para preencher o banco) ser baixados executando o shell script `download-files-and-parse` ou `download-parsed`, encontrado no diretório dataset.
  - Para ambos os scripts é necessário ter `curl` instalado.
  - Para utilizar o `download-files-and-parse` é necessário ter python3 instalado e disponível via linha de comando.
  - Para utilizar o `download-parsed` é necessário ter o programa `unzip` instalado.
- Subi, em formato zip no dropbox para permitir o download por fora do cepaberto.
- Após o parse, o padrão foi
  - de 
    - ![image](https://user-images.githubusercontent.com/37910255/197310430-fb81a38f-22a8-460a-8e48-a0cc9a3b2bae.png)
  - para
    - ![image](https://user-images.githubusercontent.com/37910255/197310514-cb59fdb6-02ea-4e21-bb17-9003625521ea.png)

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

# Voltar para a raiz
cd ..

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
- Para otimizar a busca dos endereços e não ter que fazer uma consulta para cada possibilidade de cep quando o cep informado não for encontrado, isto é, fazer uma consulta com 13566572, ver que não existe, fazer outra consulta com 13566570 e então ver que existe, pensei em algumas abordagens já que do outro modo podem ser necessárias muitas consultas que, em uma grande quantidade de requisições podem estressar muito o banco.
  - Utilizei o operador `IN` na consulta do banco para buscar os ceps, já com todos os ceps possíveis dado um cep informado, isto é, ao informar 13566572, buscara ceps onde o cep for 13566572, 13566570, 13566500, 13566000, 13560000, 13500000, 13000000, 10000000, 00000000.
    - Sei que não existem alguns desses ceps, mas como no pdf do desafio dizia para continuar até achar, fiquei em dúvida entre ir só até 13566000 ou até o final, por fim não há alteração no desempenho então deixei assim mesmo.
    - Para o compor as possibilidades elaborei a seguinte função:
      - ![image](https://user-images.githubusercontent.com/37910255/197310888-d143790f-bb0e-4e8c-959b-087eb0dbaba4.png)
    - Usando o `IN` me surgiu outro incômodo quanto à performance, fazer os `JOIN`s nessa primeira consulta, que poderia resultar em vários `JOIN`s (um pra cada cep que estiver contido no `IN`) ou buscar apenas encontrar o primeiro cep mais próximo do informado e então buscar em outra query todos os dados para retorno.
      - Para questionar cada performance utilizei o `EXPLAIN` do sql para tentar algumas métricas que auxiliem na visualização.
        - Para o `JOIN` com o `IN` obtive o seguinte
          - ![image](https://user-images.githubusercontent.com/37910255/197311130-d718db4d-5c8e-4ad2-844a-c2581da2d8c9.png)
          - ![image](https://user-images.githubusercontent.com/37910255/197311137-a52e2529-1cfa-47c9-a7ac-be9add54f605.png)
        - Para duas consultas, uma buscando o cep e outra fazendo o `JOIN` obtive o seguinte
          - ![image](https://user-images.githubusercontent.com/37910255/197311176-f518f58a-5e66-4d29-8f21-3f7841cf857d.png)
          - ![image](https://user-images.githubusercontent.com/37910255/197311190-8123d064-c3bc-4c74-a898-48a7e915d989.png)
        - Achei o segundo método extremamente menos custoso e optei por esta abordagem




