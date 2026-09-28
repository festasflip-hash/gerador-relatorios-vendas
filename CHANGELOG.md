# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [1.0.0] — 2026-07

### ✨ Adicionado
- Aba **Acompanhamento Parcial** com tabela de entrada por representante
- Aba **Fechamento do Mês** com indicadores de Meta Batida / Não Batida
- Aba **Dashboard Consolidado** com visão gerencial da equipe
- Geração de relatório individual no padrão v1 (cards, barras de progresso, comparativo parcial vs mensal)
- Relatório de fechamento com resumo do mês e ações recomendadas automáticas
- Ações automáticas ordenadas por peso dos indicadores (Objetivo de Vendas primeiro)
- Campos calculados automaticamente em tempo real (resultado ponderado por peso)
- Classificação de performance: Alta (≥90%), Média (50–89%), Baixa (<50%)
- Importação de dados via arquivo **CSV**
- Download de planilha modelo CSV para cada modo
- Exportação de relatórios individuais em **ZIP** nomeados por representante (`Relatório Individual - [Nome].html`)
- Impressão em lote com quebra de página entre representantes
- **Gerenciador de Templates** de metas com persistência em localStorage
- Exportação e importação de templates em **JSON**
- Modal de edição por representante com formulário vertical
- Dashboard: distribuição Alta/Média/Baixa da equipe em barras proporcionais
- Dashboard: gargalo coletivo por indicador ordenado por pior atingimento médio
- Dashboard: Objetivo de Vendas consolidado com meta, realizado, % e valor faltante
- Dashboard: Objetivo de Vendas individual no ranking completo (meta, realizado, %, faltante)
- Dashboard: top performers com destaque visual
- Dashboard: narrativas automáticas de pontos de atenção e destaques positivos
- Dashboard: identificação de representantes abaixo da média da equipe
- Dashboard: identificação de representantes sem nenhuma meta batida (modo fechamento)
- Configuração de período parcial e mês de referência editáveis
- Nome do representante no título do arquivo ao exportar PDF

### 🔧 Técnico
- Aplicação em arquivo único (HTML + CSS + JS) sem dependências de servidor
- JSZip 3.10.1 via CDN para geração do ZIP
- Cálculo automático via `calcParcial()` e `calcFechamento()` com cap em 100% por indicador
- CSS responsivo com grid e flexbox
- Impressão via `window.open` + `window.print()` com CSS de impressão dedicado

---

## [Próximas versões planejadas]

### [1.1.0] — Previsto
- [ ] Exportação consolidada em CSV/Excel de todos os resultados da equipe
- [ ] Validação visual de campos obrigatórios antes de gerar relatórios

### [1.2.0] — Previsto
- [ ] Histórico mensal comparativo (fechamento atual vs mês anterior)
- [ ] Indicador de tendência (↑↓) por representante

### [2.0.0] — Futuro
- [ ] Integração com Sankhya ERP via API REST
- [ ] Autenticação de acesso (login)
- [ ] Modo "resumo gerencial" condensado para reuniões de diretoria

