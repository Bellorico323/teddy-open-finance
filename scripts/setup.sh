#!/bin/bash

# Garante que o script pare em caso de erro
set -e

# Diretório onde as chaves serão salvas
KEYS_DIR="./scripts/keys"
mkdir -p "$KEYS_DIR"

# Arquivos de chave
PRIVATE_KEY_FILE="$KEYS_DIR/private.pem"
PUBLIC_KEY_FILE="$KEYS_DIR/public.pem"

# Exibir uma barra de progresso simples
echo "🔧 Gerando chaves RSA para JWT..."
sleep 0.5

# Gerar chave privada silenciosamente
openssl genpkey -algorithm RSA -out "$PRIVATE_KEY_FILE" -pkeyopt rsa_keygen_bits:2048 2>/dev/null
echo "✅ Chave privada gerada com sucesso!"

# Gerar chave pública silenciosamente
openssl rsa -in "$PRIVATE_KEY_FILE" -pubout -out "$PUBLIC_KEY_FILE" 2>/dev/null
echo "✅ Chave pública gerada com sucesso!"

# Converter para Base64
PRIVATE_KEY_BASE64=$(base64 -w 0 "$PRIVATE_KEY_FILE")
PUBLIC_KEY_BASE64=$(base64 -w 0 "$PUBLIC_KEY_FILE")

# Criar .env com as configurações do sistema
echo "📄 Criando arquivo .env..."
cat <<EOL > .env
# Arquivo gerado automaticamente pelo setup.sh

# JWT
JWT_PRIVATE_KEY="$PRIVATE_KEY_BASE64"
JWT_PUBLIC_KEY="$PUBLIC_KEY_BASE64"

# Database (Prisma)
DATABASE_URL="postgresql://myuser:mypassword@postgres_db:5432/teddy-finance?schema=public"

# Database variables
DB_PORT=5432
DB_NAME=teddy-finance
DB_USER=myuser
DB_PASSWORD=mypassword

# API
API_URL="http://localhost:3000"
EOL

echo "✅ Arquivo .env criado com sucesso!"
echo "🚀 Configuração concluída! Agora você pode iniciar a aplicação."
