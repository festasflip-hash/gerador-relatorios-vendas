import {
  converterParaFloat,
  formatarMoeda,
  obterClassePerformance,
  obterCorBadge,
  gerarPilulaStatus,
  gerarHTMLAcoesRecomendadas
} from "./helpers.js";

export function gerarHTMLRelatorioFechamento(dados) {
  const periodo = document.getElementById("periodoInput").value;
  const mes = document.getElementById("mesInput").value;
  const pm = converterParaFloat(dados.perfMensal);
  const [pmCls, pmLbl, pmTc] = obterClassePerformance(pm);

  const nvOk = converterParaFloat(dados.nvReal) >= converterParaFloat(dados.nvMeta);
  const tmOk = converterParaFloat(dados.tmReal) >= converterParaFloat(dados.tmMeta);
  const ovOk = converterParaFloat(dados.ovReal) >= converterParaFloat(dados.ovMeta);
  const posOk = converterParaFloat(dados.posReal) >= converterParaFloat(dados.posMeta);
  const mixOk = converterParaFloat(dados.mixReal) >= converterParaFloat(dados.mixMeta);
  const bat = [nvOk, tmOk, ovOk, posOk, mixOk].filter(Boolean).length;
  const tot = Math.round((
    converterParaFloat(dados.nvRes) +
    converterParaFloat(dados.tmRes) +
    converterParaFloat(dados.ovRes) +
    converterParaFloat(dados.posRes) +
    converterParaFloat(dados.mixRes)
  ) * 100) / 100;

  const okItems = [];
  const failItems = [];

  function montarItem(label, valor, meta, falha, formatador) {
    if (!formatador) formatador = v => v;
    if (!falha) {
      okItems.push(`
        <div class="resumo-item">
          <span>${label}</span>
          <strong>${formatador(valor)} / ${formatador(meta)}</strong>
        </div>`);
    } else {
      failItems.push(`
        <div class="resumo-item">
          <span>${label}</span>
          <strong>${formatador(valor)} / ${formatador(meta)} (faltaram ${formatador(falha)})</strong>
        </div>`);
    }
  }

  montarItem(
    "Novas Vendas",
    dados.nvReal,
    dados.nvMeta,
    nvOk ? null : converterParaFloat(dados.nvMeta) - converterParaFloat(dados.nvReal)
  );

  montarItem(
    "Ticket Médio",
    `R$ ${formatarMoeda(converterParaFloat(dados.tmReal))}`,
    `R$ ${formatarMoeda(converterParaFloat(dados.tmMeta))}`,
    tmOk ? null : formatarMoeda(converterParaFloat(dados.tmMeta) - converterParaFloat(dados.tmReal)),
    v => v
  );

  montarItem(
    "Objetivo de Vendas",
    `R$ ${formatarMoeda(converterParaFloat(dados.ovReal))}`,
    `R$ ${formatarMoeda(converterParaFloat(dados.ovMeta))}`,
    ovOk ? null : formatarMoeda(converterParaFloat(dados.ovMeta) - converterParaFloat(dados.ovReal)),
    v => v
  );

  montarItem(
    "Positivação",
    dados.posReal,
    dados.posMeta,
    posOk ? null : converterParaFloat(dados.posMeta) - converterParaFloat(dados.posReal)
  );

  montarItem(
    "Mix de Vendas",
    `${dados.mixReal} SKUs`,
    `${dados.mixMeta} SKUs`,
    mixOk ? null : converterParaFloat(dados.mixMeta) - converterParaFloat(dados.mixReal),
    v => `${v} SKUs`
  );

  return `
    <div class="rel">
      <div class="hd">
        <div class="hd-left">
          <h1>Relatório de Fechamento do Mês</h1>
          <h2>${dados.nome} · ${mes}</h2>
        </div>
        <div class="hd-right">
          <strong>Período: ${periodo}</strong>
          <div class="rank-pill">🏆 ${dados.ranking}º lugar no ranking</div>
        </div>
      </div>
      <div class="sec">Visão Geral</div>
      <div class="top-cards">
        <div class="tc tc-azul">
          <div class="lbl">Posição</div>
          <div class="val c-azul">${dados.ranking}º</div>
          <div class="sub">ranking</div>
        </div>
        <div class="tc ${pmTc}">
          <div class="lbl">Performance Final</div>
          <div class="val ${pmCls}">${pm}%</div>
          <div class="sub">${mes}</div>
        </div>
        <div class="tc ${bat === 5 ? "tc-verde" : bat === 0 ? "tc-baixa" : "tc-media"}">
          <div class="lbl">Metas Batidas</div>
          <div class="val ${bat === 5 ? "c-verde" : bat === 0 ? "c-baixa" : "c-media"}">${bat}/5</div>
          <div class="sub">indicadores</div>
        </div>
        <div class="tc tc-azul">
          <div class="lbl">Resultado Total</div>
          <div class="val c-azul">${tot}</div>
          <div class="sub">de 100 pontos</div>
        </div>
      </div>
      <div class="sec">Performance Final</div>
      <div class="perf-row">
        <div class="perf-card ${pmTc}" style="grid-column:1/-1">
          <div class="p-lbl ${pmCls}">Performance Mensal — Fechamento</div>
          <div class="p-num ${pmCls}">${pm}%</div>
          <div class="p-status ${pmCls}">● ${pmLbl}</div>
          <div class="p-ref">${mes} (mês encerrado)</div>
        </div>
      </div>
      <div class="sec">Indicadores — Resultado Final</div>
      <table>
        <thead>
          <tr>
            <th>Indicador</th>
            <th class="tr">Meta</th>
            <th class="tr">Realizado</th>
            <th class="tc2">Status</th>
            <th class="tc2">Peso</th>
            <th class="tc2">Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Novas Vendas</strong></td>
            <td class="tr">${dados.nvMeta} Qtd</td>
            <td class="tr">${dados.nvReal} Qtd</td>
            <td class="tc2">${gerarPilulaStatus(nvOk)}</td>
            <td class="tc2">5</td>
            <td class="tc2"><span class="badge ${obterCorBadge(converterParaFloat(dados.nvReal) / Math.max(converterParaFloat(dados.nvMeta), 1) * 100)}">${formatarMoeda(converterParaFloat(dados.nvRes))}</span></td>
          </tr>
          <tr>
            <td><strong>Ticket Médio</strong></td>
            <td class="tr">R$ ${formatarMoeda(converterParaFloat(dados.tmMeta))}</td>
            <td class="tr">R$ ${formatarMoeda(converterParaFloat(dados.tmReal))}</td>
            <td class="tc2">${gerarPilulaStatus(tmOk)}</td>
            <td class="tc2">10</td>
            <td class="tc2"><span class="badge ${obterCorBadge(converterParaFloat(dados.tmReal) / Math.max(converterParaFloat(dados.tmMeta), 1) * 100)}">${formatarMoeda(converterParaFloat(dados.tmRes))}</span></td>
          </tr>
          <tr>
            <td><strong>Objetivo de Vendas</strong></td>
            <td class="tr">R$ ${formatarMoeda(converterParaFloat(dados.ovMeta))}</td>
            <td class="tr">R$ ${formatarMoeda(converterParaFloat(dados.ovReal))}</td>
            <td class="tc2">${gerarPilulaStatus(ovOk)}</td>
            <td class="tc2">60</td>
            <td class="tc2"><span class="badge ${obterCorBadge(converterParaFloat(dados.ovReal) / Math.max(converterParaFloat(dados.ovMeta), 1) * 100)}">${formatarMoeda(converterParaFloat(dados.ovRes))}</span></td>
          </tr>
          <tr>
            <td><strong>Positivação</strong></td>
            <td class="tr">${dados.posMeta} Qtd</td>
            <td class="tr">${dados.posReal} Qtd</td>
            <td class="tc2">${gerarPilulaStatus(posOk)}</td>
            <td class="tc2">15</td>
            <td class="tc2"><span class="badge ${obterCorBadge(converterParaFloat(dados.posReal) / Math.max(converterParaFloat(dados.posMeta), 1) * 100)}">${formatarMoeda(converterParaFloat(dados.posRes))}</span></td>
          </tr>
          <tr>
            <td><strong>Mix de Vendas</strong></td>
            <td class="tr">${dados.mixMeta} SKUs</td>
            <td class="tr">${dados.mixReal} SKUs</td>
            <td class="tc2">${gerarPilulaStatus(mixOk)}</td>
            <td class="tc2">10</td>
            <td class="tc2"><span class="badge ${obterCorBadge(converterParaFloat(dados.mixReal) / Math.max(converterParaFloat(dados.mixMeta), 1) * 100)}">${formatarMoeda(converterParaFloat(dados.mixRes))}</span></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5"><strong>Resultado Total</strong></td>
            <td class="tc2"><strong>${tot} pts</strong></td>
          </tr>
        </tfoot>
      </table>
      <div class="sec">Resumo do Mês</div>
      <div class="resumo-grid">
        <div class="resumo-card ok">
          <div class="rc-title">✅ Metas Batidas (${okItems.length})</div>
          ${okItems.length ? okItems.join("") : '<div class="resumo-item">Nenhuma meta batida</div>'}
        </div>
        <div class="resumo-card fail">
          <div class="rc-title">⚠️ Não Batidas (${failItems.length})</div>
          ${failItems.length ? failItems.join("") : '<div class="resumo-item">Todas as metas foram batidas! 🎉</div>'}
        </div>
      </div>
      <div class="sec">🎯 Ações Recomendadas para o Próximo Mês</div>
      <div class="prior-box">${gerarHTMLAcoesRecomendadas(dados)}</div>
      <div class="ft">
        <span>Relatório de Fechamento · ${dados.nome} · ${mes}</span><span>Confidencial · Diretoria Comercial</span>
      </div>
    </div>`;
}
