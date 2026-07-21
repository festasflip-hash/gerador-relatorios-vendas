function relParcial(d){

  const periodo=document.getElementById('periodoInput').value,mes=document.getElementById('mesInput').value;
  const pp=f(d.perfParcial),pm=f(d.perfMensal);
  const [ppCls,ppLbl,ppTc]=perfClass(pp),[pmCls,pmLbl,pmTc]=perfClass(pm);
  const nvPct=f(d.nvMetaP)>0?Math.min(f(d.nvReal)/f(d.nvMetaP)*100,100):0;
  const ovPctP=f(d.ovMetaP)>0?Math.min(f(d.ovReal)/f(d.ovMetaP)*100,100):0;
  const ovPctM=f(d.ovMetaM)>0?Math.min(f(d.ovReal)/f(d.ovMetaM)*100,100):0;
  const posPct=f(d.posMetaP)>0?Math.min(f(d.posReal)/f(d.posMetaP)*100,100):0;
  const mixPct=f(d.mixMetaP)>0?Math.min(f(d.mixReal)/f(d.mixMetaP)*100,100):0;
  const tmPct=f(d.tmPct);
  const tot=Math.round((f(d.nvRes)+f(d.ovRes)+f(d.posRes)+f(d.mixRes)+(tmPct>=100?10:tmPct/10))*100)/100;
  return `
    <div class="rel">
        <div class="hd">
            <div class="hd-left">
                <h1>Relatório Individual de Desempenho</h1>
                <h2>${d.nome} · ${mes}</h2>
            </div>
            <div class="hd-right">
                <strong>Referência: ${periodo}</strong>
                <div class="rank-pill">🏆 ${d.ranking}º lugar no ranking</div>
            </div>
        </div>
        <div class="sec">Visão Geral</div>
        <div class="top-cards">
            <div class="tc tc-azul">
                <div class="lbl">Posição</div>
                <div class="val c-azul">${d.ranking}º</div>
                <div class="sub">ranking</div>
            </div>
            <div class="tc ${ppTc}">
                <div class="lbl">Perf. Parcial</div>
                <div class="val ${ppCls}">${pp}%</div>
                <div class="sub">${periodo}</div>
            </div>
        <div class="tc ${pmTc}">
            <div class="lbl">Perf. Mensal</div>
            <div class="val ${pmCls}">${pm}%</div>
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
            <div class="p-num ${ppCls}">${pp}%</div>
            <div class="p-status ${ppCls}">● ${ppLbl}</div>
            <div class="p-ref">${periodo}</div>
        </div>
        <div class="perf-card ${pmTc}">
            <div class="p-lbl ${pmCls}">Performance Mensal</div>
            <div class="p-num ${pmCls}">${pm}%</div>
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
                <td>
                    <strong>Novas Vendas</strong>
                </td>
                <td class="tr">${d.nvMetaP} Qtd</td>
                <td class="tr">${d.nvReal} Qtd</td>
                <td class="tc2">${nvPct.toFixed(0)}%</td>
                <td class="tc2">5</td>
                <td>${barHTML(nvPct)}</td>
                <td class="tc2">
                    <span class="badge ${badgeC(nvPct)}">${fmt(f(d.nvRes))}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <strong>Ticket Médio</strong>
                </td>
                <td class="tr">R$ ${fmt(f(d.tmMeta))}</td>
                <td class="tr">R$ ${fmt(f(d.tmReal))}</td>
                <td class="tc2">${tmPct.toFixed(0)}%</td>
                <td class="tc2">10</td>
                <td>${barHTML(tmPct)}</td>
                <td class="tc2">
                    <span class="badge ${badgeC(tmPct)}">${tmPct>=100?'10,00':fmt(tmPct/10)}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <strong>Objetivo de Vendas</strong>
                </td>
                <td class="tr">R$ ${fmt(f(d.ovMetaP))}</td>
                <td class="tr">R$ ${fmt(f(d.ovReal))}</td>
                <td class="tc2">${ovPctP.toFixed(0)}%</td>
                <td class="tc2">60</td><td>${barHTML(ovPctP)}</td>
                <td class="tc2">
                    <span class="badge ${badgeC(ovPctP)}">${fmt(f(d.ovRes))}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <strong>Positivação</strong>
                </td>
                <td class="tr">${d.posMetaP} Qtd</td>
                <td class="tr">${d.posReal} Qtd</td>
                <td class="tc2">${posPct.toFixed(0)}%</td>
                <td class="tc2">15</td>
                <td>${barHTML(posPct)}</td>
                <td class="tc2">
                    <span class="badge ${badgeC(posPct)}">${fmt(f(d.posRes))}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <strong>Mix de Vendas</strong>
                </td>
                <td class="tr">${d.mixMetaP} SKUs</td>
                <td class="tr">${d.mixReal} SKUs</td>
                <td class="tc2">${mixPct.toFixed(0)}%</td>
                <td class="tc2">10</td>
                <td>${barHTML(mixPct)}</td>
                <td class="tc2">
                    <span class="badge ${badgeC(mixPct)}">${fmt(f(d.mixRes))}</span>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="6">
                    <strong>Resultado Total</strong>
                </td>
                <td class="tc2">
                    <strong>${tot} pts</strong>
                </td>
            </tr>
        </tfoot>
    </table>

    <div class="sec">Comparativo — Parcial vs Meta Mensal</div>
    <div class="comp-grid">
        <div class="comp-card"><div class="comp-title">📅 Parcial</div>
            <div class="comp-row">
                <span class="cl">Novas Vendas</span>
                <span class="cv">${d.nvReal} / ${d.nvMetaP} ${f(d.nvReal)>=f(d.nvMetaP)?'✓':''}</span>
            </div>
            <div class="comp-row">
                <span class="cl">Ticket Médio</span>
                <span class="cv">R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))} ${f(d.tmReal)>=f(d.tmMeta)?'✓':''}</span>
            </div>
            <div class="comp-row">
                <span class="cl">Obj. Vendas</span>
                <span class="cv">R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMetaP))} ${f(d.ovReal)>=f(d.ovMetaP)?'✓':''}</span>
            </div>
            <div class="comp-row">
                <span class="cl">Positivação</span>
                <span class="cv">${d.posReal} / ${d.posMetaP} ${f(d.posReal)>=f(d.posMetaP)?'✓':''}</span>
            </div>
            <div class="comp-row">
                <span class="cl">Mix de Vendas</span>
                <span class="cv">${d.mixReal} / ${d.mixMetaP} SKUs ${f(d.mixReal)>=f(d.mixMetaP)?'✓':''}</span>
            </div>
        </div>
        <div class="comp-card">
            <div class="comp-title">🗓 Meta Mensal</div>
            <div class="comp-row">
                <span class="cl">Novas Vendas</span>
                <span class="cv ${f(d.nvReal)>=f(d.nvMetaM)?'c-verde':'c-baixa'}">${d.nvReal} / ${d.nvMetaM} ${f(d.nvMetaM)-f(d.nvReal)>0?'— faltam '+(f(d.nvMetaM)-f(d.nvReal)).toFixed(0):'✓'}</span>
            </div>
            <div class="comp-row">
                <span class="cl">Ticket Médio</span>
                <span class="cv ${f(d.tmReal)>=f(d.tmMeta)?'c-verde':'c-media'}">R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))} ${f(d.tmReal)>=f(d.tmMeta)?'✓':'— faltam R$ '+fmt(f(d.tmMeta)-f(d.tmReal))}</span>
            </div>
            <div class="comp-row">
                <span class="cl">Obj. Vendas</span>
                <span class="cv ${f(d.ovReal)>=f(d.ovMetaM)?'c-verde':'c-baixa'}">R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMetaM))} (${ovPctM.toFixed(0)}%) ${f(d.ovMetaM)-f(d.ovReal)>0?'— faltam R$ '+fmt(f(d.ovMetaM)-f(d.ovReal)):'✓'}</span>
            </div>
            <div class="comp-row">
                <span class="cl">Positivação</span>
                <span class="cv ${f(d.posReal)>=f(d.posMetaM)?'c-verde':'c-media'}">${d.posReal} / ${d.posMetaM} ${f(d.posMetaM)-f(d.posReal)>0?'— faltam '+(f(d.posMetaM)-f(d.posReal)).toFixed(0):'✓'}</span>
            </div>
            <div class="comp-row">
                <span class="cl">Mix de Vendas</span>
                <span class="cv ${f(d.mixReal)>=f(d.mixMetaM)?'c-verde':'c-media'}">${d.mixReal} / ${d.mixMetaM} SKUs ${f(d.mixMetaM)-f(d.mixReal)>0?'— faltam '+(f(d.mixMetaM)-f(d.mixReal)).toFixed(0):'✓'}</span>
            </div>
        </div>
    </div>
    <div class="sec">⚡ Prioridades até o fim do mês</div>
    <div class="prior-box">${priorParcial(d)}</div>
    <div class="ft">
        <span>Relatório Individual · ${d.nome} · ${mes}</span><span>Confidencial · Diretoria Comercial</span>
    </div>
  </div>`;
}