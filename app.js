


/* ============ ESTADO ============ */
let modo='parcial';
let dadosParcial=[];
let dadosFechamento=[];
let relAtual=null, relAtualNome=null;
let editIdx=-1, editModo='parcial';

/* ============ PESOS ============ */
const PESOS={nv:5,tm:10,ov:60,pos:15,mix:10};



/* ============ TABS ============ */
function switchTab(m){
  modo=m;
  ['parcial','fechamento','dashboard'].forEach(t=>{
    document.getElementById('tab'+t.charAt(0).toUpperCase()+t.slice(1)).classList.toggle('active',modo===t);
  });
  document.getElementById('tableWrapParcial').classList.toggle('hidden',modo!=='parcial');
  document.getElementById('tableWrapFechamento').classList.toggle('hidden',modo!=='fechamento');
  document.getElementById('dashWrap').classList.toggle('hidden',modo!=='dashboard');
  document.getElementById('controlsBar').classList.toggle('hidden',modo==='dashboard');
  document.getElementById('legendBar').classList.toggle('hidden',modo==='dashboard');
  document.getElementById('resultsSection').style.display='none';

  const subs={
    parcial:'Modo: Acompanhamento Parcial',fechamento:'Modo: Fechamento do Mês',dashboard:'Modo: Dashboard Consolidado'
  };
    document.getElementById('topbarSub').textContent=subs[modo];
  if(modo!=='dashboard'){
    document.getElementById('ctrlTitle').textContent=modo==='parcial'?'Representantes — Parcial':'Representantes — Fechamento';
    document.getElementById('lblPeriodo').textContent=modo==='parcial'?'Período Parcial':'Período do Fechamento';
    document.getElementById('legendaExtra').textContent=modo==='fechamento'?'Status: Meta Batida / Não Batida':'';
  } else { 
    renderDashboard(); 
  }
}

/* ============ PARCIAL — TABELA ============ */
function novoParcial(d={}){
  return {nome:d.nome||'',ranking:d.ranking||'',perfParcial:d.perfParcial||'',perfMensal:d.perfMensal||'',
    nvMetaP:d.nvMetaP||'',nvMetaM:d.nvMetaM||'',nvReal:d.nvReal||'',nvRes:d.nvRes||'',
    tmMeta:d.tmMeta||'',tmReal:d.tmReal||'',tmPct:d.tmPct||'',
    ovMetaP:d.ovMetaP||'',ovMetaM:d.ovMetaM||'',ovReal:d.ovReal||'',ovRes:d.ovRes||'',
    posMetaP:d.posMetaP||'',posMetaM:d.posMetaM||'',posReal:d.posReal||'',posRes:d.posRes||'',
    mixMetaP:d.mixMetaP||'',mixMetaM:d.mixMetaM||'',mixReal:d.mixReal||'',mixRes:d.mixRes||''};
}
function renderParcial(){
  document.getElementById('tableBodyParcial').innerHTML=dadosParcial.map((d,i)=>`
    <tr>
      <td class="row-num">${i+1}</td>
      <td>
        <input class="nome" value="${d.nome}" oninput="dadosParcial[${i}].nome=this.value" placeholder="Nome">
      </td>
      <td>
        <input class="num" value="${d.ranking}" oninput="dadosParcial[${i}].ranking=this.value" placeholder="#">
      </td>
      <td>
        <input class="num" value="${d.perfParcial}" oninput="dadosParcial[${i}].perfParcial=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${d.perfMensal}" oninput="dadosParcial[${i}].perfMensal=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${d.nvMetaP}" oninput="dadosParcial[${i}].nvMetaP=this.value;autoCalcP(${i})" placeholder="0">
      </td>
      <td>
        <input class="num" value="${d.nvMetaM}" oninput="dadosParcial[${i}].nvMetaM=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${d.nvReal}" oninput="dadosParcial[${i}].nvReal=this.value;autoCalcP(${i})" placeholder="0">
      </td>
      <td>
        <input class="num calc" value="${d.nvRes}" readonly title="Calculado automaticamente">
      </td>
      <td>
        <input class="num" value="${d.tmMeta}" oninput="dadosParcial[${i}].tmMeta=this.value;autoCalcP(${i})" placeholder="3000">
      </td>
      <td>
        <input class="num" value="${d.tmReal}" oninput="dadosParcial[${i}].tmReal=this.value;autoCalcP(${i})" placeholder="0">
      </td>
      <td>
        <input class="num calc" value="${d.tmPct}" readonly title="Calculado automaticamente">
      </td>
      <td>
        <input class="num" value="${d.ovMetaP}" oninput="dadosParcial[${i}].ovMetaP=this.value;autoCalcP(${i})" placeholder="0">
      </td>
      <td>
        <input class="num" value="${d.ovMetaM}" oninput="dadosParcial[${i}].ovMetaM=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${d.ovReal}" oninput="dadosParcial[${i}].ovReal=this.value;autoCalcP(${i})" placeholder="0">
      </td>
      <td>
        <input class="num calc" value="${d.ovRes}" readonly title="Calculado automaticamente">
      </td>
      <td>
        <input class="num" value="${d.posMetaP}" oninput="dadosParcial[${i}].posMetaP=this.value;autoCalcP(${i})" placeholder="0">
      </td>
      <td>
        <input class="num" value="${d.posMetaM}" oninput="dadosParcial[${i}].posMetaM=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${d.posReal}" oninput="dadosParcial[${i}].posReal=this.value;autoCalcP(${i})" placeholder="0">
      </td>
      <td>
        <input class="num calc" value="${d.posRes}" readonly title="Calculado automaticamente">
      </td>
      <td>
        <input class="num" value="${d.mixMetaP}" oninput="dadosParcial[${i}].mixMetaP=this.value;autoCalcP(${i})" placeholder="0">
      </td>
      <td>
        <input class="num" value="${d.mixMetaM}" oninput="dadosParcial[${i}].mixMetaM=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${d.mixReal}" oninput="dadosParcial[${i}].mixReal=this.value;autoCalcP(${i})" placeholder="0">
      </td>
      <td>
        <input class="num calc" value="${d.mixRes}" readonly title="Calculado automaticamente">
      </td>
      <td style="white-space:nowrap">
        <button class="edit-btn" onclick="abrirEdit(${i},'parcial')" title="Editar em formulário">✏️</button>
        <button class="del-btn" onclick="dadosParcial.splice(${i},1);renderParcial()" title="Remover">✕</button>
      </td>
    </tr>`).join('');
}
function autoCalcP(i){
  calcParcial(dadosParcial[i]);
  const cells=document.getElementById('tableBodyParcial').rows[i].cells;
  // atualiza campos calc: índices 8(nvRes),10(tmPct),15(ovRes),19(posRes),23(mixRes)
  const calcMap=[[8,'nvRes'],[10,'tmPct'],[15,'ovRes'],[19,'posRes'],[23,'mixRes']];
  calcMap.forEach(([ci,key])=>{cells[ci].querySelector('input').value=dadosParcial[i][key];});
}

/* ============ FECHAMENTO — TABELA ============ */
function novoFechamento(d={}){
  return {nome:d.nome||'',ranking:d.ranking||'',perfMensal:d.perfMensal||'',
    nvMeta:d.nvMeta||'',nvReal:d.nvReal||'',nvRes:d.nvRes||'',
    tmMeta:d.tmMeta||'',tmReal:d.tmReal||'',tmRes:d.tmRes||'',
    ovMeta:d.ovMeta||'',ovReal:d.ovReal||'',ovRes:d.ovRes||'',
    posMeta:d.posMeta||'',posReal:d.posReal||'',posRes:d.posRes||'',
    mixMeta:d.mixMeta||'',mixReal:d.mixReal||'',mixRes:d.mixRes||''};
}
function renderFechamento(){
  document.getElementById('tableBodyFechamento').innerHTML=dadosFechamento.map((d,i)=>`
    <tr>
      <td class="row-num">${i+1}</td>
      <td><input class="nome" value="${d.nome}" oninput="dadosFechamento[${i}].nome=this.value" placeholder="Nome"></td>
      <td><input class="num" value="${d.ranking}" oninput="dadosFechamento[${i}].ranking=this.value" placeholder="#"></td>
      <td><input class="num" value="${d.perfMensal}" oninput="dadosFechamento[${i}].perfMensal=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.nvMeta}" oninput="dadosFechamento[${i}].nvMeta=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.nvReal}" oninput="dadosFechamento[${i}].nvReal=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.nvRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.tmMeta}" oninput="dadosFechamento[${i}].tmMeta=this.value;autoCalcF(${i})" placeholder="3000"></td>
      <td><input class="num" value="${d.tmReal}" oninput="dadosFechamento[${i}].tmReal=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.tmRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.ovMeta}" oninput="dadosFechamento[${i}].ovMeta=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.ovReal}" oninput="dadosFechamento[${i}].ovReal=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.ovRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.posMeta}" oninput="dadosFechamento[${i}].posMeta=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.posReal}" oninput="dadosFechamento[${i}].posReal=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.posRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.mixMeta}" oninput="dadosFechamento[${i}].mixMeta=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.mixReal}" oninput="dadosFechamento[${i}].mixReal=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.mixRes}" readonly title="Calculado automaticamente"></td>
      <td style="white-space:nowrap">
        <button class="edit-btn" onclick="abrirEdit(${i},'fechamento')" title="Editar em formulário">✏️</button>
        <button class="del-btn" onclick="dadosFechamento.splice(${i},1);renderFechamento()" title="Remover">✕</button>
      </td>
    </tr>`).join('');
}
function autoCalcF(i){
  calcFechamento(dadosFechamento[i]);
  const cells=document.getElementById('tableBodyFechamento').rows[i].cells;
  const calcMap=[[6,'nvRes'],[9,'tmRes'],[12,'ovRes'],[15,'posRes'],[18,'mixRes']];
  calcMap.forEach(([ci,key])=>{cells[ci].querySelector('input').value=dadosFechamento[i][key];});
}

/* ============ ADD / CLEAR ============ */
function addRow(){
  if(modo==='parcial'){dadosParcial.push(novoParcial());renderParcial();}
  else if(modo==='fechamento'){dadosFechamento.push(novoFechamento());renderFechamento();}
}
function clearAll(){
  if(modo==='dashboard')
    return;
  if(!confirm('Limpar todos os dados?'))
    return;
  if(modo==='parcial'){
    dadosParcial=[];
    renderParcial();
  }
  else{
    dadosFechamento=[];
    renderFechamento();
  }
  document.getElementById('resultsSection').style.display='none';
}

/* ============ MODAL EDIÇÃO ============ */


/* ============ TEMPLATES ============ */


/* ============ AÇÕES AUTOMÁTICAS ============ */
function acoesAuto(d){
  const itens=[];
  const ovFalta=f(d.ovMeta)-f(d.ovReal);if(ovFalta>0){const pct=(f(d.ovReal)/f(d.ovMeta)*100).toFixed(0);itens.push({c:'d-r',t:`<strong>Prioridade máxima:</strong> faturar mais <strong>R$ ${fmt(ovFalta)}</strong> para fechar Objetivo de Vendas (${pct}%) — maior peso (60 pts).`});}
  const posFalta=f(d.posMeta)-f(d.posReal);if(posFalta>0)itens.push({c:'d-o',t:`Positivar mais <strong>${posFalta.toFixed(0)} clientes</strong> para atingir a meta de ${d.posMeta}.`});
  const tmFalta=f(d.tmMeta)-f(d.tmReal);if(tmFalta>0)itens.push({c:'d-o',t:`Elevar Ticket Médio em <strong>R$ ${fmt(tmFalta)}</strong>, de R$ ${fmt(f(d.tmReal))} para R$ ${fmt(f(d.tmMeta))}.`});
  const mixFalta=f(d.mixMeta)-f(d.mixReal);if(mixFalta>0)itens.push({c:'d-o',t:`Ampliar Mix de Vendas em mais <strong>${mixFalta.toFixed(0)} SKUs</strong>.`});
  const nvFalta=f(d.nvMeta)-f(d.nvReal);if(nvFalta>0)itens.push({c:f(d.nvReal)===0?'d-r':'d-o',t:`Realizar mais <strong>${nvFalta.toFixed(0)} novas vendas</strong> para atingir a meta de ${d.nvMeta}.`});
  if(!itens.length)itens.push({c:'d-g',t:`Todas as metas batidas — <strong>manter o ritmo e consolidar os resultados</strong> no próximo período.`});
  return itens.map(i=>`<div class="pi"><div class="pdot ${i.c}"></div><span>${i.t}</span></div>`).join('');
}
function priorParcial(d){
  const itens=[];
  const nvFalta=f(d.nvMetaM)-f(d.nvReal);if(f(d.nvReal)===0)itens.push({c:'d-r',t:`Realizar <strong>${nvFalta.toFixed(0)} novas vendas</strong> — zerado até agora.`});else if(nvFalta>0)itens.push({c:'d-o',t:`Realizar mais <strong>${nvFalta.toFixed(0)} novas vendas</strong> para atingir meta mensal.`});
  const ovFalta=f(d.ovMetaM)-f(d.ovReal);if(ovFalta>0){const pct=(f(d.ovReal)/f(d.ovMetaM)*100).toFixed(0);itens.push({c:pct<50?'d-r':'d-o',t:`Faturar mais <strong>R$ ${fmt(ovFalta)}</strong> para fechar Objetivo de Vendas (${pct}%).`});}
  const posFalta=f(d.posMetaM)-f(d.posReal);if(posFalta>0)itens.push({c:'d-o',t:`Positivar mais <strong>${posFalta.toFixed(0)} clientes</strong>.`});
  const mixFalta=f(d.mixMetaM)-f(d.mixReal);if(mixFalta>0)itens.push({c:'d-o',t:`Ampliar Mix em mais <strong>${mixFalta.toFixed(0)} SKUs</strong>.`});
  const tmFalta=f(d.tmMeta)-f(d.tmReal);if(tmFalta>0)itens.push({c:'d-o',t:`Elevar Ticket Médio de <strong>R$ ${fmt(f(d.tmReal))}</strong> para <strong>R$ ${fmt(f(d.tmMeta))}</strong>.`});
  if(!itens.length)itens.push({c:'d-g',t:`Todos os indicadores mensais atingidos — <strong>excelente performance!</strong>`});
  return itens.map(i=>`<div class="pi"><div class="pdot ${i.c}"></div><span>${i.t}</span></div>`).join('');
}

/* ============ RELATÓRIO PARCIAL ============ */


/* ============ RELATÓRIO FECHAMENTO ============ */

/* ============ GERAR / VISUALIZAR ============ */
function gerarTodos(){
  if(modo==='dashboard')return;
  const dados=modo==='parcial'?dadosParcial:dadosFechamento;
  const validos=dados.filter(d=>d.nome&&d.nome.trim());
  if(!validos.length){alert('Adicione ao menos um representante com nome!');return;}
  const list=document.getElementById('repList');
  list.innerHTML='';
  validos.forEach((d,i)=>{
    const pm=f(d.perfMensal),pp=modo==='parcial'?f(d.perfParcial):null;
    const [pmCls,pmLbl,pmTc]=perfClass(pm);
    const div=document.createElement('div');div.className='rep-card-mini';
    let p2=modo==='parcial'
      ?`<div class="rcm-pi ${perfClass(pp)[2]}"><div class="pl">Parcial</div><div class="pv ${perfClass(pp)[0]}">${pp}%</div><div class="ps ${perfClass(pp)[0]}">${perfClass(pp)[1]}</div></div>`
      :(()=>{const nvOk=f(d.nvReal)>=f(d.nvMeta),tmOk=f(d.tmReal)>=f(d.tmMeta),ovOk=f(d.ovReal)>=f(d.ovMeta),posOk=f(d.posReal)>=f(d.posMeta),mixOk=f(d.mixReal)>=f(d.mixMeta);const bat=[nvOk,tmOk,ovOk,posOk,mixOk].filter(Boolean).length;const tc=bat===5?'tc-verde':bat===0?'tc-baixa':'tc-media';const vc=bat===5?'c-verde':bat===0?'c-baixa':'c-media';return `<div class="rcm-pi ${tc}"><div class="pl">Metas</div><div class="pv ${vc}">${bat}/5</div><div class="ps">batidas</div></div>`;})();
    const idx=dados.indexOf(d);
    div.innerHTML=`<div class="rcm-head"><span class="rcm-name">${d.nome}</span><span class="rcm-rank">${d.ranking}º</span></div>
      <div class="rcm-body"><div class="rcm-perf">${p2}<div class="rcm-pi ${pmTc}"><div class="pl">Mensal</div><div class="pv ${pmCls}">${pm}%</div><div class="ps ${pmCls}">${pmLbl}</div></div></div>
      <div class="rcm-actions"><button class="btn-view" onclick="verRel(${idx})">👁 Ver</button><button class="btn-print" onclick="imprimirRel(${idx})">🖨️ PDF</button></div></div>`;
    list.appendChild(div);
  });
  document.getElementById('resultsSection').style.display='block';
  document.getElementById('resultsTitle').textContent=`${validos.length} relatório(s) gerado(s)`;
  document.getElementById('btnPrintAll').style.display='block';
  document.getElementById('btnZipAll').style.display=modo==='fechamento'?'block':'none';
  document.getElementById('resultsSection').scrollIntoView({behavior:'smooth'});
}

function verRel(i){
  const dados=modo==='parcial'?dadosParcial:dadosFechamento;
  const html=gerarRelatorio(dados[i]);
  relAtual=html;relAtualNome=dados[i].nome;
  document.getElementById('modalTitle').textContent=`Relatório — ${dados[i].nome}`;
  document.getElementById('modalContent').innerHTML=html;
  document.getElementById('modalOverlay').classList.add('active');
}
function fecharModal(){document.getElementById('modalOverlay').classList.remove('active');}
function closeModal(e){if(e.target===document.getElementById('modalOverlay'))fecharModal();}

/* ============ IMPRESSÃO ============ */
const printCSS=`*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#2c3e50;font-size:13px;}.rel{padding:30px;max-width:860px;margin:0 auto;}.hd{border-bottom:3px solid #1a3c6e;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end;}.hd-left h1{font-size:19px;color:#1a3c6e;font-weight:800;}.hd-left h2{font-size:12px;color:#888;font-weight:400;margin-top:3px;}.hd-right{text-align:right;font-size:11px;color:#aaa;}.hd-right strong{display:block;color:#444;font-size:12px;}.rank-pill{display:inline-block;background:#1a3c6e;color:#fff;border-radius:30px;padding:4px 14px;font-size:11px;font-weight:700;margin-top:5px;}.sec{font-size:11px;font-weight:700;color:#1a3c6e;text-transform:uppercase;letter-spacing:1px;margin:22px 0 11px;border-left:4px solid #1a3c6e;padding-left:9px;}.top-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}.tc{border-radius:10px;padding:13px;text-align:center;}.tc .lbl{font-size:10px;color:#888;text-transform:uppercase;margin-bottom:5px;}.tc .val{font-size:20px;font-weight:800;}.tc .sub{font-size:10px;color:#aaa;margin-top:2px;}.tc-azul{background:#eef3fb;border:1px solid #c5d5ee;}.tc-verde{background:#eafaf1;border:1px solid #a9dfbf;}.tc-media{background:#fef9e7;border:1px solid #f9e79f;}.tc-baixa{background:#fdf2f2;border:1px solid #f5b7b1;}.c-azul{color:#1a3c6e;}.c-verde{color:#27ae60;}.c-media{color:#e67e22;}.c-baixa{color:#e74c3c;}.perf-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}.perf-card{border-radius:10px;padding:18px;}.p-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;}.p-num{font-size:34px;font-weight:800;line-height:1;}.p-status{font-size:11px;font-weight:700;margin-top:4px;}.p-ref{font-size:10px;color:#bbb;margin-top:3px;}table{width:100%;border-collapse:collapse;font-size:12px;}thead tr{background:#1a3c6e;color:#fff;}thead th{padding:8px 10px;text-align:left;font-size:11px;font-weight:600;}tbody tr:nth-child(even){background:#f7f9fc;}tbody td{padding:8px 10px;border-bottom:1px solid #eee;vertical-align:middle;}tfoot td{padding:9px 10px;font-weight:700;background:#e8edf5;border-top:2px solid #1a3c6e;}.tr{text-align:right;}.tc2{text-align:center;}.badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;color:#fff;}.b-green{background:#27ae60;}.b-orange{background:#e67e22;}.b-red{background:#e74c3c;}.bar-w{display:flex;align-items:center;gap:6px;}.bar-bg{flex:1;height:8px;background:#eee;border-radius:10px;overflow:hidden;}.bar-f{height:8px;border-radius:10px;}.bg-g{background:#27ae60;}.bg-o{background:#e67e22;}.bg-r{background:#e74c3c;}.bp{font-size:11px;font-weight:800;min-width:32px;text-align:right;}.comp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}.comp-card{border-radius:10px;padding:13px;border:1px solid #e0e6f0;}.comp-title{font-size:11px;font-weight:700;color:#1a3c6e;margin-bottom:9px;text-transform:uppercase;}.comp-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f5f5f5;font-size:11px;}.comp-row:last-child{border-bottom:none;}.cl{color:#888;}.cv{font-weight:600;}.prior-box{background:#fafbfc;border-radius:10px;border:1px solid #e0e6f0;padding:13px 17px;}.pi{display:flex;gap:9px;align-items:flex-start;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#444;line-height:1.45;}.pi:last-child{border-bottom:none;}.pdot{width:9px;height:9px;border-radius:50%;flex-shrink:0;margin-top:4px;}.d-r{background:#e74c3c;}.d-o{background:#e67e22;}.d-g{background:#27ae60;}.resumo-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.resumo-card{border-radius:10px;padding:16px;}.resumo-card.ok{background:#eafaf1;border:1px solid #a9dfbf;}.resumo-card.fail{background:#fdf2f2;border:1px solid #f5b7b1;}.resumo-card .rc-title{font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;}.resumo-card.ok .rc-title{color:#1e8449;}.resumo-card.fail .rc-title{color:#c0392b;}.resumo-item{font-size:12px;padding:5px 0;border-bottom:1px solid rgba(0,0,0,.05);display:flex;justify-content:space-between;}.resumo-item:last-child{border-bottom:none;}.status-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}.status-ok{background:#eafaf1;color:#27ae60;}.status-fail{background:#fdf2f2;color:#e74c3c;}.ft{margin-top:28px;padding-top:12px;border-top:1px solid #eee;font-size:11px;color:#bbb;display:flex;justify-content:space-between;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}`;
function printHTML(html,nome){const win=window.open('','_blank');win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório Individual - ${nome}</title><style>${printCSS}</style></head><body>${html}</body></html>`);win.document.close();setTimeout(()=>{win.focus();win.print();},600);}
function imprimirAtual(){if(relAtual)printHTML(relAtual,relAtualNome||'Relatorio');}
function imprimirRel(i){const d=(modo==='parcial'?dadosParcial:dadosFechamento)[i];printHTML(gerarRelatorio(d),d.nome);}
function imprimirTodos(){const dados=modo==='parcial'?dadosParcial:dadosFechamento;let h='';dados.filter(d=>d.nome).forEach((d,i)=>{h+=gerarRelatorio(d)+(i<dados.length-1?'<div style="page-break-after:always"></div>':'');});printHTML(h,'Relatorios_Lote');}

/* ============ ZIP ============ */
async function baixarZip(){
  if(modo!=='fechamento')return;
  const zip=new JSZip();
  const mes=document.getElementById('mesInput').value;
  dadosFechamento.filter(d=>d.nome&&d.nome.trim()).forEach(d=>{
    const nome=`Relatório Individual - ${d.nome.replace(/[\/\\:*?"<>|]/g,'_')}`;
    zip.file(`${nome}.html`,`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${nome}</title><style>${printCSS}</style></head><body>${relFechamento(d)}</body></html>`);
  });
  const blob=await zip.generateAsync({type:'blob'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`Relatorios_Fechamento_${mes.replace(/ /g,'_')}.zip`;a.click();
}

/* ============ DASHBOARD ============ */

// Inicializar com 3 linhas
dadosParcial.push(novoParcial());dadosParcial.push(novoParcial());dadosParcial.push(novoParcial());
renderParcial();
