# Gerenciador de Projetos C#

Um aplicativo web moderno para gerenciar e organizar seus projetos C#, facilitando o acesso rápido aos diretórios e abertura no Visual Studio.

## Funcionalidades

- **Cadastro de Projetos**: Adicione projetos através de um modal intuitivo
- **Edição de Projetos**: Edite qualquer projeto existente com facilidade
- **Exclusão de Projetos**: Remova projetos com confirmação de segurança
- **Filtragem Inteligente**: Filtre projetos por nome, descrição ou tags em tempo real
- **Abertura Rápida**: Botões para abrir pasta do projeto e abrir no Visual Studio
- **Armazenamento Local**: Os dados são salvos no localStorage do navegador
- **Interface Moderna**: Layout responsivo com modal e design profissional
- **Experiência Otimizada**: Interface limpa focada na produtividade

## Como Usar

### Adicionando um Projeto
1. Clique no botão **"+ Adicionar Projeto"**
2. Preencha os campos no modal:
   - **Nome do Projeto**: Nome identificador do projeto
   - **Caminho**: Caminho completo da pasta do projeto
   - **Descrição**: Descrição opcional do projeto
   - **Tags**: Tags separadas por vírgula para facilitar a busca
   - **Nome da Solução C#**: Nome da solução (opcional, para abertura no VS)
3. Clique em **"Criar Projeto"**

### Editando um Projeto
1. Clique no botão **"Editar"** no card do projeto
2. Modifique os campos desejados no modal
3. Clique em **"Salvar Alterações"**

### Excluindo um Projeto
1. Clique no botão **"Excluir"** no card do projeto
2. Confirme a exclusão na janela de confirmação

### Filtrando Projetos
- Use o campo de filtro no topo da lista
- Digite qualquer termo para filtrar por nome, descrição ou tags
- A filtragem é feita em tempo real conforme você digita

### Abrindo Projetos
- **Abrir Pasta**: Copia o caminho para a área de transferência
- **Abrir no VS**: Copia o comando `devenv` para a área de transferência

## Estrutura dos Arquivos

```
projeto/
├── index.html      # Interface principal com modal
├── style.css       # Estilos modernos e responsivos
├── script.js       # Lógica JavaScript completa
└── README.md       # Esta documentação
```

## Características do Design

### Layout
- **Header**: Título "Meus Projetos" e botão de adicionar
- **Filtro**: Campo de busca integrado na área principal
- **Cards**: Grid responsivo com informações organizadas
- **Modal**: Popup elegante para criar/editar projetos

### Cores e Estilo
- **Azul Principal**: #007bff (botões e títulos)
- **Verde**: #28a745 (abrir pasta)
- **Roxo**: #6f42c1 (abrir VS)
- **Amarelo**: #ffc107 (editar)
- **Vermelho**: #dc3545 (excluir)
- **Design Limpo**: Foco na usabilidade e produtividade

### Responsividade
- Grid adaptativo para diferentes tamanhos de tela
- Modal otimizado para dispositivos móveis
- Botões reorganizados em telas menores

## Implementação para Ambiente Real

Para que os botões "Abrir Pasta" e "Abrir no VS" funcionem completamente:

### Opção 1: Electron (Recomendado)
```javascript
const { shell } = require('electron');
const { exec } = require('child_process');

window.openFolder = (path) => {
    shell.openPath(path);
};

window.openVS = (path, solutionName) => {
    exec(`devenv "${path}\\${solutionName}.sln"`);
};
```

### Opção 2: Aplicação Web com Backend
```javascript
// Frontend
window.openFolder = async (path) => {
    await fetch('/api/open-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
    });
};

window.openVS = async (path, solutionName) => {
    await fetch('/api/open-vs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, solutionName })
    });
};
```

### Opção 3: Extensão do Navegador
Desenvolva uma extensão com permissões para executar comandos do sistema.

## Funcionalidades Testadas

✅ **Modal de Criação**: Abre com título "Criar Projeto" e botão "Criar Projeto"  
✅ **Modal de Edição**: Abre com título "Editar Projeto", campos preenchidos e botão "Salvar Alterações"  
✅ **Exclusão**: Solicita confirmação antes de remover o projeto  
✅ **Filtragem**: Funciona em tempo real por nome, descrição e tags  
✅ **Responsividade**: Layout adapta-se a diferentes tamanhos de tela  
✅ **Persistência**: Dados salvos no localStorage  
✅ **Interface**: Design moderno e intuitivo  

## Melhorias Implementadas

- **Modal Intuitivo**: Substituiu formulário inline por popup elegante
- **Botões de Ação**: Editar e excluir integrados nos cards
- **Layout Limpo**: Removidos títulos desnecessários
- **Filtro Integrado**: Campo de busca na área principal
- **Feedback Visual**: Mensagem quando nenhum projeto é encontrado
- **Animações**: Transições suaves para melhor UX

## Compatibilidade

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Funciona offline (dados armazenados localmente)
- Interface responsiva para desktop e mobile
- Suporte a teclado e acessibilidade

## Limitações Atuais

- Os botões apenas copiam caminhos/comandos para área de transferência
- Dados armazenados apenas no navegador local
- Não há sincronização entre dispositivos

Para uso profissional, recomenda-se implementar com Electron ou criar um backend para execução real dos comandos.

