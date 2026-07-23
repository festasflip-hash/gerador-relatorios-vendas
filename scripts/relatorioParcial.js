import {
  converterParaFloat,
  formatarMoeda,
  obterClassePerformance,
  obterCorBadge,
  gerarHTMLBarra,
  gerarHTMLPrioridadesParcial
} from "./helpers.js";

export function gerarHTMLRelatorioParcial(dados) {
  const periodo = document.getElementById("periodoInput").value;
  const mes = document.getElementById("mesInput").value;
  const perfParcial = converterParaFloat(dados.perfParcial);
  const perfMensal = converterParaFloat(dados.perfMensal);
  const [ppCls, ppLbl, ppTc] = obterClassePerformance(perfParcial);
  const [pmCls, pmLbl, pmTc] = obterClassePerformance(perfMensal);
  const nvPct = converterParaFloat(dados.nvMetaP) > 0 ? Math.min(converterParaFloat(dados.nvReal) / converterParaFloat(dados.nvMetaP) * 100, 100) : 0;
  const ovPctP = converterParaFloat(dados.ovMetaP) > 0 ? Math.min(converterParaFloat(dados.ovReal) / converterParaFloat(dados.ovMetaP) * 100, 100) : 0;
  const ovPctM = converterParaFloat(dados.ovMetaM) > 0 ? Math.min(converterParaFloat(dados.ovReal) / converterParaFloat(dados.ovMetaM) * 100, 100) : 0;
  const posPct = converterParaFloat(dados.posMetaP) > 0 ? Math.min(converterParaFloat(dados.posReal) / converterParaFloat(dados.posMetaP) * 100, 100) : 0;
  const mixPct = converterParaFloat(dados.mixMetaP) > 0 ? Math.min(converterParaFloat(dados.mixReal) / converterParaFloat(dados.mixMetaP) * 100, 100) : 0;
  const tmPct = converterParaFloat(dados.tmPct);
  const tot = Math.round((converterParaFloat(dados.nvRes) + converterParaFloat(dados.ovRes) + converterParaFloat(dados.posRes) + converterParaFloat(dados.mixRes) + (tmPct >= 100 ? 10 : tmPct / 10)) * 100) / 100;

  return `
    <div class="rel">
      <div class="hd">
        <div class="hd-left">
          <h1>Relatório Individual de Desempenho</h1>
          <h2>${dados.nome} · ${mes}</h2>
        </div>
        <div class="hd-right">
          <strong>Referência: ${periodo}</strong>
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
        <div class="tc ${ppTc}">
          <div class="lbl">Perf. Parcial</div>
          <div class="val ${ppCls}">${perfParcial}%</div>
          <div class="sub">${periodo}</div>
        </div>
        <div class="tc ${pmTc}">
          <div class="lbl">Perf. Mensal</div>
          <div class="val ${pmCls}">${perfMensal}%</div>
          <div class="sub">${mes}</div>
        </div>
        <div class="tc tc-azul">
          <div class="lbl">Resultado</div>
          <div class="val c-azul">${tot}</div>
          <div class="sub">de 100 pts</div>
        </div>
      </div>
      <div class="sec">Performance Detalhada</div>
      <div class="perf-row">
        <div class="perf-card ${ppTc}">
          <div class="p-lbl ${ppCls}">Performance Parcial</div>
          <div class="p-num ${ppCls}">${perfParcial}%</div>
          <div class="p-status ${ppCls}">● ${ppLbl}</div>
          <div class="p-ref">${periodo}</div>
        </div>
        <div class="perf-card ${pmTc}">
          <div class="p-lbl ${pmCls}">Performance Mensal</div>
          <div class="p-num ${pmCls}">${perfMensal}%</div>
          <div class="p-status ${pmCls}">● ${pmLbl}</div>
          <div class="p-ref">${mes} completo</div>
        </div>
      </div>
      <div class="sec">Indicadores — Parcial</div>
      <table>
        <thead>
          <tr>
            <th>Indicador</th>
            <th class="tr">Meta</th>
            <th class="tr">Realizado</th>
            <th class="tc2">%</th>
            <th class="tc2">Peso</th>
            <th style="width:140px">Progresso</th>
            <th class="tc2">Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Novas Vendas</strong></td>
            <td class="tr">${dados.nvMetaP} Qtd</td>
            <td class="tr">${dados.nvReal} Qtd</td>
            <td class="tc2">${nvPct.toFixed(0)}%</td>
            <td class="tc2">5</td>
            <td>${gerarHTMLBarra(nvPct)}</td>
            <td class="tc2"><span class="badge ${obterCorBadge(nvPct)}">${formatarMoeda(converterParaFloat(dados.nvRes))}</span></td>
          </tr>
          <tr>
            <td><strong>Ticket Médio</strong></td>
            <td class="tr">R$ ${formatarMoeda(converterParaFloat(dados.tmMeta))}</td>
            <td class="tr">R$ ${formatarMoeda(converterParaFloat(dados.tmReal))}</td>
            <td class="tc2">${tmPct.toFixed(0)}%</td>
            <td class="tc2">10</td>
            <td>${gerarHTMLBarra(tmPct)}</td>
            <td class="tc2"><span class="badge ${obterCorBadge(tmPct)}">${tmPct >= 100 ? '10,00' : formatarMoeda(tmPct / 10)}</span></td>
          </tr>
          <tr>
            <td><strong>Objetivo de Vendas</strong></td>
            <td class="tr">R$ ${formatarMoeda(converterParaFloat(dados.ovMetaP))}</td>
            <td class="tr">R$ ${formatarMoeda(converterParaFloat(dados.ovReal))}</td>
            <td class="tc2">${ovPctP.toFixed(0)}%</td>
            <td class="tc2">60</td>
            <td>${gerarHTMLBarra(ovPctP)}</td>
            <td class="tc2"><span class="badge ${obterCorBadge(ovPctP)}">${formatarMoeda(converterParaFloat(dados.ovRes))}</span></td>
          </tr>
          <tr>
            <td><strong>Positivação</strong></td>
            <td class="tr">${dados.posMetaP} Qtd</td>
            <td class="tr">${dados.posReal} Qtd</td>
            <td class="tc2">${posPct.toFixed(0)}%</td>
            <td class="tc2">15</td>
            <td>${gerarHTMLBarra(posPct)}</td>
            <td class="tc2"><span class="badge ${obterCorBadge(posPct)}">${formatarMoeda(converterParaFloat(dados.posRes))}</span></td>
          </tr>
          <tr>
            <td><strong>Mix de Vendas</strong></td>
            <td class="tr">${dados.mixMetaP} SKUs</td>
            <td class="tr">${dados.mixReal} SKUs</td>
            <td class="tc2">${mixPct.toFixed(0)}%</td>
            <td class="tc2">10</td>
            <td>${gerarHTMLBarra(mixPct)}</td>
            <td class="tc2"><span class="badge ${obterCorBadge(mixPct)}">${formatarMoeda(converterParaFloat(dados.mixRes))}</span></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="6"><strong>Resultado Total</strong></td>
            <td class="tc2"><strong>${tot} pts</strong></td>
          </tr>
        </tfoot>
      </table>
      <div class="sec">Comparativo — Parcial vs Meta Mensal</div>
      <div class="comp-grid">
        <div class="comp-card">
          <div class="comp-title">📅 Parcial</div>
          <div class="comp-row"><span class="cl">Novas Vendas</span><span class="cv">${dados.nvReal} / ${dados.nvMetaP} ${converterParaFloat(dados.nvReal) >= converterParaFloat(dados.nvMetaP) ? '✓' : ''}</span></div>
          <div class="comp-row"><span class="cl">Ticket Médio</span><span class="cv">R$ ${formatarMoeda(converterParaFloat(dados.tmReal))} / R$ ${formatarMoeda(converterParaFloat(dados.tmMeta))} ${converterParaFloat(dados.tmReal) >= converterParaFloat(dados.tmMeta) ? '✓' : '— faltam R$ ' + formatarMoeda(converterParaFloat(dados.tmMeta) - converterParaFloat(dados.tmReal))}</span></div>
          <div class="comp-row"><span class="cl">Obj. Vendas</span><span class="cv">R$ ${formatarMoeda(converterParaFloat(dados.ovReal))} / R$ ${formatarMoeda(converterParaFloat(dados.ovMetaP))} ${converterParaFloat(dados.ovReal) >= converterParaFloat(dados.ovMetaP) ? '✓' : ''}</span></div>
          <div class="comp-row"><span class="cl">Positivação</span><span class="cv">${dados.posReal} / ${dados.posMetaP} ${converterParaFloat(dados.posReal) >= converterParaFloat(dados.posMetaP) ? '✓' : ''}</span></div>
          <div class="comp-row"><span class="cl">Mix de Vendas</span><span class="cv">${dados.mixReal} / ${dados.mixMetaP} SKUs ${converterParaFloat(dados.mixReal) >= converterParaFloat(dados.mixMetaP) ? '✓' : ''}</span></div>
        </div>
        <div class="comp-card">
          <div class="comp-title">🗓 Meta Mensal</div>
          <div class="comp-row"><span class="cl">Novas Vendas</span><span class="cv ${converterParaFloat(dados.nvReal) >= converterParaFloat(dados.nvMetaM) ? 'c-verde' : 'c-baixa'}">${dados.nvReal} / ${dados.nvMetaM} ${converterParaFloat(dados.nvMetaM) - converterParaFloat(dados.nvReal) > 0 ? '— faltam ' + (converterParaFloat(dados.nvMetaM) - converterParaFloat(dados.nvReal)).toFixed(0) : '✓'}</span></div>
          <div class="comp-row"><span class="cl">Ticket Médio</span><span class="cv ${converterParaFloat(dados.tmReal) >= converterParaFloat(dados.tmMeta) ? 'c-verde' : 'c-media'}">R$ ${formatarMoeda(converterParaFloat(dados.tmReal))} / R$ ${formatarMoeda(converterParaFloat(dados.tmMeta))} ${converterParaFloat(dados.tmReal) >= converterParaFloat(dados.tmMeta) ? '✓' : '— faltam R$ ' + formatarMoeda(converterParaFloat(dados.tmMeta) - converterParaFloat(dados.tmReal))}</span></div>
          <div class="comp-row"><span class="cl">Obj. Vendas</span><span class="cv ${converterParaFloat(dados.ovReal) >= converterParaFloat(dados.ovMetaM) ? 'c-verde' : 'c-baixa'}">R$ ${formatarMoeda(converterParaFloat(dados.ovReal))} / R$ ${formatarMoeda(converterParaFloat(dados.ovMetaM))} (${ovPctM.toFixed(0)}%) ${converterParaFloat(dados.ovMetaM) - converterParaFloat(dados.ovReal) > 0 ? '— faltam R$ ' + formatarMoeda(converterParaFloat(dados.ovMetaM) - converterParaFloat(dados.ovReal)) : '✓'}</span></div>
          <div class="comp-row"><span class="cl">Positivação</span><span class="cv ${converterParaFloat(dados.posReal) >= converterParaFloat(dados.posMetaM) ? 'c-verde' : 'c-media'}">${dados.posReal} / ${dados.posMetaM} ${converterParaFloat(dados.posMetaM) - converterParaFloat(dados.posReal) > 0 ? '— faltam ' + (converterParaFloat(dados.posMetaM) - converterParaFloat(dados.posReal)).toFixed(0) : '✓'}</span></div>
          <div class="comp-row"><span class="cl">Mix de Vendas</span><span class="cv ${converterParaFloat(dados.mixReal) >= converterParaFloat(dados.mixMetaM) ? 'c-verde' : 'c-media'}">${dados.mixReal} / ${dados.mixMetaM} SKUs ${converterParaFloat(dados.mixMetaM) - converterParaFloat(dados.mixReal) > 0 ? '— faltam ' + (converterParaFloat(dados.mixMetaM) - converterParaFloat(dados.mixReal)).toFixed(0) : '✓'}</span></div>
        </div>
      </div>
      <div class="sec">⚡ Prioridades até o fim do mês</div>
      <div class="prior-box">${gerarHTMLPrioridadesParcial(dados)}</div>
      <div class="ft">
        <span>Relatório Individual · ${dados.nome} · ${mes}</span><span>Confidencial · Diretoria Comercial</span>
      </div>
    </div>`;
}
