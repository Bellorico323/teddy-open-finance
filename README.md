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

2. Configure as variáveis de ambiente criando um arquivo `.env` e ajustando-o conforme o modelo fornecido em `.env.example`. Também forneci um script para geração automática das variáveis de ambiente.

    Esse script gera automaticamente o arquivo `.env` com valores padrão e pode ser editado conforme necessário.

    Para utilizá-lo, execute o seguinte comando:
   
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

###  🌍 Ambiente de produção
A aplicação está hospedada em uma instância AWS EC2 e pode ser acessada no seguinte endereço:
http://3.147.195.7:3000

Observações:

- Para fins de teste, algumas restrições de segurança (como limitação de IPs) foram temporariamente flexibilizadas.

#### 🔧 Pontos de Melhoria e Escalabilidade
- Configurar um domínio personalizado via AWS Route 53.
- Implementar ALB (Application Load Balancer), ACM (AWS Certificate Manager), CloudFront, Auto Scaling e RDS para melhorar a disponibilidade, segurança e escalabilidade do sistema.
  
