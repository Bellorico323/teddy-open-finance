## ⚙ Tecnologias

- [Node](https://nodejs.org/en/)
- [Nestjs](https://nestjs.com)
- [Docker](https://www.docker.com/)
- [Prisma](https://www.prisma.io)

[![Tecnologies](https://skillicons.dev/icons?i=nodejs,nestjs,docker,prisma)](https://skillicons.dev)

## 🚀 Como executar

Clone o projeto e acesse a pasta do mesmo.

```bash 
$ git clone https://github.com/Bellorico323/teddy-open-finance.git
$ cd teddy-open-finance
```

### Passos para executar:

1. Configure as variáveis de ambiente, criando um arquivo .env e ajustando-o com base no modelo fornecido no arquivo .env.example. Também foi fornecido um script para geração automática das variáveis ambientes, para utiliza-lo basta executar o seguinte comando:
   
   ```bash
   $ bash ./scripts/setup.sh
   ```
3. Execute o comando abaixo para iniciar o ambiente com Docker:

```bash
# subir a aplicação com o docker
$ docker-compose up -d
```

O servidor será iniciado na porta http://localhost:3000.

Para acessar a documentação da API, basta navegar até http://localhost:3000/api.

---

### Ambiente de produção
