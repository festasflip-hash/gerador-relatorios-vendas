/* ============ AÇÕES AUTOMÁTICAS ============ */
function acoesAuto(d) {
  const itens = [];
  const ovFalta = f(d.ovMeta) - f(d.ovReal);
  if (ovFalta > 0) {
    const pct = ((f(d.ovReal) / f(d.ovMeta)) * 100).toFixed(0);
    itens.push({
      c: "d-r",
      t: `<strong>Prioridade máxima:</strong> faturar mais <strong>R$ ${fmt(ovFalta)}</strong> para fechar Objetivo de Vendas (${pct}%) — maior peso (60 pts).`,
    });
  }
  const posFalta = f(d.posMeta) - f(d.posReal);
  if (posFalta > 0)
    itens.push({
      c: "d-o",
      t: `Positivar mais <strong>${posFalta.toFixed(0)} clientes</strong> para atingir a meta de ${d.posMeta}.`,
    });
  const tmFalta = f(d.tmMeta) - f(d.tmReal);
  if (tmFalta > 0)
    itens.push({
      c: "d-o",
      t: `Elevar Ticket Médio em <strong>R$ ${fmt(tmFalta)}</strong>, de R$ ${fmt(f(d.tmReal))} para R$ ${fmt(f(d.tmMeta))}.`,
    });
  const mixFalta = f(d.mixMeta) - f(d.mixReal);
  if (mixFalta > 0)
    itens.push({
      c: "d-o",
      t: `Ampliar Mix de Produtos em mais <strong>${mixFalta.toFixed(0)} SKUs</strong>.`,
    });
  const nvFalta = f(d.nvMeta) - f(d.nvReal);
  if (nvFalta > 0)
    itens.push({
      c: f(d.nvReal) === 0 ? "d-r" : "d-o",
      t: `Realizar mais <strong>${nvFalta.toFixed(0)} novas vendas</strong> para atingir a meta de ${d.nvMeta}.`,
    });
  if (!itens.length)
    itens.push({
      c: "d-g",
      t: `Todas as metas batidas — <strong>manter o ritmo e consolidar os resultados</strong> no próximo período.`,
    });
  return itens
    .map(
      (i) =>
        `<div class="pi"><div class="pdot ${i.c}"></div><span>${i.t}</span></div>`,
    )
    .join("");
}
function priorParcial(d) {
  const itens = [];
  const nvFalta = f(d.nvMetaM) - f(d.nvReal);
  if (f(d.nvReal) === 0)
    itens.push({
      c: "d-r",
      t: `Realizar <strong>${nvFalta.toFixed(0)} novas vendas</strong> — zerado até agora.`,
    });
  else if (nvFalta > 0)
    itens.push({
      c: "d-o",
      t: `Realizar mais <strong>${nvFalta.toFixed(0)} novas vendas</strong> para atingir meta mensal.`,
    });
  const ovFalta = f(d.ovMetaM) - f(d.ovReal);
  if (ovFalta > 0) {
    const pct = ((f(d.ovReal) / f(d.ovMetaM)) * 100).toFixed(0);
    itens.push({
      c: pct < 50 ? "d-r" : "d-o",
      t: `Faturar mais <strong>R$ ${fmt(ovFalta)}</strong> para fechar Objetivo de Vendas (${pct}%).`,
    });
  }
  const posFalta = f(d.posMetaM) - f(d.posReal);
  if (posFalta > 0)
    itens.push({
      c: "d-o",
      t: `Positivar mais <strong>${posFalta.toFixed(0)} clientes</strong>.`,
    });
  const mixFalta = f(d.mixMetaM) - f(d.mixReal);
  if (mixFalta > 0)
    itens.push({
      c: "d-o",
      t: `Ampliar Mix em mais <strong>${mixFalta.toFixed(0)} SKUs</strong>.`,
    });
  const tmFalta = f(d.tmMeta) - f(d.tmReal);
  if (tmFalta > 0)
    itens.push({
      c: "d-o",
      t: `Elevar Ticket Médio de <strong>R$ ${fmt(f(d.tmReal))}</strong> para <strong>R$ ${fmt(f(d.tmMeta))}</strong>.`,
    });
  if (!itens.length)
    itens.push({
      c: "d-g",
      t: `Todos os indicadores mensais atingidos — <strong>excelente performance!</strong>`,
    });
  return itens
    .map(
      (i) =>
        `<div class="pi"><div class="pdot ${i.c}"></div><span>${i.t}</span></div>`,
    )
    .join("");
}

/* ============ RELATÓRIO PARCIAL ============ */
function explicacaoIndicadoresHTML() {
  const indicadores = [
    [
      "Novas Vendas",
      5,
      "Quantos clientes novos(Nunca compraram antes) o representante trouxe.",
      "É o indicador que mostra prospecção ativa em vez de antender apenas a carteira existente.",
      "Qualquer novo cliente é positivo; zero indica estagnação na carteira.",
      "Garante que a equipe continua expandindo a base de cliente.",
    ],
    [
      "Ticket Médio",
      10,
      "Valor médio das vendas. Indica quanto foi vendido, em média, por venda, em comparação com a meta de valor.",
      "Vendas de valor baixo demais podem indicar vendas pequenas demais para o esforço comercial.",
      "Acima da meta(Ex:R$3.000) é bom!; Muito abaixo pode indicar necessidade de revisão da abordagem comercial.",
      "Avalia a qualidade da venda, não apenas a quantidade.",
    ],
    [
      "Objetivo de Vendas",
      60,
      "Faturamento total realizado em relação ao objetivo de vendas estabelecido para o período.",
      "Valor médio das vendas. Indica quanto foi vendido, em média, por venda, em comparação com a meta de valor.",
      "Valor médio das vendas. Indica quanto foi vendido, em média, por venda, em comparação com a meta de valor.",
      "Valor médio das vendas. Indica quanto foi vendido, em média, por venda, em comparação com a meta de valor.",
    ],
    [
      "Positivação",
      15,
      "Quantidade de clientes positivados, ou seja, clientes que realizaram compras, comparada à meta.",
      "Valor médio das vendas. Indica quanto foi vendido, em média, por venda, em comparação com a meta de valor.",
      "Valor médio das vendas. Indica quanto foi vendido, em média, por venda, em comparação com a meta de valor.",
      "Valor médio das vendas. Indica quanto foi vendido, em média, por venda, em comparação com a meta de valor.",
    ],
    [
      "Mix de Produtos",
      10,
      "Quantidade de produtos diferentes (SKUs) vendidos em relação à meta de variedade.",
      "Valor médio das vendas. Indica quanto foi vendido, em média, por venda, em comparação com a meta de valor.",
      "Valor médio das vendas. Indica quanto foi vendido, em média, por venda, em comparação com a meta de valor.",
      "Valor médio das vendas. Indica quanto foi vendido, em média, por venda, em comparação com a meta de valor.",
    ],
  ];

  return `<div class="sec">Entenda cada indicador</div>
    <div class="indicator-grid">
      ${indicadores
        .map(
          ([nome, peso, oque, interpretacao, bomRuim, paraQueServe]) =>
            `<div class="indicator-item"><div class="indicator-heading"><strong>${nome}</strong><span>Peso ${peso}</span></div><p><strong>O que mede:</strong> ${oque}</p><p><strong>Interpretar:</strong>${interpretacao}</p><p><strong>Bom/Ruim: </strong>${bomRuim}</p><p><strong>Para que serve: </strong>${paraQueServe}</p></div>`,
        )
        .join("")}
    </div>
    <p class="indicator-note">O resultado de cada indicador considera o percentual da meta atingida e seu peso na pontuação total, limitado à pontuação máxima do indicador.</p>`;
}

function dadosProjecaoParcial(dados) {
  const periodo = periodoParcialAtual();
  if (!periodo.valido) return null;
  const fatores = [
    { nome: "Novas Vendas", real: "nvReal", meta: "nvMetaM", tipo: "count" },
    {
      nome: "Ticket Médio",
      real: "tmReal",
      meta: "tmMeta",
      tipo: "money",
      ticket: true,
    },
    {
      nome: "Objetivo de Vendas",
      real: "ovReal",
      meta: "ovMetaM",
      tipo: "money",
    },
    { nome: "Positivação", real: "posReal", meta: "posMetaM", tipo: "count" },
    {
      nome: "Mix de Produtos",
      real: "mixReal",
      meta: "mixMetaM",
      tipo: "count",
      unidade: " SKUs",
    },
  ];
  const linhas = fatores.map((item) => {
    const temRealizado = temValor(dados[item.real]);
    const realizado = f(dados[item.real]);
    const projetado = temRealizado
      ? item.ticket
        ? realizado
        : (realizado / periodo.diasDecorridos) * periodo.diasNoMes
      : null;
    const meta =
      temValor(dados[item.meta]) && f(dados[item.meta]) > 0
        ? f(dados[item.meta])
        : null;
    const atingimento =
      projetado !== null && meta > 0 ? (projetado / meta) * 100 : null;
    return { ...item, realizado, projetado, meta, atingimento };
  });
  const projeto = {
    ...dados,
    nvReal: linhas[0].projetado ?? 0,
    tmReal: linhas[1].projetado ?? 0,
    ovReal: linhas[2].projetado ?? 0,
    posReal: linhas[3].projetado ?? 0,
    mixReal: linhas[4].projetado ?? 0,
  };
  return {
    linhas,
    performance: performanceCalculada(projeto, {
      nv: dados.nvMetaM,
      ov: dados.ovMetaM,
      pos: dados.posMetaM,
      mix: dados.mixMetaM,
    }),
    periodo,
  };
}
function valorProjecao(valor, tipo) {
  if (valor === null || valor === undefined) return "—";
  return tipo === "count"
    ? valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })
    : `R$ ${fmt(valor)}`;
}
function tabelaProjecaoParcial(dados) {
  const projecao = dadosProjecaoParcial(dados);
  if (!projecao) return "";
  const linhas = projecao.linhas
    .map((item) => {
      let situacao = "Meta não informada";
      if (item.projetado === null) situacao = "Informe o realizado";
      else if (item.meta > 0)
        situacao =
          item.atingimento >= 100
            ? `<span class="status-pill status-ok">No ritmo da meta</span>`
            : `<span class="status-pill status-fail">Abaixo do ritmo</span>`;
      const unidade = item.unidade || "";
      return `<tr><td><strong>${item.nome}</strong></td><td class="tr">${valorProjecao(item.realizado, item.tipo)}${unidade}</td><td class="tr"><strong>${valorProjecao(item.projetado, item.tipo)}${unidade}</strong></td><td class="tr">${item.meta === null ? "—" : `${valorProjecao(item.meta, item.tipo)}${unidade}`}</td><td class="tc2">${item.atingimento === null ? "—" : `${item.atingimento.toFixed(0)}%`}</td><td class="tc2">${situacao}</td></tr>`;
    })
    .join("");
  return `<div class="sec">Projeção para o Fechamento</div>
    <div class="projection-summary">
      <div><span>Performance projetada</span><strong>${projecao.performance}%</strong></div>
      <p>Projeção linear com base em ${projecao.periodo.diasDecorridos} de ${projecao.periodo.diasNoMes} dias corridos. O Ticket Médio mantém o valor realizado atual; os demais indicadores acumulados são extrapolados pelo ritmo observado.</p>
    </div>
    <table class="projection-table"><thead><tr><th>Indicador</th><th class="tr">Realizado até agora</th><th class="tr">Projeção no fechamento</th><th class="tr">Meta mensal</th><th class="tc2">Atingimento projetado</th><th class="tc2">Tendência</th></tr></thead><tbody>${linhas}</tbody></table>`;
}
function validarValoresRelatorio(dados, fonte) {
  const campos =
    fonte === "parcial"
      ? [
          ["nvMetaM", "Meta mensal de Novas Vendas"],
          ["nvReal", "Realizado de Novas Vendas"],
          ["tmMeta", "Meta de Ticket Médio"],
          ["tmReal", "Realizado de Ticket Médio"],
          ["ovMetaM", "Meta mensal de Objetivo de Vendas"],
          ["ovReal", "Realizado de Objetivo de Vendas"],
          ["posMetaM", "Meta mensal de Positivação"],
          ["posReal", "Realizado de Positivação"],
          ["mixMetaM", "Meta mensal de Mix de Produtos"],
          ["mixReal", "Realizado de Mix de Produtos"],
        ]
      : [
          ["nvMeta", "Meta de Novas Vendas"],
          ["nvReal", "Realizado de Novas Vendas"],
          ["tmMeta", "Meta de Ticket Médio"],
          ["tmReal", "Realizado de Ticket Médio"],
          ["ovMeta", "Meta de Objetivo de Vendas"],
          ["ovReal", "Realizado de Objetivo de Vendas"],
          ["posMeta", "Meta de Positivação"],
          ["posReal", "Realizado de Positivação"],
          ["mixMeta", "Meta de Mix de Produtos"],
          ["mixReal", "Realizado de Mix de Produtos"],
        ];
  for (const dadosPessoa of dados) {
    if (!dadosPessoa.nome || !dadosPessoa.nome.trim()) continue;
    for (const [campo, rotulo] of campos) {
      const valor = dadosPessoa[campo];
      if (!temValor(valor)) continue;
      const numero = Number(String(valor).replace(",", "."));
      if (!Number.isFinite(numero) || numero < 0) {
        alert(`${rotulo} de ${dadosPessoa.nome} deve ser um número igual ou maior que zero.`);
        return false;
      }
    }
    const performances =
      fonte === "parcial"
        ? [
            ["perfParcial", dadosPessoa.perfParcialManual],
            ["perfMensal", dadosPessoa.perfMensalManual],
          ]
        : [["perfMensal", dadosPessoa.perfMensalManual]];
    for (const [campo, manual] of performances) {
      const valor = dadosPessoa[campo];
      if (manual && (Number(valor) < 0 || Number(valor) > 100)) {
        alert(`A performance manual de ${dadosPessoa.nome} deve estar entre 0 e 100.`);
        return false;
      }
    }
  }
  return true;
}

function relParcial(d) {
  calcParcial(d);
  const periodo = rotuloPeriodoParcial(),
    mes = rotuloMes(document.getElementById("mesInput").value);
  const pp = f(d.perfParcial),
    pm = f(d.perfMensal);
  const [ppCls, , ppTc] = perfClass(pp),
    [pmCls, , pmTc] = perfClass(pm);
  const nvPct =
    f(d.nvMetaP) > 0 ? Math.min((f(d.nvReal) / f(d.nvMetaP)) * 100, 100) : 0;
  const ovPctP =
    f(d.ovMetaP) > 0 ? Math.min((f(d.ovReal) / f(d.ovMetaP)) * 100, 100) : 0;
  const ovPctM =
    f(d.ovMetaM) > 0 ? Math.min((f(d.ovReal) / f(d.ovMetaM)) * 100, 100) : 0;
  const posPct =
    f(d.posMetaP) > 0 ? Math.min((f(d.posReal) / f(d.posMetaP)) * 100, 100) : 0;
  const mixPct =
    f(d.mixMetaP) > 0 ? Math.min((f(d.mixReal) / f(d.mixMetaP)) * 100, 100) : 0;
  const tmPct = f(d.tmPct);
  const tot = resultadoPonderado(d, "parcial");
  return `<div class="rel">
    <div class="hd"><div class="hd-left">${marcaRelatorioHTML()}<h1>Relatório Individual de Desempenho</h1><h2>${d.nome} · ${mes}</h2></div><div class="hd-right"><strong>Referência: ${periodo}</strong> <!-- <div class="rank-pill">🏆 ${d.ranking}º lugar no ranking</div> --> </div></div>
    <div class="sec">Resumo do Desempenho</div>
    <div class="top-cards">
      <!--<div class="tc tc-azul"><div class="lbl">Posição</div><div class="val c-azul">${d.ranking}º</div><div class="sub">ranking</div></div> -->
      <div class="tc tc-kpi ${ppTc}"><div class="lbl">Perf. Parcial</div><div class="val ${ppCls}">${pp}%</div><div class="sub">${d.perfParcialManual ? "Ajuste manual" : "Calculada pelos indicadores"} · ${periodo}</div></div>
      <div class="tc tc-kpi ${pmTc}"><div class="lbl">Perf. Mensal</div><div class="val ${pmCls}">${pm}%</div><div class="sub">${d.perfMensalManual ? "Ajuste manual" : "Calculada pelos indicadores"} · ${mes}</div></div>
      <div class="tc tc-kpi tc-kpi-score"><div class="lbl">Resultado ponderado</div><div class="val">${tot}</div><div class="sub">de 100 pts</div></div>
    </div>
    <div class="sec">Indicadores — Parcial</div>
    <table>
      <thead><tr><th>Indicador</th><th class="tr">Meta</th><th class="tr">Realizado</th><th class="tc2">%</th><th class="tc2">Peso</th><th style="width:140px">Progresso</th><th class="tc2">Resultado</th></tr></thead>
      <tbody>
        <tr><td><strong>Novas Vendas</strong></td><td class="tr">${d.nvMetaP} Qtd</td><td class="tr">${d.nvReal} Qtd</td><td class="tc2">${nvPct.toFixed(0)}%</td><td class="tc2">5</td><td>${barHTML(nvPct)}</td><td class="tc2"><span class="badge ${badgeC(nvPct)}">${fmt(f(d.nvRes))}</span></td></tr>
        <tr><td><strong>Ticket Médio</strong></td><td class="tr">R$ ${fmt(f(d.tmMeta))}</td><td class="tr">R$ ${fmt(f(d.tmReal))}</td><td class="tc2">${tmPct.toFixed(0)}%</td><td class="tc2">10</td><td>${barHTML(tmPct)}</td><td class="tc2"><span class="badge ${badgeC(tmPct)}">${tmPct >= 100 ? "10,00" : fmt(tmPct / 10)}</span></td></tr>
        <tr><td><strong>Objetivo de Vendas</strong></td><td class="tr">R$ ${fmt(f(d.ovMetaP))}</td><td class="tr">R$ ${fmt(f(d.ovReal))}</td><td class="tc2">${ovPctP.toFixed(0)}%</td><td class="tc2">60</td><td>${barHTML(ovPctP)}</td><td class="tc2"><span class="badge ${badgeC(ovPctP)}">${fmt(f(d.ovRes))}</span></td></tr>
        <tr><td><strong>Positivação</strong></td><td class="tr">${d.posMetaP} Qtd</td><td class="tr">${d.posReal} Qtd</td><td class="tc2">${posPct.toFixed(0)}%</td><td class="tc2">15</td><td>${barHTML(posPct)}</td><td class="tc2"><span class="badge ${badgeC(posPct)}">${fmt(f(d.posRes))}</span></td></tr>
        <tr><td><strong>Mix de Produtos</strong></td><td class="tr">${d.mixMetaP} SKUs</td><td class="tr">${d.mixReal} SKUs</td><td class="tc2">${mixPct.toFixed(0)}%</td><td class="tc2">10</td><td>${barHTML(mixPct)}</td><td class="tc2"><span class="badge ${badgeC(mixPct)}">${fmt(f(d.mixRes))}</span></td></tr>
      </tbody>
      <tfoot><tr><td colspan="6"><strong>Resultado Total</strong></td><td class="tc2"><strong>${tot} pts</strong></td></tr></tfoot>
    </table>
    ${tabelaProjecaoParcial(d)}
    <div class="sec">Comparativo — Parcial vs Meta Mensal</div>
    <div class="comp-grid">
      <div class="comp-card"><div class="comp-title">📅 Parcial</div>
        <div class="comp-row"><span class="cl">Novas Vendas</span><span class="cv">${d.nvReal} / ${d.nvMetaP} ${f(d.nvReal) >= f(d.nvMetaP) ? "✓" : ""}</span></div>
        <div class="comp-row"><span class="cl">Ticket Médio</span><span class="cv">R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))} ${f(d.tmReal) >= f(d.tmMeta) ? "✓" : ""}</span></div>
        <div class="comp-row"><span class="cl">Obj. Vendas</span><span class="cv">R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMetaP))} ${f(d.ovReal) >= f(d.ovMetaP) ? "✓" : ""}</span></div>
        <div class="comp-row"><span class="cl">Positivação</span><span class="cv">${d.posReal} / ${d.posMetaP} ${f(d.posReal) >= f(d.posMetaP) ? "✓" : ""}</span></div>
        <div class="comp-row"><span class="cl">Mix de Produtos</span><span class="cv">${d.mixReal} / ${d.mixMetaP} SKUs ${f(d.mixReal) >= f(d.mixMetaP) ? "✓" : ""}</span></div>
      </div>
      <div class="comp-card"><div class="comp-title">🗓 Meta Mensal</div>
        <div class="comp-row"><span class="cl">Novas Vendas</span><span class="cv ${f(d.nvReal) >= f(d.nvMetaM) ? "c-verde" : "c-baixa"}">${d.nvReal} / ${d.nvMetaM} ${f(d.nvMetaM) - f(d.nvReal) > 0 ? "— faltam " + (f(d.nvMetaM) - f(d.nvReal)).toFixed(0) : "✓"}</span></div>
        <div class="comp-row"><span class="cl">Ticket Médio</span><span class="cv ${f(d.tmReal) >= f(d.tmMeta) ? "c-verde" : "c-media"}">R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))} ${f(d.tmReal) >= f(d.tmMeta) ? "✓" : "— faltam R$ " + fmt(f(d.tmMeta) - f(d.tmReal))}</span></div>
        <div class="comp-row"><span class="cl">Obj. Vendas</span><span class="cv ${f(d.ovReal) >= f(d.ovMetaM) ? "c-verde" : "c-baixa"}">R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMetaM))} (${ovPctM.toFixed(0)}%) ${f(d.ovMetaM) - f(d.ovReal) > 0 ? "— faltam R$ " + fmt(f(d.ovMetaM) - f(d.ovReal)) : "✓"}</span></div>
        <div class="comp-row"><span class="cl">Positivação</span><span class="cv ${f(d.posReal) >= f(d.posMetaM) ? "c-verde" : "c-media"}">${d.posReal} / ${d.posMetaM} ${f(d.posMetaM) - f(d.posReal) > 0 ? "— faltam " + (f(d.posMetaM) - f(d.posReal)).toFixed(0) : "✓"}</span></div>
        <div class="comp-row"><span class="cl">Mix de Produtos</span><span class="cv ${f(d.mixReal) >= f(d.mixMetaM) ? "c-verde" : "c-media"}">${d.mixReal} / ${d.mixMetaM} SKUs ${f(d.mixMetaM) - f(d.mixReal) > 0 ? "— faltam " + (f(d.mixMetaM) - f(d.mixReal)).toFixed(0) : "✓"}</span></div>
      </div>
      
    </div>
    <div class="sec">Comparativo com o fechamento anterior</div>
    ${tabelaHistoricoHTML(d, "parcial")}
    <div class="sec">⚡ Prioridades até o fim do mês</div>
    <div class="prior-box">${priorParcial(d)}</div>
    ${explicacaoIndicadoresHTML()}
    <div class="ft"><span>Relatório Individual · ${d.nome} · ${mes}</span><span>Confidencial · Diretoria Comercial</span></div>
  </div>`;
}

/* ============ RELATÓRIO FECHAMENTO ============ */
function relFechamento(d) {
  calcFechamento(d);
  const mes = rotuloMes(document.getElementById("mesInput").value);
  const periodo = `${mes} completo`;
  const pm = f(d.perfMensal);
  const [pmCls, pmLbl, pmTc] = perfClass(pm);
  const nvOk = f(d.nvReal) >= f(d.nvMeta),
    tmOk = f(d.tmReal) >= f(d.tmMeta),
    ovOk = f(d.ovReal) >= f(d.ovMeta),
    posOk = f(d.posReal) >= f(d.posMeta),
    mixOk = f(d.mixReal) >= f(d.mixMeta);
  const bat = [nvOk, tmOk, ovOk, posOk, mixOk].filter(Boolean).length;
  const tot =
    Math.round(
      (f(d.nvRes) + f(d.tmRes) + f(d.ovRes) + f(d.posRes) + f(d.mixRes)) * 100,
    ) / 100;
  const okI = [],
    failI = [];
  if (nvOk)
    okI.push(
      `<div class="resumo-item"><span>Novas Vendas</span><strong>${d.nvReal} / ${d.nvMeta}</strong></div>`,
    );
  else
    failI.push(
      `<div class="resumo-item"><span>Novas Vendas</span><strong>${d.nvReal} / ${d.nvMeta} (faltaram ${(f(d.nvMeta) - f(d.nvReal)).toFixed(0)})</strong></div>`,
    );
  if (tmOk)
    okI.push(
      `<div class="resumo-item"><span>Ticket Médio</span><strong>R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))}</strong></div>`,
    );
  else
    failI.push(
      `<div class="resumo-item"><span>Ticket Médio</span><strong>R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))} (faltaram R$ ${fmt(f(d.tmMeta) - f(d.tmReal))})</strong></div>`,
    );
  if (ovOk)
    okI.push(
      `<div class="resumo-item"><span>Obj. de Vendas</span><strong>R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMeta))}</strong></div>`,
    );
  else
    failI.push(
      `<div class="resumo-item"><span>Obj. de Vendas</span><strong>R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMeta))} (faltaram R$ ${fmt(f(d.ovMeta) - f(d.ovReal))})</strong></div>`,
    );
  if (posOk)
    okI.push(
      `<div class="resumo-item"><span>Positivação</span><strong>${d.posReal} / ${d.posMeta}</strong></div>`,
    );
  else
    failI.push(
      `<div class="resumo-item"><span>Positivação</span><strong>${d.posReal} / ${d.posMeta} (faltaram ${(f(d.posMeta) - f(d.posReal)).toFixed(0)})</strong></div>`,
    );
  if (mixOk)
    okI.push(
      `<div class="resumo-item"><span>Mix de Produtos</span><strong>${d.mixReal} / ${d.mixMeta} SKUs</strong></div>`,
    );
  else
    failI.push(
      `<div class="resumo-item"><span>Mix de Produtos</span><strong>${d.mixReal} / ${d.mixMeta} SKUs (faltaram ${(f(d.mixMeta) - f(d.mixReal)).toFixed(0)})</strong></div>`,
    );
  return `<div class="rel">
    <div class="hd"><div class="hd-left">${marcaRelatorioHTML()}<h1>Relatório de Fechamento do Mês</h1><h2>${d.nome} · ${mes}</h2></div><div class="hd-right"><strong>Período: ${periodo}</strong> <!-- <div class="rank-pill">🏆 ${d.ranking}º lugar no ranking</div> --> </div></div>
    <div class="sec">Visão Geral</div>
    <div class="top-cards">
      
      <!-- <div class="tc tc-azul"><div class="lbl">Posição</div><div class="val c-azul">${d.ranking}º</div><div class="sub">ranking</div></div> -->
      <div class="tc tc-kpi ${pmTc}"><div class="lbl">Performance Final</div><div class="val ${pmCls}">${pm}%</div><div class="sub">${d.perfMensalManual ? "Ajuste manual" : "Calculada pelos indicadores"} · ${mes}</div></div>
      <div class="tc tc-kpi tc-kpi-score"><div class="lbl">Resultado ponderado</div><div class="val">${tot}</div><div class="sub">de 100 pts</div></div>
      <div class="tc tc-kpi tc-kpi-target ${bat === 5 ? "tc-verde" : bat === 0 ? "tc-baixa" : "tc-media"}"><div class="lbl">Metas Batidas</div><div class="val ${bat === 5 ? "c-verde" : bat === 0 ? "c-baixa" : "c-media"}">${bat}/5</div><div class="sub">indicadores</div></div>
    </div>
    <div class="sec">Performance Final</div>
    <div class="perf-row"><div class="perf-card ${pmTc}" style="grid-column:1/-1"><div class="p-lbl ${pmCls}">Performance Mensal — Fechamento</div><div class="p-num ${pmCls}">${pm}%</div><div class="p-status ${pmCls}">● ${pmLbl}</div><div class="p-ref">${d.perfMensalManual ? "Ajuste manual" : "Calculada pelos indicadores"} · ${mes} (mês encerrado)</div></div></div>
    <div class="sec">Indicadores — Resultado Final</div>
    <table>
      <thead><tr><th>Indicador</th><th class="tr">Meta</th><th class="tr">Realizado</th><th class="tc2">Status</th><th class="tc2">Peso</th><th class="tc2">Resultado</th></tr></thead>
      <tbody>
        <tr><td><strong>Novas Vendas</strong></td><td class="tr">${d.nvMeta} Qtd</td><td class="tr">${d.nvReal} Qtd</td><td class="tc2">${statusPill(nvOk)}</td><td class="tc2">5</td><td class="tc2"><span class="badge ${nvOk ? "b-green" : "b-red"}">${fmt(f(d.nvRes))}</span></td></tr>
        <tr><td><strong>Ticket Médio</strong></td><td class="tr">R$ ${fmt(f(d.tmMeta))}</td><td class="tr">R$ ${fmt(f(d.tmReal))}</td><td class="tc2">${statusPill(tmOk)}</td><td class="tc2">10</td><td class="tc2"><span class="badge ${tmOk ? "b-green" : "b-red"}">${fmt(f(d.tmRes))}</span></td></tr>
        <tr><td><strong>Objetivo de Vendas</strong></td><td class="tr">R$ ${fmt(f(d.ovMeta))}</td><td class="tr">R$ ${fmt(f(d.ovReal))}</td><td class="tc2">${statusPill(ovOk)}</td><td class="tc2">60</td><td class="tc2"><span class="badge ${ovOk ? "b-green" : "b-red"}">${fmt(f(d.ovRes))}</span></td></tr>
        <tr><td><strong>Positivação</strong></td><td class="tr">${d.posMeta} Qtd</td><td class="tr">${d.posReal} Qtd</td><td class="tc2">${statusPill(posOk)}</td><td class="tc2">15</td><td class="tc2"><span class="badge ${posOk ? "b-green" : "b-red"}">${fmt(f(d.posRes))}</span></td></tr>
        <tr><td><strong>Mix de Produtos</strong></td><td class="tr">${d.mixMeta} SKUs</td><td class="tr">${d.mixReal} SKUs</td><td class="tc2">${statusPill(mixOk)}</td><td class="tc2">10</td><td class="tc2"><span class="badge ${mixOk ? "b-green" : "b-red"}">${fmt(f(d.mixRes))}</span></td></tr>
      </tbody>
      <tfoot><tr><td colspan="5"><strong>Resultado Total</strong></td><td class="tc2"><strong>${tot} pts</strong></td></tr></tfoot>
    </table>
    <div class="sec">Resumo do Mês</div>
    <div class="resumo-grid">
      <div class="resumo-card ok"><div class="rc-title">✅ Metas Batidas (${okI.length})</div>${okI.length ? okI.join("") : '<div class="resumo-item">Nenhuma meta batida</div>'}</div>
      <div class="resumo-card fail"><div class="rc-title">⚠️ Não Batidas (${failI.length})</div>${failI.length ? failI.join("") : '<div class="resumo-item">Todas as metas foram batidas! 🎉</div>'}</div>
    </div>
    <div class="sec">Comparativo com o fechamento anterior</div>
    ${tabelaHistoricoHTML(d, "fechamento")}
    <div class="sec">🎯 Ações Recomendadas para o Próximo Mês</div>
    <div class="prior-box">${acoesAuto(d)}</div>
    ${explicacaoIndicadoresHTML()}
    <div class="ft"><span>Relatório de Fechamento · ${d.nome} · ${mes}</span><span>Confidencial · Diretoria Comercial</span></div>
  </div>`;
}

function gerarRelatorio(d) {
  return modo === "parcial" ? relParcial(d) : relFechamento(d);
}

/* ============ GERAR / VISUALIZAR ============ */
function gerarTodos() {
  if (modo === "dashboard") return;
  if (modo === "parcial" && !validarPeriodoParcialUI()) return;
  const dados = modo === "parcial" ? dadosParcial : dadosFechamento;
  const validos = dados.filter((d) => d.nome && d.nome.trim());
  if (!validos.length) {
    alert("Adicione ao menos um representante com nome!");
    return;
  }
  if (!validarValoresRelatorio(validos, modo)) return;
  validos.forEach((d) =>
    modo === "parcial" ? calcParcial(d) : calcFechamento(d),
  );
  const list = document.getElementById("repList");
  list.innerHTML = "";
  validos.forEach((d, i) => {
    const pm = f(d.perfMensal),
      pp = modo === "parcial" ? f(d.perfParcial) : null;
    const [pmCls, pmLbl, pmTc] = perfClass(pm);
    const div = document.createElement("div");
    div.className = "rep-card-mini";
    let p2 =
      modo === "parcial"
        ? `<div class="rcm-pi ${perfClass(pp)[2]}"><div class="pl">Parcial</div><div class="pv ${perfClass(pp)[0]}">${pp}%</div><div class="ps ${perfClass(pp)[0]}">${perfClass(pp)[1]}</div></div>`
        : (() => {
            const nvOk = f(d.nvReal) >= f(d.nvMeta),
              tmOk = f(d.tmReal) >= f(d.tmMeta),
              ovOk = f(d.ovReal) >= f(d.ovMeta),
              posOk = f(d.posReal) >= f(d.posMeta),
              mixOk = f(d.mixReal) >= f(d.mixMeta);
            const bat = [nvOk, tmOk, ovOk, posOk, mixOk].filter(Boolean).length;
            const tc =
              bat === 5 ? "tc-verde" : bat === 0 ? "tc-baixa" : "tc-media";
            const vc =
              bat === 5 ? "c-verde" : bat === 0 ? "c-baixa" : "c-media";
            return `<div class="rcm-pi ${tc}"><div class="pl">Metas</div><div class="pv ${vc}">${bat}/5</div><div class="ps">batidas</div></div>`;
          })();
    const idx = dados.indexOf(d);
    div.innerHTML = `<div class="rcm-head"><span class="rcm-name">${d.nome}</span><span class="rcm-rank">${d.ranking}º</span></div>
      <div class="rcm-body"><div class="rcm-perf">${p2}<div class="rcm-pi ${pmTc}"><div class="pl">Mensal</div><div class="pv ${pmCls}">${pm}%</div><div class="ps ${pmCls}">${pmLbl}</div></div></div>
      <div class="rcm-actions"><button class="btn-view" onclick="verRel(${idx})">👁 Ver</button><button class="btn-print" onclick="imprimirRel(${idx})">🖨️ PDF</button></div></div>`;
    list.appendChild(div);
  });
  document.getElementById("resultsSection").style.display = "block";
  document.getElementById("resultsTitle").textContent =
    `${validos.length} relatório(s) gerado(s)`;
  document.getElementById("btnPrintAll").style.display = "block";
  document.getElementById("btnZipAll").style.display =
    modo === "fechamento" ? "block" : "none";
  document
    .getElementById("resultsSection")
    .scrollIntoView({ behavior: "smooth" });
}

function verRel(i) {
  const dados = modo === "parcial" ? dadosParcial : dadosFechamento;
  if (modo === "parcial" && !validarPeriodoParcialUI()) return;
  const html = gerarRelatorio(dados[i]);
  relAtual = html;
  relAtualNome = dados[i].nome;
  document.getElementById("modalTitle").textContent =
    `Relatório — ${dados[i].nome}`;
  document.getElementById("modalContent").innerHTML = html;
  document.getElementById("modalOverlay").classList.add("active");
}
function fecharModal() {
  document.getElementById("modalOverlay").classList.remove("active");
}
function closeModal(e) {
  if (e.target === document.getElementById("modalOverlay")) fecharModal();
}

/* ============ IMPRESSÃO ============ */
const printCSS = `*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#2c3e50;font-size:13px;}.rel{padding:30px;max-width:860px;margin:0 auto;}.hd{border-bottom:3px solid #1a3c6e;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end;}.hd-left h1{font-size:19px;color:#1a3c6e;font-weight:800;}.hd-left h2{font-size:12px;color:#888;font-weight:400;margin-top:3px;}.hd-right{text-align:right;font-size:11px;color:#aaa;}.hd-right strong{display:block;color:#444;font-size:12px;}.rank-pill{display:inline-block;background:#1a3c6e;color:#fff;border-radius:30px;padding:4px 14px;font-size:11px;font-weight:700;margin-top:5px;}.sec{font-size:11px;font-weight:700;color:#1a3c6e;text-transform:uppercase;letter-spacing:1px;margin:22px 0 11px;border-left:4px solid #1a3c6e;padding-left:9px;}.top-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}.tc{border-radius:10px;padding:13px;text-align:center;}.tc .lbl{font-size:10px;color:#888;text-transform:uppercase;margin-bottom:5px;}.tc .val{font-size:20px;font-weight:800;}.tc .sub{font-size:10px;color:#aaa;margin-top:2px;}.tc-azul{background:#eef3fb;border:1px solid #c5d5ee;}.tc-verde{background:#eafaf1;border:1px solid #a9dfbf;}.tc-media{background:#fef9e7;border:1px solid #f9e79f;}.tc-baixa{background:#fdf2f2;border:1px solid #f5b7b1;}.c-azul{color:#1a3c6e;}.c-verde{color:#27ae60;}.c-media{color:#e67e22;}.c-baixa{color:#e74c3c;}.perf-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}.perf-card{border-radius:10px;padding:18px;}.p-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;}.p-num{font-size:34px;font-weight:800;line-height:1;}.p-status{font-size:11px;font-weight:700;margin-top:4px;}.p-ref{font-size:10px;color:#bbb;margin-top:3px;}table{width:100%;border-collapse:collapse;font-size:12px;}thead tr{background:#1a3c6e;color:#fff;}thead th{padding:8px 10px;text-align:left;font-size:11px;font-weight:600;}tbody tr:nth-child(even){background:#f7f9fc;}tbody td{padding:8px 10px;border-bottom:1px solid #eee;vertical-align:middle;}tfoot td{padding:9px 10px;font-weight:700;background:#e8edf5;border-top:2px solid #1a3c6e;}.tr{text-align:right;}.tc2{text-align:center;}.badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;color:#fff;}.b-green{background:#27ae60;}.b-orange{background:#e67e22;}.b-red{background:#e74c3c;}.bar-w{display:flex;align-items:center;gap:6px;}.bar-bg{flex:1;height:8px;background:#eee;border-radius:10px;overflow:hidden;}.bar-f{height:8px;border-radius:10px;}.bg-g{background:#27ae60;}.bg-o{background:#e67e22;}.bg-r{background:#e74c3c;}.bp{font-size:11px;font-weight:800;min-width:32px;text-align:right;}.comp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}.comp-card{border-radius:10px;padding:13px;border:1px solid #e0e6f0;}.comp-title{font-size:11px;font-weight:700;color:#1a3c6e;margin-bottom:9px;text-transform:uppercase;}.comp-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f5f5f5;font-size:11px;}.comp-row:last-child{border-bottom:none;}.cl{color:#888;}.cv{font-weight:600;}.prior-box{background:#fafbfc;border-radius:10px;border:1px solid #e0e6f0;padding:13px 17px;}.pi{display:flex;gap:9px;align-items:flex-start;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#444;line-height:1.45;}.pi:last-child{border-bottom:none;}.pdot{width:9px;height:9px;border-radius:50%;flex-shrink:0;margin-top:4px;}.d-r{background:#e74c3c;}.d-o{background:#e67e22;}.d-g{background:#27ae60;}.resumo-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.resumo-card{border-radius:10px;padding:16px;}.resumo-card.ok{background:#eafaf1;border:1px solid #a9dfbf;}.resumo-card.fail{background:#fdf2f2;border:1px solid #f5b7b1;}.resumo-card .rc-title{font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;}.resumo-card.ok .rc-title{color:#1e8449;}.resumo-card.fail .rc-title{color:#c0392b;}.resumo-item{font-size:12px;padding:5px 0;border-bottom:1px solid rgba(0,0,0,.05);display:flex;justify-content:space-between;}.resumo-item:last-child{border-bottom:none;}.status-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}.status-ok{background:#eafaf1;color:#27ae60;}.status-fail{background:#fdf2f2;color:#e74c3c;}.ft{margin-top:28px;padding-top:12px;border-top:1px solid #eee;font-size:11px;color:#bbb;display:flex;justify-content:space-between;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}`;
const historyPrintCSS = `.history-comparison{overflow-x:auto;border:1px solid #cfd8e3;border-top:4px solid #27ae60;border-radius:10px;background:#fff;padding:12px;margin-top:8px}.history-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px}.history-heading strong{font-size:13px;color:#1a3c6e;text-transform:uppercase}.history-heading p{font-size:10px;color:#777;margin:3px 0 0}.history-comparison table{min-width:560px;width:100%;border-collapse:collapse;font-size:11px}.history-comparison th,.history-comparison td{padding:8px 9px;border-bottom:1px solid #e7edf2;text-align:right}.history-comparison th:first-child,.history-comparison td:first-child{text-align:left}.history-comparison thead th{background:#edf2f7;color:#40566d}.history-comparison thead .history-current-head{background:#1e8449;color:#fff}.history-comparison .history-current-cell{background:#f0faf4;font-weight:700;color:#1e6640}.history-comparison .history-result-row td{border-top:2px solid #cfe8d8;border-bottom:0;font-weight:800;background:#eaf7ef}.history-change{display:inline-block;min-width:68px;padding:4px 9px;border-radius:20px;text-align:center;font-weight:800}.history-positive{color:#167443;background:#dff3e7}.history-negative{color:#b83227;background:#fde6e3}.history-neutral,.history-unavailable{color:#586779;background:#edf1f5}.history-dashboard-note{font-size:12px;color:#777;padding:12px;background:#f8fafc;border:1px solid #e0e6f0;border-radius:8px;margin-bottom:10px}`;
const comparisonPrintCSS = `.history-comparison{overflow:visible;break-inside:avoid;page-break-inside:avoid;padding:14px;border-top-width:5px;-webkit-print-color-adjust:exact;print-color-adjust:exact}.history-heading{display:block;margin-bottom:12px}.history-heading strong{font-size:15px}.history-heading p{font-size:12px;line-height:1.4;margin-top:4px}.history-comparison table{width:100%;min-width:0;table-layout:fixed;font-size:12px}.history-comparison thead{display:table-header-group}.history-comparison th,.history-comparison td{font-size:12px;line-height:1.35;padding:9px 10px;vertical-align:middle}.history-comparison th:nth-child(1),.history-comparison td:nth-child(1){width:30%}.history-comparison th:nth-child(2),.history-comparison td:nth-child(2){width:22%}.history-comparison th:nth-child(3),.history-comparison td:nth-child(3){width:28%}.history-comparison th:nth-child(4),.history-comparison td:nth-child(4){width:20%}.history-comparison tbody tr{break-inside:avoid;page-break-inside:avoid}.history-comparison .history-current-cell{font-size:12px}.history-comparison .history-result-row td{font-size:13px}.history-change{min-width:76px;padding:5px 9px;font-size:12px;line-height:1.25;border:1px solid currentColor}.history-positive{color:#145f38;background:#d8efdf}.history-negative{color:#a62920;background:#fbdedb}.history-neutral,.history-unavailable{color:#445367;background:#e7edf3}`;
const brandPrintCSS = `.report-brand{display:flex;align-items:center;gap:9px;margin-bottom:7px;color:#1a3c6e;font-size:12px;font-weight:700}.report-brand img{width:38px;height:38px;object-fit:contain}.rel .top-cards{grid-template-columns:repeat(3,minmax(0,1fr))}.rel .tc-kpi{min-height:94px;display:flex;flex-direction:column;justify-content:center;border-top:3px solid #1a3c6e}.rel .tc-kpi .lbl{font-size:10px;color:#586779;font-weight:700}.rel .tc-kpi .val{font-size:27px;line-height:1.15}.rel .tc-kpi .sub{font-size:10px;color:#66788a}.rel .tc-kpi-score{background:#17345d;border:1px solid #17345d;border-top:3px solid #27ae60}.rel .tc-kpi-score .lbl,.rel .tc-kpi-score .sub{color:#d7e3f2}.rel .tc-kpi-score .val{color:#fff;font-size:30px}.rel .tc-kpi-target .val{font-size:30px}@media(max-width:620px){.rel .hd{align-items:flex-start;flex-direction:column;gap:10px}.rel .top-cards{grid-template-columns:1fr}.rel .hd-right{text-align:left}}`;
const trendPrintCSS = `.history-change{display:inline-flex;align-items:center;justify-content:center;gap:5px}.history-arrow{font-size:15px;font-weight:900;line-height:1}.history-positive .history-arrow{color:#145f38}.history-negative .history-arrow{color:#a62920}.history-neutral .history-arrow{color:#445367}.history-unavailable .history-arrow{color:#777}`;
const indicatorPrintCSS = `.indicator-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 11px}.indicator-item{break-inside:avoid;page-break-inside:avoid;border:1px solid #cbd5df;border-left:3px solid #1e8449;border-radius:6px;padding:8px 10px;background:#fff}.indicator-heading{display:flex;justify-content:space-between;align-items:center;gap:8px;color:#17345d;font-size:12px;padding-bottom:5px;margin-bottom:4px;border-bottom:1px solid #e7edf2}.indicator-heading span{color:#1e6640;background:#eaf7ef;border-radius:10px;padding:2px 7px;font-size:10px;font-weight:700;white-space:nowrap}.indicator-item p{font-size:11px;color:#4d5c6b;line-height:1.3;margin-top:3px}.indicator-item p strong{color:#34495e}.indicator-note{font-size:10px;color:#536273;line-height:1.35;margin-top:7px}`;
const reportThemeCSS = `.rel{font-family:'Aptos','Segoe UI Variable','Segoe UI',Arial,sans-serif;color:#3f3f3f;line-height:1.5;background:#fefdf4;-webkit-print-color-adjust:exact;print-color-adjust:exact}.rel .hd{border-bottom-color:#f8a815}.report-brand,.rel .hd-left h1{color:#83171b}.rel .hd-left h2{color:#696969}.rel .hd-right{color:#696969}.rel .hd-right strong{color:#3f3f3f}.rel .sec{color:#83171b;border-left-color:#f8a815;letter-spacing:.8px}.rel .tc-kpi{border-top-color:#f8a815}.rel .tc-kpi-score{background:#83171b;border-color:#83171b;border-top-color:#f8a815}.rel .tc-kpi-score .lbl,.rel .tc-kpi-score .sub{color:#fefdf4}.rel .tc-kpi .lbl{color:#3f3f3f}.rel .tc-kpi .sub{color:#696969}.rel .tc-verde{background:#f5e9e4;border-color:#d7b5b2}.rel .tc-media{background:#fff4d9;border-color:#f8a815}.rel .tc-baixa{background:#f8e7e6;border-color:#c11f1f}.rel .c-azul{color:#83171b}.rel .c-verde{color:#83171b}.rel .c-media{color:#8a5a00}.rel .c-baixa{color:#c11f1f}.rel thead tr{background:#3f3f3f}.rel tbody tr:nth-child(even){background:#f7f5eb}.rel tbody td{border-bottom-color:#e8e3d6}.rel tfoot td{background:#f3eedc;border-top-color:#f8a815}.rel .b-green{background:#83171b}.rel .b-orange{background:#b87800}.rel .b-red{background:#c11f1f}.rel .bg-g{background:linear-gradient(90deg,#83171b,#c11f1f)}.rel .bg-o{background:linear-gradient(90deg,#d48b00,#f8a815)}.rel .bg-r{background:linear-gradient(90deg,#83171b,#c11f1f)}.rel .comp-card{border-color:#e5ddca;background:#fefdf4}.rel .comp-title,.history-heading strong{color:#83171b}.history-comparison{border-color:#e5ddca;border-top-color:#f8a815;background:#fefdf4}.history-comparison thead th{background:#f3eedc;color:#3f3f3f}.history-comparison thead .history-current-head{background:#83171b}.history-comparison .history-current-cell{background:#fff4d9;color:#83171b}.history-comparison .history-result-row td{border-top-color:#e8d49f;background:#fff4d9}.history-positive{color:#83171b;background:#f5e9e4}.history-negative{color:#a21919;background:#f8e7e6}.history-neutral,.history-unavailable{color:#696969;background:#f1efe7}.rel .prior-box{background:#f8f6ed;border-color:#e5ddca}.rel .d-g{background:#83171b}.rel .d-o{background:#f8a815}.rel .d-r{background:#c11f1f}.rel .resumo-card.ok{background:#f5e9e4;border-color:#d7b5b2}.rel .resumo-card.fail{background:#f8e7e6;border-color:#c11f1f}.rel .resumo-card.ok .rc-title{color:#83171b}.rel .resumo-card.fail .rc-title{color:#a21919}.rel .indicator-item{border-color:#e5ddca;border-left-color:#f8a815;box-shadow:0 2px 6px rgba(63,63,63,.08);background:#fefdf4}.rel .indicator-heading{color:#83171b;border-bottom-color:#e8e3d6}.rel .indicator-heading span{color:#83171b;background:#fff4d9}.rel .indicator-item p,.rel .indicator-note{color:#696969}.rel .indicator-item p strong{color:#3f3f3f}.rel .status-ok{background:#f5e9e4;color:#83171b}.rel .status-fail{background:#f8e7e6;color:#c11f1f}.rel .ft{border-top-color:#e5ddca;color:#696969}`;
const projectionPrintCSS = `.projection-summary{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:14px;padding:14px 16px;margin-bottom:10px;border:1px solid #f8a815;border-left:4px solid #f8a815;border-radius:9px;background:#fff4d9;break-inside:avoid;page-break-inside:avoid}.projection-summary div{display:flex;flex-direction:column;gap:3px;color:#696969;font-size:10px;text-transform:uppercase;font-weight:700}.projection-summary strong{color:#83171b;font-size:25px;line-height:1.1}.projection-summary p{color:#3f3f3f;font-size:11px;line-height:1.45}.projection-table{margin-bottom:8px}.projection-table th{white-space:normal}`;
function printHTML(html, nome) {
  const win = window.open("", "_blank");
  win.document.write(
    `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório Individual - ${nome}</title><style>${printCSS}${historyPrintCSS}${brandPrintCSS}${comparisonPrintCSS}${trendPrintCSS}${indicatorPrintCSS}${reportThemeCSS}${projectionPrintCSS}</style></head><body>${html}</body></html>`,
  );
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 600);
}
function imprimirAtual() {
  if (relAtual) printHTML(relAtual, relAtualNome || "Relatorio");
}
function imprimirRel(i) {
  if (modo === "parcial" && !validarPeriodoParcialUI()) return;
  const d = (modo === "parcial" ? dadosParcial : dadosFechamento)[i];
  printHTML(gerarRelatorio(d), d.nome);
}
function imprimirTodos() {
  if (modo === "parcial" && !validarPeriodoParcialUI()) return;
  const dados = modo === "parcial" ? dadosParcial : dadosFechamento;
  let h = "";
  dados
    .filter((d) => d.nome)
    .forEach((d, i) => {
      h +=
        gerarRelatorio(d) +
        (i < dados.length - 1
          ? '<div style="page-break-after:always"></div>'
          : "");
    });
  printHTML(h, "Relatorios_Lote");
}

/* ============ ZIP ============ */
async function baixarZip() {
  if (modo !== "fechamento") return;
  const zip = new JSZip();
  const mes = document.getElementById("mesInput").value;
  dadosFechamento
    .filter((d) => d.nome && d.nome.trim())
    .forEach((d) => {
      const nome = `Relatório Individual - ${d.nome.replace(/[\/\\:*?"<>|]/g, "_")}`;
      zip.file(
        `${nome}.html`,
        `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${nome}</title><style>${printCSS}${historyPrintCSS}${brandPrintCSS}${comparisonPrintCSS}${trendPrintCSS}${indicatorPrintCSS}${reportThemeCSS}${projectionPrintCSS}</style></head><body>${relFechamento(d)}</body></html>`,
      );
    });
  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Relatorios_Fechamento_${mes.replace(/ /g, "_")}.zip`;
  a.click();
}
