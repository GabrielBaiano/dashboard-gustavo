# 📱 InstaTrack Analytics

O **InstaTrack** é um dashboard moderno e elegante, em modo escuro definitivo, desenvolvido para monitoramento e análise de engajamento de perfis do Instagram. Ele foi projetado para uso pessoal e serve como um centro analítico para acompanhar o desempenho de posts, crescimento de audiência e simular interações.

Esta versão é uma demonstração interativa de alta fidelidade que roda sobre dados simulados dinamicamente no frontend.

---

## 🎨 Principais Funcionalidades

*   **Seletor de Perfis estilo "Stories"**: Alterna instantaneamente entre perfis ativos com avatares circulares e anéis em gradiente colorido característicos do Instagram.
*   **Gerador de Perfis Dinâmicos**: Permite adicionar qualquer usuário do Instagram no painel e gera dados estatísticos, posts, históricos e comportamentos realistas na hora.
*   **Cards de KPIs em Tempo Real**: Métricas consolidadas como número total de Seguidores, Taxa de Engajamento geral (ER%), Média de Curtidas e Média de Comentários por post.
*   **Gráficos Nativos Responsivos (SVG)**:
    *   *Crescimento de Seguidores*: Gráfico de área suavizada com preenchimento em degradê.
    *   *Variação Semanal de Engajamento*: Histórico da flutuação da taxa de engajamento do perfil.
    *   *Melhores Horários (Heatmap)*: Tabela de calor que cruza dias da semana com faixas horárias para prever picos de atividade dos seguidores.
*   **Grade de Posts Analítica**:
    *   Exibição dos posts com overlay escuro revelando likes e comentários ao passar o mouse.
    *   Filtros rápidos de formato (Todos, Fotos, Carrossel, Reels).
    *   Ordenação por engajamento, curtidas, comentários ou ordem cronológica.
    *   **Inspetor de Post**: Janela modal detalhada que analisa a performance daquele post específico em relação à média geral do canal.
*   **Simulador de ER**: Calculadora inteligente onde você arrasta sliders de seguidores, likes e comentários para prever a nota de engajamento do seu próximo post.
*   **Comparativo de Perfis (Benchmarking)**: Ferramenta que compara as estatísticas de dois perfis conectados lado a lado em barras de progresso comparativas.

---

## 🛠️ Tecnologias Utilizadas

*   **Vite**: Ferramenta de build extremamente rápida.
*   **React 19 & TypeScript**: Programação declarativa e tipagem estática robusta.
*   **Tailwind CSS v4**: Novo motor CSS mais veloz, com variáveis nativas e importação direta.
*   **HeroUI v3**: Biblioteca de UI moderna e clean (anteriormente NextUI).
*   **Lucide React**: Biblioteca de ícones vetoriais leves e consistentes.

---

## 🚀 Como Executar o Projeto

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

1.  **Clonar ou Entrar na pasta do repositório**:
    ```bash
    cd --dashboard-gustavo
    ```

2.  **Instalar as dependências**:
    ```bash
    npm install
    ```

3.  **Rodar em modo de desenvolvimento**:
    ```bash
    npm run dev -- --port 3000
    ```

4.  **Acessar no Navegador**:
    Abra [http://localhost:3000/](http://localhost:3000/)

5.  **Gerar pacote de produção**:
    ```bash
    npm run build
    ```

---

## ⚙️ Como funciona a Integração com Perfis Reais?

Atualmente, o projeto utiliza uma estrutura modular de dados mockados em `src/config/mockData.ts`. Para conectar o dashboard a perfis reais do Instagram, o fluxo recomendado é:

1.  **API Graph Oficial (Meta)**:
    *   A Meta disponibiliza a **Instagram Graph API** para perfis Profissionais (Criadores ou Empresas).
    *   Exige login OAuth 2.0 (via Facebook Login) para obter um token de acesso de longa duração.
    *   Fornece dados reais como `/media` (posts, curtidas, comentários) e `/insights` (alcance, impressões, público).

2.  **Serviço de Scraping (Para Concorrentes)**:
    *   Como a API oficial só retorna dados de perfis que você é dono/administrador, a análise de concorrentes exige o uso de serviços de raspagem de dados (Web Scraping) via APIs no RapidAPI ou plataformas como Apify para ler o HTML público do Instagram de forma automatizada.

3.  **Backend & Banco de Dados**:
    *   Um servidor Node.js/Express intermediário deve gerenciar as chaves de API com segurança e evitar erros de segurança CORS no navegador.
    *   Um banco de dados (ex: MongoDB/Postgres) é necessário para salvar a quantidade diária de seguidores de cada perfil, já que o Instagram não fornece histórico retroativo de crescimento.

*Para ler um guia completo de arquitetura sobre dados reais, consulte o arquivo local `instagram_api_guide.md` gerado no workspace.*
