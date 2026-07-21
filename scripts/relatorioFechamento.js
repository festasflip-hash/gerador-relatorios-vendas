function relFechamento(d){
  const periodo=document.getElementById('periodoInput').value,mes=document.getElementById('mesInput').value;
  const pm=f(d.perfMensal);const [pmCls,pmLbl,pmTc]=perfClass(pm);
  const nvOk=f(d.nvReal)>=f(d.nvMeta),tmOk=f(d.tmReal)>=f(d.tmMeta),ovOk=f(d.ovReal)>=f(d.ovMeta),posOk=f(d.posReal)>=f(d.posMeta),mixOk=f(d.mixReal)>=f(d.mixMeta);
  const bat=[nvOk,tmOk,ovOk,posOk,mixOk].filter(Boolean).length;
  const tot=Math.round((f(d.nvRes)+f(d.tmRes)+f(d.ovRes)+f(d.posRes)+f(d.mixRes))*100)/100;
  const okI=[],failI=[];

  if(nvOk)okI.push(
    `<div class="resumo-item">
        <span>Novas Vendas</span>
        <strong>${d.nvReal} / ${d.nvMeta}</strong>
    </div>`
    );

  else failI.push(
    `<div class="resumo-item">
        <span>Novas Vendas</span>
        <strong>${d.nvReal} / ${d.nvMeta} (faltaram ${(f(d.nvMeta)-f(d.nvReal)).toFixed(0)})</strong>
    </div>`
    );

  if(tmOk)okI.push(
    `<div class="resumo-item">
        <span>Ticket Médio</span>
        <strong>R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))}</strong>
    </div>`
    );

  else failI.push(
    `<div class="resumo-item">
        <span>Ticket Médio</span>
        <strong>R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))} (faltaram R$ ${fmt(f(d.tmMeta)-f(d.tmReal))})</strong>
    </div>`
    );

  if(ovOk)okI.push(
    `<div class="resumo-item">
        <span>Obj. de Vendas</span>
        <strong>R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMeta))}</strong>
    </div>`
    );

  else failI.push(
    `<div class="resumo-item">
        <span>Obj. de Vendas</span>
        <strong>R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMeta))} (faltaram R$ ${fmt(f(d.ovMeta)-f(d.ovReal))})</strong>
    </div>`
    );

  if(posOk)okI.push(
    `<div class="resumo-item">
        <span>Positivação</span>
        <strong>${d.posReal} / ${d.posMeta}</strong>
    </div>`
    );

  else failI.push(
    `<div class="resumo-item">
        <span>Positivação</span>
        <strong>${d.posReal} / ${d.posMeta} (faltaram ${(f(d.posMeta)-f(d.posReal)).toFixed(0)})</strong>
    </div>`
    );

  if(mixOk)okI.push(
    `<div class="resumo-item">
        <span>Mix de Vendas</span>
        <strong>${d.mixReal} / ${d.mixMeta} SKUs</strong>
    </div>`
    );

  else failI.push(
    `<div class="resumo-item">
        <span>Mix de Vendas</span>
        <strong>${d.mixReal} / ${d.mixMeta} SKUs (faltaram ${(f(d.mixMeta)-f(d.mixReal)).toFixed(0)})</strong>
    </div>`
    );

  return `
  <div class="rel">
        <div class="hd">
            <div class="hd-left">
            <h1>Relatório de Fechamento do Mês</h1>
            <h2>${d.nome} · ${mes}</h2>
        </div>
        <div class="hd-right">
            <strong>Período: ${periodo}</strong>
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
            <div class="tc ${pmTc}">
                <div class="lbl">Performance Final</div>
                <div class="val ${pmCls}">${pm}%</div>
                <div class="sub">${mes}</div>
            </div>
            <div class="tc tc-azul">
                <div class="lbl">Resultado Total</div>
                <div class="val c-azul">${tot}</div>
                <div class="sub">de 100 pontos</div>
            </div>
            <div class="tc ${bat===5?'tc-verde':bat===0?'tc-baixa':'tc-media'}">
                <div class="lbl">Metas Batidas</div>
                <div class="val ${bat===5?'c-verde':bat===0?'c-baixa':'c-media'}">
                    ${bat}/5
                </div>
                <div class="sub">indicadores</div>
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
                <tr><th>Indicador</th>
                    <th class="tr">Meta</th>
                    <th class="tr">Realizado</th>
                    <th class="tc2">Status</th>
                    <th class="tc2">Peso</th>
                    <th class="tc2">Resultado</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>Novas Vendas</strong>
                    </td>
                    <td class="tr">${d.nvMeta} Qtd</td>
                    <td class="tr">${d.nvReal} Qtd</td>
                    <td class="tc2">${statusPill(nvOk)}</td>
                    <td class="tc2">5</td><td class="tc2">
                        <span class="badge ${nvOk?'b-green':'b-red'}">${fmt(f(d.nvRes))}</span>
                    </td>
                </tr>

                <tr>
                    <td>
                        <strong>Ticket Médio</strong>
                    </td>
                    <td class="tr">R$ ${fmt(f(d.tmMeta))}</td>
                    <td class="tr">R$ ${fmt(f(d.tmReal))}</td>
                    <td class="tc2">${statusPill(tmOk)}</td>
                    <td class="tc2">10</td>
                    <td class="tc2">
                        <span class="badge ${tmOk?'b-green':'b-red'}">${fmt(f(d.tmRes))}</span>
                    </td>
                </tr>

                <tr>
                    <td>
                        <strong>Objetivo de Vendas</strong>
                    </td>
                    <td class="tr">R$ ${fmt(f(d.ovMeta))}</td>
                    <td class="tr">R$ ${fmt(f(d.ovReal))}</td>
                    <td class="tc2">${statusPill(ovOk)}</td>
                    <td class="tc2">60</td><td class="tc2">
                        <span class="badge ${ovOk?'b-green':'b-red'}">${fmt(f(d.ovRes))}</span>
                    </td>
                </tr>

                <tr>
                    <td>
                        <strong>Positivação</strong>
                    </td>
                    <td class="tr">${d.posMeta} Qtd</td>
                    <td class="tr">${d.posReal} Qtd</td>
                    <td class="tc2">${statusPill(posOk)}</td>
                    <td class="tc2">15</td>
                    <td class="tc2">
                        <span class="badge ${posOk?'b-green':'b-red'}">${fmt(f(d.posRes))}</span>
                    </td>
                </tr>

                <tr>
                    <td>
                        <strong>Mix de Vendas</strong>
                    </td>
                    <td class="tr">${d.mixMeta} SKUs</td>
                    <td class="tr">${d.mixReal} SKUs</td>
                    <td class="tc2">${statusPill(mixOk)}</td>
                    <td class="tc2">10</td><td class="tc2">
                        <span class="badge ${mixOk?'b-green':'b-red'}">${fmt(f(d.mixRes))}</span>
                    </td>
                </tr>
        </tbody>
            <tfoot>
                <tr>
                    <td colspan="5">
                        <strong>Resultado Total</strong>
                    </td>
                    <td class="tc2">
                        <strong>${tot} pts</strong>
                    </td>
                </tr>
            </tfoot>
    </table>

    <div class="sec">Resumo do Mês</div>
    <div class="resumo-grid">
        <div class="resumo-card ok">
            <div class="rc-title">✅ Metas Batidas (${okI.length})</div>
            ${okI.length?okI.join(''):'<div class="resumo-item">Nenhuma meta batida</div>'}
        </div>
        <div class="resumo-card fail">
            <div class="rc-title">⚠️ Não Batidas (${failI.length})</div>
            ${failI.length?failI.join(''):'<div class="resumo-item">Todas as metas foram batidas! 🎉</div>'}
        </div>
    </div>

    <div class="sec">🎯 Ações Recomendadas para o Próximo Mês</div>
    <div class="prior-box">${acoesAuto(d)}</div>
    
    <div class="ft">
        <span>Relatório de Fechamento · ${d.nome} · ${mes}</span><span>Confidencial · Diretoria Comercial</span>
    </div>
  </div>`;
}

function gerarRelatorio(d){
    return modo==='parcial'?relParcial(d):relFechamento(d);
}
