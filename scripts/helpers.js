import { PESOS_INDICADORES } from "./state.js";

export const converterParaFloat = valor =>
  parseFloat(((valor !== null && valor !== undefined) ? valor : "").toString().replace(",", ".")) || 0;

export const formatarMoeda = valor =>
  Number(valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function obterClassePerformance(percentual) {
  return percentual >= 90
    ? ["c-verde", "ALTA", "tc-verde"]
    : percentual >= 50
    ? ["c-media", "MÉDIA", "tc-media"]
    : ["c-baixa", "BAIXA", "tc-baixa"];
}
export function obterCorBadge(percentual) {
  return percentual >= 90 ? "b-green" : percentual >= 50 ? "b-orange" : "b-red";
}
export function obterCorBarra(percentual) {
  return percentual >= 90 ? "bg-g" : percentual >= 50 ? "bg-o" : "bg-r";
}
export function obterCorTexto(percentual) {
  return percentual >= 90 ? "c-verde" : percentual >= 50 ? "c-media" : "c-baixa";
}
export function obterCorHex(percentual) {
  return percentual >= 90 ? "#27ae60" : percentual >= 50 ? "#e67e22" : "#e74c3c";
}
export function gerarHTMLBarra(percentual) {
  const largura = Math.min(Math.max(percentual, 1), 100);
  return `<div class="bar-w"><div class="bar-bg"><div class="bar-f ${obterCorBarra(percentual)}" style="width:${largura}%"></div></div><span class="bp ${obterCorTexto(percentual)}">${percentual.toFixed(0)}%</span></div>`;
}
export function gerarPilulaStatus(metaBatida) {
  return metaBatida
    ? `<span class="status-pill status-ok">✓ Meta Batida</span>`
    : `<span class="status-pill status-fail">✕ Não Batida</span>`;
}

export function calcularResultadosParcial(representante) {
  const nvPct = converterParaFloat(representante.nvMetaP) > 0
    ? Math.min(converterParaFloat(representante.nvReal) / converterParaFloat(representante.nvMetaP) * 100, 100)
    : 0;
  representante.nvRes = (nvPct / 100 * PESOS_INDICADORES.nv).toFixed(2);

  const tmPct = converterParaFloat(representante.tmMeta) > 0
    ? Math.min(converterParaFloat(representante.tmReal) / converterParaFloat(representante.tmMeta) * 100, 100)
    : 0;
  representante.tmPct = tmPct.toFixed(2);

  const ovPct = converterParaFloat(representante.ovMetaP) > 0
    ? Math.min(converterParaFloat(representante.ovReal) / converterParaFloat(representante.ovMetaP) * 100, 100)
    : 0;
  representante.ovRes = (ovPct / 100 * PESOS_INDICADORES.ov).toFixed(2);

  const posPct = converterParaFloat(representante.posMetaP) > 0
    ? Math.min(converterParaFloat(representante.posReal) / converterParaFloat(representante.posMetaP) * 100, 100)
    : 0;
  representante.posRes = (posPct / 100 * PESOS_INDICADORES.pos).toFixed(2);

  const mixPct = converterParaFloat(representante.mixMetaP) > 0
    ? Math.min(converterParaFloat(representante.mixReal) / converterParaFloat(representante.mixMetaP) * 100, 100)
    : 0;
  representante.mixRes = (mixPct / 100 * PESOS_INDICADORES.mix).toFixed(2);
}

export function calcularResultadosFechamento(representante) {
  const nvPct = converterParaFloat(representante.nvMeta) > 0
    ? Math.min(converterParaFloat(representante.nvReal) / converterParaFloat(representante.nvMeta) * 100, 100)
    : 0;
  representante.nvRes = (nvPct / 100 * PESOS_INDICADORES.nv).toFixed(2);

  const tmPct = converterParaFloat(representante.tmMeta) > 0
    ? Math.min(converterParaFloat(representante.tmReal) / converterParaFloat(representante.tmMeta) * 100, 100)
    : 0;
  representante.tmRes = (tmPct / 100 * PESOS_INDICADORES.tm).toFixed(2);

  const ovPct = converterParaFloat(representante.ovMeta) > 0
    ? Math.min(converterParaFloat(representante.ovReal) / converterParaFloat(representante.ovMeta) * 100, 100)
    : 0;
  representante.ovRes = (ovPct / 100 * PESOS_INDICADORES.ov).toFixed(2);

  const posPct = converterParaFloat(representante.posMeta) > 0
    ? Math.min(converterParaFloat(representante.posReal) / converterParaFloat(representante.posMeta) * 100, 100)
    : 0;
  representante.posRes = (posPct / 100 * PESOS_INDICADORES.pos).toFixed(2);

  const mixPct = converterParaFloat(representante.mixMeta) > 0
    ? Math.min(converterParaFloat(representante.mixReal) / converterParaFloat(representante.mixMeta) * 100, 100)
    : 0;
  representante.mixRes = (mixPct / 100 * PESOS_INDICADORES.mix).toFixed(2);
}

export function gerarHTMLAcoesRecomendadas(dados) {
  const itens = [];
  const ovFalta = converterParaFloat(dados.ovMeta) - converterParaFloat(dados.ovReal);
  if (ovFalta > 0) {
    const pct = converterParaFloat(dados.ovMeta) > 0 ? Math.round(converterParaFloat(dados.ovReal) / converterParaFloat(dados.ovMeta) * 100) : 0;
    itens.push({
      c: 'd-r',
      t: `<strong>Prioridade máxima:</strong> faturar mais <strong>R$ ${formatarMoeda(ovFalta)}</strong> para fechar Objetivo de Vendas (${pct}%) — maior peso (60 pts).`
    });
  }
  const posFalta = converterParaFloat(dados.posMeta) - converterParaFloat(dados.posReal);
  if (posFalta > 0) {
    itens.push({
      c: 'd-o',
      t: `Positivar mais <strong>${posFalta.toFixed(0)} clientes</strong> para atingir a meta de ${dados.posMeta}.`
    });
  }
  const tmFalta = converterParaFloat(dados.tmMeta) - converterParaFloat(dados.tmReal);
  if (tmFalta > 0) {
    itens.push({
      c: 'd-o',
      t: `Elevar Ticket Médio em <strong>R$ ${formatarMoeda(tmFalta)}</strong>, de R$ ${formatarMoeda(converterParaFloat(dados.tmReal))} para R$ ${formatarMoeda(converterParaFloat(dados.tmMeta))}.`
    });
  }
  const mixFalta = converterParaFloat(dados.mixMeta) - converterParaFloat(dados.mixReal);
  if (mixFalta > 0) {
    itens.push({
      c: 'd-o',
      t: `Ampliar Mix de Vendas em mais <strong>${mixFalta.toFixed(0)} SKUs</strong>.`
    });
  }
  const nvFalta = converterParaFloat(dados.nvMeta) - converterParaFloat(dados.nvReal);
  if (nvFalta > 0) {
    itens.push({
      c: converterParaFloat(dados.nvReal) === 0 ? 'd-r' : 'd-o',
      t: `Realizar mais <strong>${nvFalta.toFixed(0)} novas vendas</strong> para atingir a meta de ${dados.nvMeta}.`
    });
  }
  if (!itens.length) {
    itens.push({
      c: 'd-g',
      t: `Todas as metas batidas — <strong>manter o ritmo e consolidar os resultados</strong> no próximo período.`
    });
  }
  return itens.map(i => `<div class="pi"><div class="pdot ${i.c}"></div><span>${i.t}</span></div>`).join('');
}

export function gerarHTMLPrioridadesParcial(dados) {
  const itens = [];
  const nvFalta = converterParaFloat(dados.nvMetaM) - converterParaFloat(dados.nvReal);
  if (converterParaFloat(dados.nvReal) === 0) {
    itens.push({ c: 'd-r', t: `Realizar <strong>${nvFalta.toFixed(0)} novas vendas</strong> — zerado até agora.` });
  } else if (nvFalta > 0) {
    itens.push({ c: 'd-o', t: `Realizar mais <strong>${nvFalta.toFixed(0)} novas vendas</strong> para atingir meta mensal.` });
  }
  const ovFalta = converterParaFloat(dados.ovMetaM) - converterParaFloat(dados.ovReal);
  if (ovFalta > 0) {
    const pct = converterParaFloat(dados.ovMetaM) > 0 ? Math.round(converterParaFloat(dados.ovReal) / converterParaFloat(dados.ovMetaM) * 100) : 0;
    itens.push({
      c: pct < 50 ? 'd-r' : 'd-o',
      t: `Faturar mais <strong>R$ ${formatarMoeda(ovFalta)}</strong> para fechar Objetivo de Vendas (${pct}%).`
    });
  }
  const posFalta = converterParaFloat(dados.posMetaM) - converterParaFloat(dados.posReal);
  if (posFalta > 0) {
    itens.push({ c: 'd-o', t: `Positivar mais <strong>${posFalta.toFixed(0)} clientes</strong>.` });
  }
  const mixFalta = converterParaFloat(dados.mixMetaM) - converterParaFloat(dados.mixReal);
  if (mixFalta > 0) {
    itens.push({ c: 'd-o', t: `Ampliar Mix em mais <strong>${mixFalta.toFixed(0)} SKUs</strong>.` });
  }
  const tmFalta = converterParaFloat(dados.tmMeta) - converterParaFloat(dados.tmReal);
  if (tmFalta > 0) {
    itens.push({ c: 'd-o', t: `Elevar Ticket Médio de <strong>R$ ${formatarMoeda(converterParaFloat(dados.tmReal))}</strong> para <strong>R$ ${formatarMoeda(converterParaFloat(dados.tmMeta))}</strong>.` });
  }
  if (!itens.length) {
    itens.push({ c: 'd-g', t: `Todos os indicadores mensais atingidos — <strong>excelente performance!</strong>` });
  }
  return itens.map(i => `<div class="pi"><div class="pdot ${i.c}"></div><span>${i.t}</span></div>`).join('');
}
