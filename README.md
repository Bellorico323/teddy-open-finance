## ⚙ Tecnologias

- [Node](https://nodejs.org/en/)
- [Nestjs](https://nestjs.com)
- [Docker](https://www.docker.com/)
- [Prisma](https://www.prisma.io)

[![Tecnologies](https://skillicons.dev/icons?i=nodejs,nestjs,docker,prisma)](https://skillicons.dev)

## 🚀 Como executar

1. Clone o projeto e acesse a pasta do mesmo.

```bash 
$ git clone https://github.com/Bellorico323/teddy-open-finance.git
$ cd teddy-open-finance
```

2. Configure as variáveis de ambiente criando um arquivo `.env` e ajustando-o conforme o modelo fornecido em `.env.example`. Também forneci um script para geração automática das variáveis de ambiente. Para utilizá-lo, execute o seguinte comando:
   
```bash
$ bash ./scripts/setup.sh
```
3. Para iniciar o ambiente com Docker, execute o comando abaixo:

```bash
# subir a aplicação com o docker
$ docker-compose up -d
```

O servidor será iniciado na porta http://localhost:3000.

Para acessar a documentação da API, basta navegar até http://localhost:3000/api.

---

### Ambiente de produção
