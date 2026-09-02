# Gerador de Relatórios Comerciais

## Visão Geral

Este é um aplicativo web de geração de relatórios individuais de desempenho comercial, destinado a gestores comerciais para avaliar a performance de equipes de vendas. O aplicativo permite inserir dados de indicadores (Novas Vendas, Ticket Médio, Objetivo de Vendas, Positivação e Mix de Vendas), calcular automaticamente resultados com base em pesos predefinidos, gerar relatórios individuais em modo Parcial (acompanhamento periódico) ou Fechamento (avaliação mensal), e exportar os relatórios para impressão ou arquivamento.

O aplicativo é inteiramente cliente-side, utilizando apenas HTML, CSS e JavaScript puro (sem frameworks), com a biblioteca [JSZip](https://stuk.github.io/jszip/) para geração de arquivos ZIP contendo múltiplos relatórios em HTML.

## Arquitetura

O projeto segue uma arquitetura simples de aplicação de página única (SPA) com separação de responsabilidades básica:

- **index.html**: Estrutura da interface, contendo abas (Parcial, Fechamento, Dashboard), tabelas de entrada de dados, modais (visualização, edição, templates) e seções de resultados.
- **styles.css**: Estilos visuais (não examinado neste contexto, mas presumivelmente contém o tema e layout).
- **app.js**: Lógica completa da aplicação, incluindo:
  - Gerenciamento de estado com persistência via `localStorage`.
  - Cálculo automático de indicadores.
  - Renderização dinâmica de tabelas.
  - Manipulação de eventos (adicionar linhas, editar, gerar relatórios, etc.).
  - Funções de geração de relatórios (HTML para visualização e impressão).
  - Gerenciamento de templates (salvar, aplicar, excluir, exportar/importar).
  - Importação/exportação de CSV.
  - Geração de ZIP (apenas no modo Fechamento).
  - Renderização do Dashboard consolidado.

### Estado da Aplicação

Todo o estado da aplicação é mantido em um único objeto global `State`, que é persistente no `localStorage` bajo a chave `gerador_relatorios_v1`. O estado inclui:

| Propriedade       | Tipo          | Descrição                                                                 |
|-------------------|---------------|---------------------------------------------------------------------------|
| `modo`            | String        | Modo atual: `'parcial'`, `'fechamento'` ou `'dashboard'`.                 |
| `dadosParcial`    | Array         | Lista de objetos contendo os indicadores para o modo Parcial.             |
| `dadosFechamento` | Array         | Lista de objetos contendo os indicadores para o modo Fechamento.          |
| `relAtual`        | String\|null  | HTML do último relatório gerado (para visualização no modal).             |
| `relAtualNome`    | String\|null  | Nome do representante associado ao último relatório.                      |
| `editIdx`         | Number        | Índice do item sendo editado no modal (-1 se nenhum).                     |
| `editModo`        | String        | Modo do item sendo editado (`'parcial'` ou `'fechamento'`).               |

O objeto `State` possui dois métodos:
- `load()`: Lê o estado salvo do `localStorage` (se existir) e o aplica.
- `save()`: Serializa o estado atual para JSON e o grava no `localStorage`.

Um `setInterval` chama `State.save()` a cada 30 segundos (`AUTO_SAVE_INTERVAL`) para garantir que alterações não sejam perdidas.

### Fluxo de Execução

1. **Inicialização**:
   - Ao carregar `app.js`, `State.load()` é chamado para restaurar qualquer estado previamente salvo.
   - Se não houver estado salvo, são criadas três linhas vazias na tabela Parcial (modo padrão) e a tabela é renderizada.

2. **Interação do Usuário**:
   - O usuário pode alternar entre as abas (Parcial, Fechamento, Dashboard) via `switchTab(modo)`, que atualiza `State.modo` e mostra/oculta os contêineres apropriados.
   - Nas abas Parcial e Fechamento, o usuário pode:
     - Adicionar linhas vazias (`addRow()`).
     - Editar linhas existentes abrindo o modal de edição (`abrirEdit(i, modo)`).
     - Excluir linhas (`splice` na array respectiva + re-render).
     - Limpar todos os dados (`clearAll()`).
   - Enquanto o usuário preenche os campos, os eventos `oninput` nos inputs atualizam diretamente o array de dados (`State.dadosParcial[index].campo = value`) e disparam funções de recálculo automático (`autoCalcP(i)` ou `autoCalcF(i)`).

3. **Cálculo Automático**:
   - Cada indicador tem uma função de cálculo (`calcParcial(d)` ou `calcFechamento(d)`) que, baseado nas metas e realizados, calcula o resultado ponderado (ex: `nvRes`, `tmPct`, etc.) de acordo com os pesos definidos em `PESOS`.
   - Os campos de resultado (com classe `calc`) são somente leitura e são atualizados automaticamente após cada alteração nos campos de entrada.

4. **Modal de Edição**:
   - Ao editar um representante, os valores são carregados nos campos do modal.
   - Enquanto o usuário altera metas que têm cálculo automático (ex: Nova Vendas Meta Parcial), funções de preview (`previewCalcP()` ou `previewCalcF()`) recalculam e exibem os resultados esperados.
   - Ao salvar (`salvarEdit()`), os valores são gravados de volta no array de dados, os cálculos são executados e a tabela é re-renderizada.

5. **Templates**:
   - O usuário pode salvar as metas (sem realizados) de um representante em edição como um template via `salvarComoTemplate()`.
   - Templates são armazenados no `localStorage` bajo a chave `relatorios_templates_v1` como um array de objetos.
   - O gerenciador de templates (`abrirTemplateManager()`) permite visualizar, aplicar (cria uma nova linha com as metas do template), excluir, exportar e importar templates em JSON.

6. **Geração de Relatórios**:
   - Após preencher os dados, o usuário clica em "⚡ Gerar Relatórios" (`gerarTodos()`), que:
     - Valida se há ao menos um representante com nome.
     - Para cada representante válido, gera o HTML do relatório via `gerarRelatorio(d)` (que delega para `relParcial(d)` ou `relFechamento(d)` conforme o modo).
     - Exibe os cartões resumidos na seção de resultados.
   - Na seção de resultados, o usuário pode:
     - Clicar em "👁 Ver" para visualizar o relatório individual em um modal (`verRel(i)`).
     - Clicar em "🖨️ PDF" para imprimir o relatório individual (`imprimirRel(i)`) ou todos (`imprimirTodos()`).
     - Clicar em "🖨️ Imprimir Todos" para imprimir todos os relatórios em sequência (com quebras de página).
     - Clicar em "📦 Baixar ZIP" (apenas no modo Fechamento) para baixar um ZIP contendo cada relatório como arquivo HTML (`baixarZip()`).

7. **Dashboard**:
   - Quando a aba Dashboard é selecionada, `renderDashboard()` é chamado.
   - Ele apresenta uma visão consolidada dos dados (seja de Parcial ou Fechamento, conforme disponível), incluindo:
     - Totais de representantes.
     - Performance média da equipe.
     - Atingimento do Objetivo de Vendas da equipe.
     - Distribuição de performance (Alta/Média/Baixa).
     - Indicadores de gargalo.
     - Top performers.
     - Ranking completo.

### Persistência de Dados

- Todo o estado da aplicação (dados inseridos, modo atual, etc.) é salvo automaticamente a cada 30 segundos no `localStorage`.
- Ao recarregar a página ou retornar posteriormente, o estado é restaurado via `State.load()` na inicialização.
- Isso garante que o usuário não perca dados ao fechar o navegador ou ao atualizar a página acidentalmente.

### Estrutura de Dados de Indicadores

Cada representante no array `dadosParcial` ou `dadosFechamento` possui os seguintes campos (exemplo para Parcial; Fechamento é semelhante, mas com menos metas parciais/mensais):

| Campo           | Tipo   | Descrição                                                                 |
|-----------------|--------|---------------------------------------------------------------------------|
| `nome`          | String | Nome do representante.                                                    |
| `ranking`       | String | Posição no ranking (ex: "1", "2").                                        |
| `perfParcial`   | Number | Percentual de desempenho parcial (0-100).                                 |
| `perfMensal`    | Number | Percentual de desempenho mensal (0-100).                                  |
| `nvMetaP`       | Number | Meta de Novas Vendas Parcial (quantidade).                                |
| `nvMetaM`       | Number | Meta de Novas Vendas Mensal (quantidade).                                 |
| `nvReal`        | Number | Realizado de Novas Vendas (quantidade).                                   |
| `nvRes`         | Number | Resultado ponderado de Novas Vendas (calculado).                          |
| `tmMeta`        | Number | Meta de Ticket Médio (valor em R$).                                       |
| `tmReal`        | Number | Realizado de Ticket Médio (valor em R$).                                  |
| `tmPct`         | Number | Percentual de atingimento da meta de Ticket Médio (calculado).            |
| `ovMetaP`       | Number | Meta de Objetivo de Vendas Parcial (valor em R$).                         |
| `ovMetaM`       | Number | Meta de Objetivo de Vendas Mensal (valor em R$).                          |
| `ovReal`        | Number | Realizado de Objetivo de Vendas (valor em R$).                            |
| `ovRes`         | Number | Resultado ponderado de Objetivo de Vendas (calculado).                    |
| `posMetaP`      | Number | Meta de Positivação Parcial (quantidade).                                 |
| `posMetaM`      | Number | Meta de Positivação Mensal (quantidade).                                  |
| `posReal`       | Number | Realizado de Positivação (quantidade).                                    |
| `posRes`        | Number | Resultado ponderado de Positivação (calculado).                           |
| `mixMetaP`      | Number | Meta de Mix de Vendas Parcial (quantidade de SKUs).                       |
| `mixMetaM`      | Number | Meta de Mix de Vendas Mensal (quantidade de SKUs).                        |
| `mixReal`       | Number | Realizado de Mix de Vendas (quantidade de SKUs).                          |
| `mixRes`        | Number | Resultado ponderado de Mix de Vendas (calculado).                         |

### Pesos (`PESOS`)

Os pesos utilizados nos cálculos são definidos como constantes:

```javascript
const PESOS = { nv: 5, tm: 10, ov: 60, pos: 15, mix: 10 };
```

Eles somam 100 pontos, representando a pontuação máxima possível no relatório.

### Como Utilizar / Manutenção

#### Pré-requisitos

- Nenhum pré-requisito de instalação é necessário além de um navegador web moderno (Chrome, Firefox, Edge, Safari).
- O projeto não depende de servidores, build tools ou gerenciadores de pacotes.

#### Execução Local

1. Clone ou copie o diretório do projeto para sua máquina.
2. Abra o arquivo `index.html` em um navegador.
3. O aplicativo estará pronto para uso.

#### Modificações e Extensões

Dado que o objetivo do README é documentação interna, aqui estão orientações para manutenção e evolução:

##### Alterando ou Adicionando Indicadores

1. **Atualizar o objeto `PESOS`**:
   - Modifique a constante `PESOS` no topo de `app.js` para refletir novos pesos ou novos indicadores.
   - Certifique-se de que a soma dos pesos continue em 100 (ou ajuste a lógica de cálculo se desejar outra escala).

2. **Adicionar campos nos objetos de dados**:
   - Nas funções `novoParcial()` e `novoFechamento()`, inicialize o novo campo com um valor padrão (vazio ou zero).
   - Nos templates de HTML das tabelas (`tableBodyParcial` e `tableBodyFechamento`), adicione novas `<col>` e `<th>` no `<thead>` e novas `<td>` no `<tbody>` (nos template literals das funções `renderParcial()` e `renderFechamento()`).
   - Nos inputs, ligue o evento `oninput` para chamar a função de cálculo apropriada (`autoCalcP(index)` ou `autoCalcF(index)`) nos campos que afetam resultados.

3. **Atualizar funções de cálculo**:
   - Em `calcParcial(d)` e/ou `calcFechamento(d)`, adicione a lógica para calcular o novo resultado ponderado com base na meta e realizado.
   - Atualize os mapas utilizados nas funções `autoCalcP` e `autoCalcF` (arrays `calcMap`) para incluir o índice da célula e o nome do campo onde o resultado deve ser exibido.

4. **Atualizar modais de edição**:
   - Nos modais de edição (construídos nas strings HTML dentro de `abrirEdit()`), adicione campos para o novo indicador (meta, realizado, etc.).
   - Se o novo indicador tiver cálculo automático, adicione os `oninput` apropriados para chamar `previewCalcP()` ou `previewCalcF()`.
   - Atualize os objetos de mapa nas funções `previewCalcP()` e `previewCalcF()` para incluir os novos IDs de input e os campos de destino.
   - Em `salvarEdit()`, copie os valores dos novos campos do modal para o objeto de dados.

5. **Atualizar geração de relatórios**:
   - Nas funções `relParcial(d)` e `relFechamento(d)`, adicione linhas nas tabelas de indicadores para mostrar meta, realizado, percentual, peso, progresso (barra) e resultado.
   - Atualize as seções de visão geral, performance detalhada, comparativo, etc., conforme necessário para incluir o novo indicador.

6. **Atualizar templates e CSV**:
   - As funções que lidam com templates (`salvarComoTemplate()`, `aplicarTemplate()`, etc.) já funcionam genericamente ao espalhar o objeto `metas`, então novos campos de meta serão incluídos automaticamente se forem adicionados ao objeto `tpl.metas` na hora de salvar.
   - Para CSV, atualize as strings de cabeçalho (`downloadModelo()`) e o mapeamento de colunas em `handleCSV()` (nos objetos passados para `novoParcial()` e `novoFechamento()`).

##### Dicas de Depuração

- Use o console do navegador (`F12` → Console) para ver mensagens de log (avisos de carregamento/salvamento de estado, erros).
- O objeto `State` pode ser inspecionado diretamente no console digitando `State`.
- Se houver problemas de renderização, verifique se as funções de render (`renderParcial()`, `renderFechamento()`, `renderDashboard()`) estão sendo chamadas após modificações nos arrays de dados.
- O `localStorage` pode ser inspecto na aba Application → Local Storage para verificar os valores salvos.

##### Boas Práticas

- Todas as modificações de estado devem ser feitas diretamente nas propriedades do objeto `State` (ou em seus arrays internos) para que a persistência funcione corretamente.
- Após modificar arrays (`State.dadosParcial`, `State.dadosFechamento`), sempre chame a função de render correspondente para atualizar a UI.
- Evite usar variáveis globais fora do objeto `State` para armazenar dados que devam ser persistentes.
- Testar alterações em ambos os modos (Parcial e Fechamento) e no Dashboard.

## Licença

Este projeto é para uso interno e não possui uma licença pública definida.

--- 

*Documentação gerada para facilitar a manutenção e o entendimento interno do projeto.*