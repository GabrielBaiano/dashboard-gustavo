# 📱 InstaTrack Desktop Analytics

O **InstaTrack** é um aplicativo desktop moderno e elegante (desenvolvido com **Electron** e **React 19**), em modo escuro definitivo, projetado para monitoramento e análise de engajamento de perfis do Instagram. Ele funciona como uma central analítica completa que gerencia perfis reais ou simulados, salva dados no cache local e monitora o desempenho de posts, crescimento de audiência e simulações.

Esta versão é um **aplicativo desktop totalmente funcional** que roda de forma nativa e permite a integração direta com APIs de scraping reais (como RapidAPI) para buscar dados atualizados de seguidores e posts de qualquer conta pública do Instagram.

---

## 🎨 Principais Funcionalidades

*   **Aplicativo Desktop Nativo**: Executado diretamente na bandeja do sistema (System Tray). Ao fechar a janela, o app continua rodando em segundo plano para acesso rápido.
*   **Integração Real com API (RapidAPI & Meta)**: Aba de configurações dedicada para inserção de chaves de API, permitindo puxar dados de seguidores, bios e posts de qualquer conta pública diretamente da rede social.
*   **Sincronização de Perfis em 1 Clique**: Atualize métricas de crescimento e novos posts instantaneamente através do botão de sincronização dedicado.
*   **Cache Local Persistente (`localStorage`)**: Todas as chaves de API, perfis adicionados, dados do simulador e configurações do painel são salvos localmente e permanecem salvos entre as sessões.
*   **Seletor de Perfis estilo "Stories"**: Alterna instantaneamente entre perfis ativos com avatares circulares e anéis em gradiente colorido característicos do Instagram.
*   **Simulador de ER (Engagement Rate)**: Calculadora inteligente onde você arrasta sliders de seguidores, likes e comentários para prever a nota de engajamento do seu próximo post.
*   **Gráficos Nativos Responsivos (SVG)**:
    *   *Crescimento de Seguidores*: Gráfico de área suavizada com preenchimento em degradê.
    *   *Variação Semanal de Engajamento*: Histórico de oscilação do engajamento.
    *   *Melhores Horários (Heatmap)*: Grade de atividade para identificar picos de engajamento por hora/dia.
*   **Grade de Posts Analítica**: Filtros rápidos de formato (Reels, Fotos, Carrossel) e ordenação por popularidade, exibindo overlay com curtidas e comentários no hover.
*   **Comparativo de Perfis (Benchmarking)**: Ferramenta de comparação de estatísticas entre dois perfis conectados lado a lado.

---

## 🛠️ Tecnologias Utilizadas

*   **Electron**: Framework para desenvolvimento de aplicações desktop cross-platform.
*   **React 19 & TypeScript**: Programação declarativa e tipagem estática robusta.
*   **Vite**: Ferramenta de build extremamente rápida com configuração base de caminhos relativos.
*   **Tailwind CSS v4**: Novo motor CSS mais veloz, com variáveis nativas.
*   **HeroUI v3**: Biblioteca de UI moderna e clean (anteriormente NextUI).
*   **Lucide React**: Biblioteca de ícones vetoriais leves e consistentes.

---

## 🚀 Como Executar o App

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado no seu sistema.

### 1. Instalar as dependências
```bash
npm install
```

### 2. Rodar em Modo de Desenvolvimento (Vite + Electron)
Inicia o painel local e abre a janela nativa do Electron simultaneamente:
```bash
npm run electron:dev
```

### 3. Compilar e Empacotar o Aplicativo Desktop (.AppImage / .deb)
Gera instaladores otimizados prontos para distribuição na pasta `/dist-electron`:
```bash
npm run electron:build
```

---

## ⚙️ Configurando a Sincronização de Dados Reais

Para buscar informações reais do Instagram:
1. Abra o aplicativo e clique na aba **Configurações**.
2. Cole a sua **RapidAPI Key** (de APIs como `instagram-scraper-api2` ou similar).
3. Ative a chave no toggle **"Ativar Consultas Reais"**.
4. Ao adicionar um novo perfil ou clicar no ícone de atualizar (Sync) em um perfil existente, o aplicativo fará uma requisição HTTP real para importar o número exato de seguidores, posts recentes, curtidas, comentários e foto de perfil.
