# 🌱 Mapa de Pontos de Coleta e Reciclagem

Plataforma web simples para visualizar e cadastrar pontos de coleta de resíduos, incentivando o **descarte correto** e a **economia sustentável**.


---

## 📋 Funcionalidades

- 🗺 **Mapa interativo** com localização de pontos de coleta  
- 🗂 **Filtro por material** (vidro, plástico, óleo de cozinha, etc.)  
- 📜 **Lista lateral** com detalhes de cada ponto  
- ➕ **Cadastro de novos pontos** diretamente pelo mapa  
- 📍 **Preenchimento automático de coordenadas** ao clicar no mapa  
- 📂 **Persistência em arquivo JSON** no servidor  

---

## 🛠 Tecnologias Utilizadas

**Front-end**  
- [Leaflet.js](https://leafletjs.com/) + OpenStreetMap  
- HTML5, CSS3 e JavaScript puro  

**Back-end**  
- Node.js + [Express](https://expressjs.com/)  
- [Helmet](https://helmetjs.github.io/) para segurança básica  
- [UUID](https://www.npmjs.com/package/uuid) para identificação única dos pontos  

---

## 🚀 Como Rodar o Projeto Localmente

1. **Clone o repositório**  
   ```bash
   git clone https://github.com/seu-usuario/coleta-reciclagem.git
   cd coleta-reciclagem
   ```

2. **Instale as dependências**  
   ```bash
   npm install
   ```

3. **Inicie o servidor**  
   ```bash
   npm start
   ```

4. **Acesse no navegador**  
   ```
   http://localhost:3000
   ```

---

## 📂 Estrutura de Pastas

```
coleta-reciclagem/
├─ package.json        # Configuração do projeto e dependências
├─ server.js           # Servidor Node.js/Express
├─ data/
│  └─ points.json      # Banco de dados simples em JSON
└─ public/
   ├─ index.html       # Página principal
   ├─ styles.css       # Estilos
   └─ app.js           # Lógica do front-end
```

---

## 📌 Próximas Melhorias

- 📷 Upload de fotos para cada ponto de coleta  
- 🔒 Sistema de autenticação para moderar cadastros  
- 📊 Estatísticas sobre quantidade de pontos por material  
- 🌎 Suporte a múltiplas cidades  

---

## 📜 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

💚 **Contribua para um mundo mais sustentável!**
