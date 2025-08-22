# 1. Usar imagem oficial do Node
FROM node:18

# 2. Definir pasta de trabalho
WORKDIR /app

# 3. Copiar arquivos de configuração primeiro (para cache)
COPY package*.json ./

# 4. Instalar dependências
RUN npm install

# 5. Copiar todo o restante do projeto
COPY . .

# 6. Expor a porta do servidor (ajuste se for diferente no seu server.js)
EXPOSE 3000

# 7. Comando para rodar o servidor
CMD ["node", "server.js"]
