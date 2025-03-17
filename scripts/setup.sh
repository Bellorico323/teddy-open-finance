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

DB_NAME="db_$(openssl rand -hex 4)"
DB_USER="user_$(openssl rand -hex 4)"
DB_PASSWORD="pass_$(openssl rand -hex 4)"

OS=$(uname -s)

if [[ "$OS" == "Linux" ]]; then
    # Linux: Usa ip addr ou ifconfig
    if command -v ip > /dev/null; then
        IP=$(ip addr show | awk '/inet / {print $2}' | grep -v '127.0.0.1' | cut -d/ -f1 | head -n 1)
    elif command -v ifconfig > /dev/null; then
        IP=$(ifconfig | awk '/inet / {print $2}' | grep -v '127.0.0.1' | head -n 1)
    else
        echo "❌ Não foi possível determinar o IP no Linux."
        exit 1
    fi
elif [[ "$OS" == "MINGW64_NT"* || "$OS" == "MSYS_NT"* || "$OS" == "CYGWIN_NT"* ]]; then
    # Windows: Usa PowerShell para obter o IP
    IP=$(powershell.exe -Command "(Get-NetIPAddress -AddressFamily IPv4).IPAddress" | head -n 1 | tr -d '\r')
else
    echo "❌ Sistema operacional não suportado."
    exit 1
fi

echo "🌍 IP detectado: $IP"

# Criar .env com as configurações do sistema
echo "📄 Criando arquivo .env..."
cat <<EOL > .env
# Arquivo gerado automaticamente pelo setup.sh

# JWT
JWT_PRIVATE_KEY="$PRIVATE_KEY_BASE64"
JWT_PUBLIC_KEY="$PUBLIC_KEY_BASE64"

# Database (Prisma)
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@postgres_db:5432/$DB_NAME?schema=public"

# Database variables
DB_PORT=5432
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# API
API_URL="http://$IP:3000"
EOL

echo "✅ Arquivo .env criado com sucesso!"
echo "🚀 Configuração concluída! Agora você pode iniciar a aplicação."
