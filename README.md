
# 📊 Gerador de Relatórios Comerciais — Flip Festas

Sistema web para geração de relatórios individuais de desempenho da equipe comercial, com suporte a acompanhamento parcial, fechamento mensal e dashboard consolidado.

## ✨ Funcionalidades

### 📅 Acompanhamento Parcial
- Preenchimento de dados por representante com cálculo automático de resultados ponderados
- Comparativo entre performance parcial e meta mensal
- Geração de relatório individual com barras de progresso e prioridades automáticas
- Exportação em PDF via impressão do navegador

### 🏁 Fechamento do Mês
- Indicadores com status visual de **Meta Batida / Não Batida**
- Resumo do mês com o que funcionou e o que não funcionou
- Ações recomendadas geradas automaticamente, ordenadas por peso dos indicadores
- Download de todos os relatórios em **ZIP** com arquivos nomeados por representante
- Impressão em lote com quebra de página entre representantes

### 📈 Dashboard Consolidado
- Visão gerencial automática baseada nos dados da tabela ativa
- Distribuição da equipe por faixa Alta / Média / Baixa
- Gargalo coletivo por indicador (ordenado por pior atingimento)
- Objetivo de Vendas consolidado com meta, realizado, % e valor faltante
- Ranking completo com Objetivo de Vendas individual por representante
- Top performers com destaque e narrativas automáticas de pontos de atenção

### ⚙️ Utilitários
- Importação de dados via **CSV**
- Download de planilha modelo (CSV)
- Campos calculados automaticamente em tempo real (resultado ponderado por peso)
- Período e mês de referência configuráveis
- Gerenciador de **Templates de Metas** com persistência no navegador (localStorage)
- Exportação e importação de templates em **JSON**

---

## 🧮 Indicadores e Pesos

| Indicador | Peso |
|---|---|
| Objetivo de Vendas | 60 pts |
| Positivação | 15 pts |
| Ticket Médio | 10 pts |
| Mix de Vendas | 10 pts |
| Novas Vendas | 5 pts |
| **Total** | **100 pts** |

### Classificação de Performance
| Faixa | Classificação |
|---|---|
| 90% a 100% | 🟢 Alta |
| 50% a 89% | 🟡 Média |
| 0% a 49% | 🔴 Baixa |

---

## 🚀 Como usar

### Online
Acesse diretamente pelo link do GitHub Pages:
```
https://[seu-usuario].github.io/[nome-do-repositorio]
```

### Local
Clone o repositório e abra o `index.html` diretamente no navegador — não requer servidor ou instalação:
```bash
git clone https://github.com/[seu-usuario]/[nome-do-repositorio].git
cd [nome-do-repositorio]
# Abra index.html no navegador
```

---

## 📂 Estrutura do Projeto

```
/
├── index.html      # Aplicação completa (HTML + CSS + JS em arquivo único)
├── README.md       # Este arquivo
└── CHANGELOG.md    # Histórico de versões
```

---

## 📋 Formato do CSV

### Modo Parcial
```
Nome, Ranking, Perf_Parcial_%, Perf_Mensal_%, NV_MetaP, NV_MetaM, NV_Real,
TM_Meta, TM_Real, OV_MetaP, OV_MetaM, OV_Real, POS_MetaP, POS_MetaM,
POS_Real, MIX_MetaP, MIX_MetaM, MIX_Real
```

### Modo Fechamento
```
Nome, Ranking, Perf_Mensal_%, NV_Meta, NV_Real, TM_Meta, TM_Real,
OV_Meta, OV_Real, POS_Meta, POS_Real, MIX_Meta, MIX_Real
```

> 💡 Use o botão **⬇ CSV Modelo** dentro do sistema para baixar um arquivo de exemplo já formatado.

---

## 🔧 Dependências externas

| Biblioteca | Versão | Uso |
|---|---|---|
| [JSZip](https://stuk.github.io/jszip/) | 3.10.1 | Geração do ZIP com relatórios individuais |

Carregada via CDN — não requer instalação.

---

## 🗺️ Roadmap

- [ ] Histórico mensal comparativo entre períodos
- [ ] Exportação consolidada em Excel/CSV de todos os resultados
- [ ] Integração com Sankhya ERP via API REST
- [ ] Modo "resumo gerencial" de uma página para reuniões

---

## 👤 Desenvolvido para

**Flip Indústria e Comércio (Flip Festas)**  
Equipe Comercial — Diretoria Comercial  
Uso interno · Confidencial
