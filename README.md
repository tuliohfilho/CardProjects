# Gerenciador de Projetos C#

Um aplicativo web avançado para gerenciar projetos C# com funcionalidades completas de filtragem, abertura direta no Visual Studio/VS Code e organização por tags.

## 🚀 Funcionalidades

### ✅ Gerenciamento de Projetos
- **Cadastro de Projetos**: Nome, caminho, descrição, tags e nome da solução C#
- **Edição de Projetos**: Modificar qualquer informação dos projetos existentes
- **Exclusão de Projetos**: Remover projetos com confirmação de segurança
- **Armazenamento Local**: Dados salvos no localStorage do navegador

### 🔍 Sistema de Filtros Avançado
- **Filtro por Tipo**: Escolha entre "Todos os campos", "Nome", "Caminho" ou "Tags"
- **Busca em Tempo Real**: Filtragem instantânea conforme você digita
- **Tags Clicáveis**: Clique em qualquer tag para filtrar automaticamente
- **Múltiplas Tags**: Suporte a várias tags separadas por vírgula ou espaço
- **Filtro Inteligente**: Aceita múltiplos termos de busca

### 🎨 Visualizações Flexíveis
- **Visualização em Cards**: Layout em grid responsivo (padrão)
- **Visualização em Lista**: Layout linear compacto
- **Alternância Rápida**: Botão para alternar entre visualizações
- **Design Responsivo**: Adapta-se automaticamente a diferentes telas

### 🛠️ Integração com Ferramentas
- **Abrir Pasta**: Abre o caminho do projeto no explorador de arquivos
- **Abrir no VS/VSCode**: Escolha entre Visual Studio (.sln) ou VS Code (pasta)
- **Lógica Inteligente de Solução**: 
  - Se nome da solução não for preenchido, usa o nome do projeto
  - Adiciona automaticamente `.sln` se necessário
  - Não duplica `.sln` se já estiver presente
- **Fallback Inteligente**: Copia comandos se abertura direta falhar

### 📋 Funcionalidades de Cópia
- **Ícones de Cópia**: Ícones 📋 ao lado do nome do projeto e caminho
- **Cópia Rápida**: Um clique para copiar informações para área de transferência
- **Feedback Visual**: Hover effects e confirmações de cópia

## 🎨 Interface

### Layout Moderno
- **Design Responsivo**: Funciona em desktop e mobile
- **Cards Organizados**: Projetos exibidos em cards limpos e organizados
- **Lista Compacta**: Visualização linear para máxima eficiência
- **Modal Elegante**: Popup para criar/editar projetos com animações suaves
- **Cores Intuitivas**: Botões coloridos por função (verde=pasta, roxo=VS, amarelo=editar, vermelho=excluir)

### Experiência do Usuário
- **Filtro Integrado**: Campo de busca e seletor de tipo na área principal
- **Tags Visuais**: Tags coloridas e clicáveis para fácil navegação
- **Mensagens Informativas**: "Nenhum projeto encontrado" quando filtros não retornam resultados
- **Confirmações**: Diálogos de confirmação para ações destrutivas
- **Alternância de Visualização**: Botão para trocar entre cards e lista

## 📁 Estrutura do Projeto

```
gerenciador-projetos-csharp/
├── index.html          # Interface principal
├── style.css           # Estilos e responsividade
├── script.js           # Lógica da aplicação
└── README.md           # Documentação
```

## 🔧 Como Usar

### 1. Instalação
1. Baixe todos os arquivos do projeto
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Comece a cadastrar seus projetos!

### 2. Cadastrando um Projeto
1. Clique no botão **"+ Adicionar Projeto"**
2. Preencha as informações:
   - **Nome do Projeto**: Nome identificador do projeto
   - **Caminho**: Caminho completo para a pasta do projeto
   - **Descrição**: Descrição opcional do projeto
   - **Tags**: Tags separadas por vírgula (ex: "UI, API, Teste")
   - **Nome da Solução C#**: Nome do arquivo .sln (opcional)
3. Clique em **"Criar Projeto"**

### 3. Alternando Visualizações
- **Botão de Visualização**: Clique para alternar entre "Cards" e "Lista"
- **Cards**: Layout em grid com informações completas
- **Lista**: Layout linear compacto para navegação rápida

### 4. Filtrando Projetos
1. Use o campo de busca para filtrar projetos
2. Selecione o tipo de filtro no dropdown:
   - **Todos os campos**: Busca em nome, descrição e tags
   - **Nome**: Busca apenas no nome do projeto
   - **Caminho**: Busca apenas no caminho
   - **Tags**: Busca apenas nas tags
3. **Múltiplos Termos**: Use vírgulas ou espaços para buscar vários termos
4. **Tags Clicáveis**: Clique diretamente em qualquer tag para filtrar

### 5. Abrindo Projetos
- **Abrir Pasta**: Clique para abrir o caminho no explorador de arquivos
- **Abrir no VS**: Escolha entre Visual Studio (OK) ou VS Code (Cancelar)
- **Copiar Informações**: Clique nos ícones 📋 para copiar nome ou caminho

## ⚙️ Configurações Técnicas

### Lógica de Abertura no Visual Studio/VS Code
- **Visual Studio**: Abre o arquivo `.sln` com comando `devenv`
- **VS Code**: Abre a pasta do projeto com comando `code`
- **Escolha do Usuário**: Dialog pergunta qual ferramenta usar
- **Fallback**: Copia comando para área de transferência se abertura falhar

### Lógica de Nome da Solução
- Se **Nome da Solução** estiver preenchido: usa esse nome
- Se **Nome da Solução** estiver vazio: usa o **Nome do Projeto**
- Adiciona automaticamente `.sln` se não estiver presente
- Caminho final: `{Caminho}\\{NomeDaSolucao}.sln`

### Filtro Avançado de Tags
- **Múltiplos Termos**: Aceita termos separados por vírgula ou espaço
- **Busca Inteligente**: Encontra projetos que contenham qualquer um dos termos
- **Tags Clicáveis**: Adiciona automaticamente ao filtro existente
- **Filtro Cumulativo**: Permite construir filtros complexos clicando em várias tags

### Armazenamento de Dados
- Dados salvos no `localStorage` do navegador
- Formato JSON para fácil manipulação
- Persistência automática a cada operação

## 🌐 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Sistemas**: Windows, macOS, Linux
- **Dispositivos**: Desktop e mobile (design responsivo)

## 🔒 Limitações de Segurança

Por questões de segurança dos navegadores modernos:
- **Abertura de pastas**: Pode não funcionar diretamente, mas copia o caminho
- **Abertura no VS/VSCode**: Pode não funcionar diretamente, mas copia o comando
- **Solução**: Use os comandos copiados no terminal/prompt de comando

## 🚀 Funcionalidades Futuras

- Exportação/importação de projetos
- Categorias de projetos
- Histórico de acessos
- Integração com Git
- Temas personalizáveis
- Sincronização em nuvem

## 📝 Changelog

### v5.0 (Atual)
- ✅ **Visualização Dupla**: Alternância entre cards e lista
- ✅ **VS/VSCode**: Escolha entre Visual Studio e VS Code
- ✅ **Filtro Avançado**: Múltiplos termos por vírgula ou espaço
- ✅ **Tags Inteligentes**: Clique para adicionar ao filtro existente
- ✅ **Interface Melhorada**: Layout responsivo otimizado

### v4.0
- ✅ Filtro avançado por tipo (nome, caminho, tags)
- ✅ Tags clicáveis para filtro automático
- ✅ Correção dos caminhos para abertura de pasta e VS
- ✅ Lógica inteligente para nome da solução
- ✅ Ícones de cópia para nome e caminho

### v3.0
- ✅ Modal para criar/editar projetos
- ✅ Funcionalidades de edição e exclusão
- ✅ Layout de lista com cards
- ✅ Filtro básico integrado

### v2.0
- ✅ Cadastro básico de projetos
- ✅ Armazenamento local
- ✅ Interface inicial

## 🎯 Casos de Uso

### Desenvolvedor Individual
- Organize todos os seus projetos C# em um local
- Acesso rápido a projetos através de filtros e tags
- Abertura direta no Visual Studio ou VS Code

### Equipe de Desenvolvimento
- Compartilhe a lista de projetos exportando/importando
- Padronize a organização de projetos
- Facilite a navegação entre diferentes soluções

### Gerente de Projetos
- Visão geral de todos os projetos em desenvolvimento
- Filtragem por tags para categorizar projetos
- Acesso rápido a informações de cada projeto

---

**Desenvolvido para facilitar o gerenciamento de projetos C# com foco na produtividade e experiência do usuário.**

