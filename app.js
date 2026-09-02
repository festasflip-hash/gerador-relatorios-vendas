/* ============ ESTADO ============ */
// Persistência de dados com localStorage
const STORAGE_KEY = 'gerador_relatorios_v1';
const AUTO_SAVE_INTERVAL = 30000; // 30 segundos

const State = {
  modo: 'parcial',
  dadosParcial: [],
  dadosFechamento: [],
  relAtual: null,
  relAtualNome: null,
  editIdx: -1,
  editModo: 'parcial',

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        // Carregar apenas se for objeto válido
        if (state && typeof state === 'object') {
          this.modo = state.modo || this.modo;
          this.dadosParcial = Array.isArray(state.dadosParcial) ? state.dadosParcial : [];
          this.dadosFechamento = Array.isArray(state.dadosFechamento) ? state.dadosFechamento : [];
          this.relAtual = state.relAtual !== undefined ? state.relAtual : null;
          this.relAtualNome = state.relAtualNome !== undefined ? state.relAtualNome : null;
          this.editIdx = state.editIdx !== undefined ? state.editIdx : -1;
          this.editModo = state.editModo || this.editModo;
        }
      }
    } catch (e) {
      console.warn('Não foi possível carregar estado salvo:', e);
    }
  },

  save() {
    try {
      const state = {
        modo: this.modo,
        dadosParcial: this.dadosParcial,
        dadosFechamento: this.dadosFechamento,
        relAtual: this.relAtual,
        relAtualNome: this.relAtualNome,
        editIdx: this.editIdx,
        editModo: this.editModo,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Falha ao salvar estado:', e);
      // Não alertar aqui para não annoyar o usuário muito frequentemente
    }
  }
};

// Carregar estado salvo ao iniciar
State.load();

// Salvar periodicamente
setInterval(() => State.save(), AUTO_SAVE_INTERVAL);

/* ============ PESOS ============ */
const PESOS={nv:5,tm:10,ov:60,pos:15,mix:10};

/* ============ HELPERS ============ */
const f=v=>parseFloat((v||'').toString().replace(',','.'))||0;
const fmt=v=>v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
function perfClass(p){return p>=90?['c-verde','ALTA','tc-verde']:p>=50?['c-media','MÉDIA','tc-media']:['c-baixa','BAIXA','tc-baixa'];}
function badgeC(p){return p>=90?'b-green':p>=50?'b-orange':'b-red';}
function barC(p){return p>=90?'bg-g':p>=50?'bg-o':'bg-r';}
function txtC(p){return p>=90?'c-verde':p>=50?'c-media':'c-baixa';}
function colorHex(p){return p>=90?'#27ae60':p>=50?'#e67e22':'#e74c3c';}
function barHTML(p){const w=Math.min(Math.max(p,1),100);return `<div class="bar-w"><div class="bar-bg"><div class="bar-f ${barC(p)}" style="width:${w}%"></div></div><span class="bp ${txtC(p)}">${p.toFixed(0)}%</span></div>`;}
function statusPill(ok){return ok?`<span class="status-pill status-ok">✓ Meta Batida</span>`:`<span class="status-pill status-fail">✕ Não Batida</span>`;}

/* ============ CÁLCULOS AUTOMÁTICOS ============ */
function calcParcial(d){
  // NV resultado: (real/metaP)*peso, cap 100%
  const nvPct=f(d.nvMetaP)>0?Math.min(f(d.nvReal)/f(d.nvMetaP)*100,100):0;
  d.nvRes=(nvPct/100*PESOS.nv).toFixed(2);
  // TM pct e resultado
  const tmPct=f(d.tmMeta)>0?Math.min(f(d.tmReal)/f(d.tmMeta)*100,100):0;
  d.tmPct=tmPct.toFixed(2);
  // OV resultado
  const ovPct=f(d.ovMetaP)>0?Math.min(f(d.ovReal)/f(d.ovMetaP)*100,100):0;
  d.ovRes=(ovPct/100*PESOS.ov).toFixed(2);
  // POS resultado
  const posPct=f(d.posMetaP)>0?Math.min(f(d.posReal)/f(d.posMetaP)*100,100):0;
  d.posRes=(posPct/100*PESOS.pos).toFixed(2);
  // MIX resultado
  const mixPct=f(d.mixMetaP)>0?Math.min(f(d.mixReal)/f(d.mixMetaP)*100,100):0;
  d.mixRes=(mixPct/100*PESOS.mix).toFixed(2);
}
function calcFechamento(d){
  const nvPct=f(d.nvMeta)>0?Math.min(f(d.nvReal)/f(d.nvMeta)*100,100):0;
  d.nvRes=(nvPct/100*PESOS.nv).toFixed(2);
  const tmPct=f(d.tmMeta)>0?Math.min(f(d.tmReal)/f(d.tmMeta)*100,100):0;
  d.tmRes=(tmPct/100*PESOS.tm).toFixed(2);
  const ovPct=f(d.ovMeta)>0?Math.min(f(d.ovReal)/f(d.ovMeta)*100,100):0;
  d.ovRes=(ovPct/100*PESOS.ov).toFixed(2);
  const posPct=f(d.posMeta)>0?Math.min(f(d.posReal)/f(d.posMeta)*100,100):0;
  d.posRes=(posPct/100*PESOS.pos).toFixed(2);
  const mixPct=f(d.mixMeta)>0?Math.min(f(d.mixReal)/f(d.mixMeta)*100,100):0;
  d.mixRes=(mixPct/100*PESOS.mix).toFixed(2);
}

/* ============ TABS ============ */
function switchTab(m){
  State.modo=m;
  ['parcial','fechamento','dashboard'].forEach(t=>{
    document.getElementById('tab'+t.charAt(0).toUpperCase()+t.slice(1)).classList.toggle('active',State.modo===t);
  });
  document.getElementById('tableWrapParcial').classList.toggle('hidden',State.modo!=='parcial');
  document.getElementById('tableWrapFechamento').classList.toggle('hidden',State.modo!=='fechamento');
  document.getElementById('dashWrap').classList.toggle('hidden',State.modo!=='dashboard');
  document.getElementById('controlsBar').classList.toggle('hidden',State.modo==='dashboard');
  document.getElementById('legendBar').classList.toggle('hidden',State.modo==='dashboard');
  document.getElementById('resultsSection').style.display='none';
  const subs={parcial:'Modo: Acompanhamento Parcial',fechamento:'Modo: Fechamento do Mês',dashboard:'Modo: Dashboard Consolidado'};
  document.getElementById('topbarSub').textContent=subs[State.modo];
  if(State.modo!=='dashboard'){
    document.getElementById('ctrlTitle').textContent=State.modo==='parcial'?'Representantes — Parcial':'Representantes — Fechamento';
    document.getElementById('lblPeriodo').textContent=State.modo==='parcial'?'Período Parcial':'Período do Fechamento';
    document.getElementById('legendaExtra').textContent=State.modo==='fechamento'?'Status: Meta Batida / Não Batida':'';
  } else { renderDashboard(); }
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
  document.getElementById('tableBodyParcial').innerHTML=State.dadosParcial.map((d,i)=>`
    <tr>
      <td class="row-num">${i+1}</td>
      <td><input class="nome" value="${d.nome}" oninput="State.dadosParcial[${i}].nome=this.value" placeholder="Nome"></td>
      <td><input class="num" value="${d.ranking}" oninput="State.dadosParcial[${i}].ranking=this.value" placeholder="#"></td>
      <td><input class="num" value="${d.perfParcial}" oninput="State.dadosParcial[${i}].perfParcial=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.perfMensal}" oninput="State.dadosParcial[${i}].perfMensal=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.nvMetaP}" oninput="State.dadosParcial[${i}].nvMetaP=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.nvMetaM}" oninput="State.dadosParcial[${i}].nvMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.nvReal}" oninput="State.dadosParcial[${i}].nvReal=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.nvRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.tmMeta}" oninput="State.dadosParcial[${i}].tmMeta=this.value;autoCalcP(${i})" placeholder="3000"></td>
      <td><input class="num" value="${d.tmReal}" oninput="State.dadosParcial[${i}].tmReal=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.tmPct}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.ovMetaP}" oninput="State.dadosParcial[${i}].ovMetaP=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.ovMetaM}" oninput="State.dadosParcial[${i}].ovMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.ovReal}" oninput="State.dadosParcial[${i}].ovReal=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.ovRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.posMetaP}" oninput="State.dadosParcial[${i}].posMetaP=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.posMetaM}" oninput="State.dadosParcial[${i}].posMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.posReal}" oninput="State.dadosParcial[${i}].posReal=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.posRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.mixMetaP}" oninput="State.dadosParcial[${i}].mixMetaP=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.mixMetaM}" oninput="State.dadosParcial[${i}].mixMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.mixReal}" oninput="State.dadosParcial[${i}].mixReal=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.mixRes}" readonly title="Calculado automaticamente"></td>
      <td style="white-space:nowrap">
        <button class="edit-btn" onclick="abrirEdit(${i},'parcial')" title="Editar em formulário">✏️</button>
        <button class="del-btn" onclick="State.dadosParcial.splice(${i},1);renderParcial()" title="Remover">✕</button>
      </td>
    </tr>`).join('');
}
function autoCalcP(i){
  calcParcial(State.dadosParcial[i]);
  const cells=document.getElementById('tableBodyParcial').rows[i].cells;
  // atualiza campos calc: índices 8(nvRes),10(tmPct),15(ovRes),19(posRes),23(mixRes)
  const calcMap=[[8,'nvRes'],[10,'tmPct'],[15,'ovRes'],[19,'posRes'],[23,'mixRes']];
  calcMap.forEach(([ci,key])=>{cells[ci].querySelector('input').value=State.dadosParcial[i][key];});
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
  document.getElementById('tableBodyFechamento').innerHTML=State.dadosFechamento.map((d,i)=>`
    <tr>
      <td class="row-num">${i+1}</td>
      <td><input class="nome" value="${d.nome}" oninput="State.dadosFechamento[${i}].nome=this.value" placeholder="Nome"></td>
      <td><input class="num" value="${d.ranking}" oninput="State.dadosFechamento[${i}].ranking=this.value" placeholder="#"></td>
      <td><input class="num" value="${d.perfMensal}" oninput="State.dadosFechamento[${i}].perfMensal=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.nvMeta}" oninput="State.dadosFechamento[${i}].nvMeta=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.nvReal}" oninput="State.dadosFechamento[${i}].nvReal=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.nvRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.tmMeta}" oninput="State.dadosFechamento[${i}].tmMeta=this.value;autoCalcF(${i})" placeholder="3000"></td>
      <td><input class="num" value="${d.tmReal}" oninput="State.dadosFechamento[${i}].tmReal=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.tmRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.ovMeta}" oninput="State.dadosFechamento[${i}].ovMeta=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.ovReal}" oninput="State.dadosFechamento[${i}].ovReal=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.ovRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.posMeta}" oninput="State.dadosFechamento[${i}].posMeta=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.posReal}" oninput="State.dadosFechamento[${i}].posReal=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.posRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.mixMeta}" oninput="State.dadosFechamento[${i}].mixMeta=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.mixReal}" oninput="State.dadosFechamento[${i}].mixReal=this.value;autoCalcF(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.mixRes}" readonly title="Calculado automaticamente"></td>
      <td style="white-space:nowrap">
        <button class="edit-btn" onclick="abrirEdit(${i},'fechamento')" title="Editar em formulário">✏️</button>
        <button class="del-btn" onclick="State.dadosFechamento.splice(${i},1);renderFechamento()" title="Remover">✕</button>
      </td>
    </tr>`).join('');
}
function autoCalcF(i){
  calcFechamento(State.dadosFechamento[i]);
  const cells=document.getElementById('tableBodyFechamento').rows[i].cells;
  const calcMap=[[6,'nvRes'],[9,'tmRes'],[12,'ovRes'],[15,'posRes'],[18,'mixRes']];
  calcMap.forEach(([ci,key])=>{cells[ci].querySelector('input').value=State.dadosFechamento[i][key];});
}

/* ============ ADD / CLEAR ============ */
function addRow(){
  if(State.modo==='parcial'){State.dadosParcial.push(novoParcial());renderParcial();}
  else if(State.modo==='fechamento'){State.dadosFechamento.push(novoFechamento());renderFechamento();}
}
function clearAll(){
  if(State.modo==='dashboard')return;
  if(!confirm('Limpar todos os dados?'))return;
  if(State.modo==='parcial'){State.dadosParcial=[];renderParcial();}
  else{State.dadosFechamento=[];renderFechamento();}
  document.getElementById('resultsSection').style.display='none';
}

/* ============ MODAL EDIÇÃO ============ */
function abrirEdit(i, m){
  State.editIdx=i; State.editModo=m;
  const d=m==='parcial'?State.dadosParcial[i]:State.dadosFechamento[i];
  document.getElementById('editTitle').textContent=`✏️ Editar: ${d.nome||'Representante '+(i+1)}`;

  let html='';
  if(m==='parcial'){
    html=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <div class="edit-field"><label>Nome</label><input id="e_nome" value="${d.nome}" placeholder="Nome completo"></div>
      <div class="edit-field"><label>Ranking</label><input id="e_ranking" type="number" value="${d.ranking}"></div>
      <div class="edit-field"><label>Perf. Parcial %</label><input id="e_perfParcial" type="number" value="${d.perfParcial}"></div>
      <div class="edit-field"><label>Perf. Mensal %</label><input id="e_perfMensal" type="number" value="${d.perfMensal}"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="edit-section"><h4>Novas Vendas (peso 5)</h4>
        <div class="edit-field"><label>Meta Parcial</label><input id="e_nvMetaP" type="number" value="${d.nvMetaP}" oninput="previewCalcP()"></div>
        <div class="edit-field"><label>Meta Mensal</label><input id="e_nvMetaM" type="number" value="${d.nvMetaM}"></div>
        <div class="edit-field"><label>Realizado</label><input id="e_nvReal" type="number" value="${d.nvReal}" oninput="previewCalcP()"></div>
        <div class="edit-field"><label>Resultado 🟢</label><input id="e_nvRes" class="calc-field" readonly value="${d.nvRes}"></div>
      </div>
      <div class="edit-section"><h4>Ticket Médio (peso 10)</h4>
        <div class="edit-field"><label>Meta R$</label><input id="e_tmMeta" type="number" value="${d.tmMeta}" oninput="previewCalcP()"></div>
        <div class="edit-field"><label>Realizado R$</label><input id="e_tmReal" type="number" value="${d.tmReal}" oninput="previewCalcP()"></div>
        <div class="edit-field"><label>% Atingido 🟢</label><input id="e_tmPct" class="calc-field" readonly value="${d.tmPct}"></div>
      </div>
      <div class="edit-section"><h4>Objetivo de Vendas (peso 60)</h4>
        <div class="edit-field"><label>Meta Parcial R$</label><input id="e_ovMetaP" type="number" value="${d.ovMetaP}" oninput="previewCalcP()"></div>
        <div class="edit-field"><label>Meta Mensal R$</label><input id="e_ovMetaM" type="number" value="${d.ovMetaM}"></div>
        <div class="edit-field"><label>Realizado R$</label><input id="e_ovReal" type="number" value="${d.ovReal}" oninput="previewCalcP()"></div>
        <div class="edit-field"><label>Resultado 🟢</label><input id="e_ovRes" class="calc-field" readonly value="${d.ovRes}"></div>
      </div>
      <div class="edit-section"><h4>Positivação (peso 15)</h4>
        <div class="edit-field"><label>Meta Parcial</label><input id="e_posMetaP" type="number" value="${d.posMetaP}" oninput="previewCalcP()"></div>
        <div class="edit-field"><label>Meta Mensal</label><input id="e_posMetaM" type="number" value="${d.posMetaM}"></div>
        <div class="edit-field"><label>Realizado</label><input id="e_posReal" type="number" value="${d.posReal}" oninput="previewCalcP()"></div>
        <div class="edit-field"><label>Resultado 🟢</label><input id="e_posRes" class="calc-field" readonly value="${d.posRes}"></div>
      </div>
      <div class="edit-section" style="grid-column:1/-1"><h4>Mix de Vendas (peso 10)</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px">
          <div class="edit-field"><label>Meta Parcial</label><input id="e_mixMetaP" type="number" value="${d.mixMetaP}" oninput="previewCalcP()"></div>
          <div class="edit-field"><label>Meta Mensal</label><input id="e_mixMetaM" type="number" value="${d.mixMetaM}"></div>
          <div class="edit-field"><label>Realizado</label><input id="e_mixReal" type="number" value="${d.mixReal}" oninput="previewCalcP()"></div>
          <div class="edit-field"><label>Resultado 🟢</label><input id="e_mixRes" class="calc-field" readonly value="${d.mixRes}"></div>
        </div>
      </div>
    </div>`;
  } else {
    html=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <div class="edit-field"><label>Nome</label><input id="e_nome" value="${d.nome}" placeholder="Nome completo"></div>
      <div class="edit-field"><label>Ranking</label><input id="e_ranking" type="number" value="${d.ranking}"></div>
      <div class="edit-field" style="grid-column:1/-1"><label>Perf. Mensal %</label><input id="e_perfMensal" type="number" value="${d.perfMensal}"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="edit-section"><h4>Novas Vendas (peso 5)</h4>
        <div class="edit-field"><label>Meta</label><input id="e_nvMeta" type="number" value="${d.nvMeta}" oninput="previewCalcF()"></div>
        <div class="edit-field"><label>Realizado</label><input id="e_nvReal" type="number" value="${d.nvReal}" oninput="previewCalcF()"></div>
        <div class="edit-field"><label>Resultado 🟢</label><input id="e_nvRes" class="calc-field" readonly value="${d.nvRes}"></div>
      </div>
      <div class="edit-section"><h4>Ticket Médio (peso 10)</h4>
        <div class="edit-field"><label>Meta R$</label><input id="e_tmMeta" type="number" value="${d.tmMeta}" oninput="previewCalcF()"></div>
        <div class="edit-field"><label>Realizado R$</label><input id="e_tmReal" type="number" value="${d.tmReal}" oninput="previewCalcF()"></div>
        <div class="edit-field"><label>Resultado 🟢</label><input id="e_tmRes" class="calc-field" readonly value="${d.tmRes}"></div>
      </div>
      <div class="edit-section"><h4>Objetivo de Vendas (peso 60)</h4>
        <div class="edit-field"><label>Meta R$</label><input id="e_ovMeta" type="number" value="${d.ovMeta}" oninput="previewCalcF()"></div>
        <div class="edit-field"><label>Realizado R$</label><input id="e_ovReal" type="number" value="${d.ovReal}" oninput="previewCalcF()"></div>
        <div class="edit-field"><label>Resultado 🟢</label><input id="e_ovRes" class="calc-field" readonly value="${d.ovRes}"></div>
      </div>
      <div class="edit-section"><h4>Positivação (peso 15)</h4>
        <div class="edit-field"><label>Meta</label><input id="e_posMeta" type="number" value="${d.posMeta}" oninput="previewCalcF()"></div>
        <div class="edit-field"><label>Realizado</label><input id="e_posReal" type="number" value="${d.posReal}" oninput="previewCalcF()"></div>
        <div class="edit-field"><label>Resultado 🟢</label><input id="e_posRes" class="calc-field" readonly value="${d.posRes}"></div>
      </div>
      <div class="edit-section" style="grid-column:1/-1"><h4>Mix de Vendas (peso 10)</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
          <div class="edit-field"><label>Meta</label><input id="e_mixMeta" type="number" value="${d.mixMeta}" oninput="previewCalcF()"></div>
          <div class="edit-field"><label>Realizado</label><input id="e_mixReal" type="number" value="${d.mixReal}" oninput="previewCalcF()"></div>
          <div class="edit-field"><label>Resultado 🟢</label><input id="e_mixRes" class="calc-field" readonly value="${d.mixRes}"></div>
        </div>
      </div>
    </div>`;
  }
  html+=`<div class="edit-actions">
    <button class="btn-cancel" onclick="fecharEditModal()">Cancelar</button>
    <button class="btn-save-tpl" onclick="salvarComoTemplate()" title="Salvar metas deste representante como template">💾 Salvar Metas como Template</button>
    <button class="btn-save" onclick="salvarEdit()">✅ Confirmar</button>
  </div>`;
  document.getElementById('editBody').innerHTML=html;
  document.getElementById('editOverlay').classList.add('active');
}
function gv(id){const el=document.getElementById(id);return el?el.value:'';}
function previewCalcP(){
  const tmp={nvMetaP:gv('e_nvMetaP'),nvReal:gv('e_nvReal'),tmMeta:gv('e_tmMeta'),tmReal:gv('e_tmReal'),ovMetaP:gv('e_ovMetaP'),ovReal:gv('e_ovReal'),posMetaP:gv('e_posMetaP'),posReal:gv('e_posReal'),mixMetaP:gv('e_mixMetaP'),mixReal:gv('e_mixReal')};
  calcParcial(tmp);
  const map={e_nvRes:'nvRes',e_tmPct:'tmPct',e_ovRes:'ovRes',e_posRes:'posRes',e_mixRes:'mixRes'};
  Object.entries(map).forEach(([eid,key])=>{const el=document.getElementById(eid);if(el)el.value=tmp[key];});
}
function previewCalcF(){
  const tmp={nvMeta:gv('e_nvMeta'),nvReal:gv('e_nvReal'),tmMeta:gv('e_tmMeta'),tmReal:gv('e_tmReal'),ovMeta:gv('e_ovMeta'),ovReal:gv('e_ovReal'),posMeta:gv('e_posMeta'),posReal:gv('e_posReal'),mixMeta:gv('e_mixMeta'),mixReal:gv('e_mixReal')};
  calcFechamento(tmp);
  const map={e_nvRes:'nvRes',e_tmRes:'tmRes',e_ovRes:'ovRes',e_posRes:'posRes',e_mixRes:'mixRes'};
  Object.entries(map).forEach(([eid,key])=>{const el=document.getElementById(eid);if(el)el.value=tmp[key];});
}
function salvarEdit(){
  if(State.editModo==='parcial'){
    const d=State.dadosParcial[State.editIdx];
    d.nome=gv('e_nome');d.ranking=gv('e_ranking');d.perfParcial=gv('e_perfParcial');d.perfMensal=gv('e_perfMensal');
    d.nvMetaP=gv('e_nvMetaP');d.nvMetaM=gv('e_nvMetaM');d.nvReal=gv('e_nvReal');
    d.tmMeta=gv('e_tmMeta');d.tmReal=gv('e_tmReal');
    d.ovMetaP=gv('e_ovMetaP');d.ovMetaM=gv('e_ovMetaM');d.ovReal=gv('e_ovReal');
    d.posMetaP=gv('e_posMetaP');d.posMetaM=gv('e_posMetaM');d.posReal=gv('e_posReal');
    d.mixMetaP=gv('e_mixMetaP');d.mixMetaM=gv('e_mixMetaM');d.mixReal=gv('e_mixReal');
    calcParcial(d);renderParcial();
  } else {
    const d=State.dadosFechamento[State.editIdx];
    d.nome=gv('e_nome');d.ranking=gv('e_ranking');d.perfMensal=gv('e_perfMensal');
    d.nvMeta=gv('e_nvMeta');d.nvReal=gv('e_nvReal');
    d.tmMeta=gv('e_tmMeta');d.tmReal=gv('e_tmReal');
    d.ovMeta=gv('e_ovMeta');d.ovReal=gv('e_ovReal');
    d.posMeta=gv('e_posMeta');d.posReal=gv('e_posReal');
    d.mixMeta=gv('e_mixMeta');d.mixReal=gv('e_mixReal');
    calcFechamento(d);renderFechamento();
  }
  fecharEditModal();
}
function fecharEditModal(){document.getElementById('editOverlay').classList.remove('active');}
function closeEditModal(e){if(e.target===document.getElementById('editOverlay'))fecharEditModal();}

/* ============ TEMPLATES ============ */
const TPL_KEY='relatorios_templates_v1';
function getTemplates(){try{return JSON.parse(localStorage.getItem(TPL_KEY)||'[]');}catch{return[];}}
function saveTemplates(t){localStorage.setItem(TPL_KEY,JSON.stringify(t));}

function salvarComoTemplate(){
  const nome=gv('e_nome')||'Sem nome';
  const tpls=getTemplates();
  // metas fixas — sem realizados nem rankings
  const tpl={id:Date.now(),nome,modo:State.editModo,metas:{}};
  if(State.editModo==='parcial'){
    tpl.metas={nvMetaP:gv('e_nvMetaP'),nvMetaM:gv('e_nvMetaM'),tmMeta:gv('e_tmMeta'),ovMetaP:gv('e_ovMetaP'),ovMetaM:gv('e_ovMetaM'),posMetaP:gv('e_posMetaP'),posMetaM:gv('e_posMetaM'),mixMetaP:gv('e_mixMetaP'),mixMetaM:gv('e_mixMetaM')};
  } else {
    tpl.metas={nvMeta:gv('e_nvMeta'),tmMeta:gv('e_tmMeta'),ovMeta:gv('e_ovMeta'),posMeta:gv('e_posMeta'),mixMeta:gv('e_mixMeta')};
  }
  const existe=tpls.findIndex(t=>t.nome===nome&&t.modo===State.editModo);
  if(existe>=0){if(!confirm(`Template "${nome}" já existe. Sobrescrever?`))return;tpls[existe]=tpl;}
  else tpls.push(tpl);
  saveTemplates(tpls);
  alert(`✅ Template "${nome}" salvo com sucesso!`);
}

function abrirTemplateManager(){
  renderTplBody();
  document.getElementById('tplOverlay').classList.add('active');
}
function renderTplBody(){
  const tpls=getTemplates().filter(t=>t.modo===State.modo||State.modo==='dashboard');
  const body=document.getElementById('tplBody');
  if(!tpls.length){
    body.innerHTML=`<p style="color:#aaa;font-size:12px;text-align:center;padding:20px">Nenhum template salvo para o State.modo ${State.modo}.<br>Edite um representante e clique em "Salvar Metas como Template".</p>
    <div class="tpl-actions-row">
      <button class="btn btn-csv" onclick="document.getElementById('jsonFile').click()">📂 Importar JSON</button>
      <button class="btn btn-tpl" onclick="exportarJSON()">⬇ Exportar JSON</button>
    </div>`;
    return;
  }
  body.innerHTML=`<div class="tpl-list">${tpls.map((t,i)=>`
    <div class="tpl-item">
      <div><div class="ti-name">${t.nome}</div><div class="ti-sub">${t.modo==='parcial'?'Parcial':'Fechamento'} · ${Object.keys(t.metas).length} campos de meta</div></div>
      <button class="btn btn-add" onclick="aplicarTemplate(${t.id})" style="padding:5px 10px;font-size:11px">+ Aplicar</button>
      <button class="del-btn" onclick="deletarTemplate(${t.id})" style="font-size:11px">✕</button>
    </div>`).join('')}</div>
  <div class="tpl-actions-row">
    <button class="btn btn-csv" onclick="document.getElementById('jsonFile').click()">📂 Importar JSON</button>
    <button class="btn btn-tpl" onclick="exportarJSON()">⬇ Exportar JSON</button>
    <button class="btn btn-clear" onclick="if(confirm('Apagar todos os templates?')){localStorage.removeItem(TPL_KEY);renderTplBody()}">🗑 Apagar Todos</button>
  </div>`;
}
function aplicarTemplate(id){
  const t=getTemplates().find(x=>x.id===id);
  if(!t)return;
  if(t.modo==='parcial'){State.dadosParcial.push(novoParcial({nome:t.nome,...t.metas}));renderParcial();}
  else{State.dadosFechamento.push(novoFechamento({nome:t.nome,...t.metas}));renderFechamento();}
  fecharTplModal();
  alert(`✅ Template "${t.nome}" aplicado! Preencha os realizados na linha adicionada.`);
}
function deletarTemplate(id){
  if(!confirm('Remover este template?'))return;
  saveTemplates(getTemplates().filter(t=>t.id!==id));
  renderTplBody();
}
function exportarJSON(){
  const tpls=getTemplates();
  if(!tpls.length){alert('Nenhum template para exportar.');return;}
  const blob=new Blob([JSON.stringify(tpls,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='templates_relatorios.json';a.click();
}
function handleJSON(e){
  const file=e.target.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=ev=>{
    try{
      const imported=JSON.parse(ev.target.result);
      if(!Array.isArray(imported))throw new Error();
      const existing=getTemplates();
      let added=0;
      imported.forEach(t=>{if(t.id&&t.nome&&t.metas){if(!existing.find(x=>x.id===t.id)){existing.push(t);added++;}}});
      saveTemplates(existing);
      alert(`✅ ${added} template(s) importado(s)!`);
      renderTplBody();
    }catch{alert('Arquivo JSON inválido.');}
  };
  r.readAsText(file);e.target.value='';
}
function fecharTplModal(){document.getElementById('tplOverlay').classList.remove('active');}
function closeTplModal(e){if(e.target===document.getElementById('tplOverlay'))fecharTplModal();}

/* ============ CSV ============ */
function downloadModelo(){
  let h,ex;
  if(State.modo==='parcial'){h='Nome,Ranking,Perf_Parcial_%,Perf_Mensal_%,NV_MetaP,NV_MetaM,NV_Real,TM_Meta,TM_Real,OV_MetaP,OV_MetaM,OV_Real,POS_MetaP,POS_MetaM,POS_Real,MIX_MetaP,MIX_MetaM,MIX_Real';ex='Carlos Martins / RP,13,77,41,1.43,3,0,3000,2094.53,16666.67,35000,12567.16,5.71,12,6,60,125,64';}
  else{h='Nome,Ranking,Perf_Mensal_%,NV_Meta,NV_Real,TM_Meta,TM_Real,OV_Meta,OV_Real,POS_Meta,POS_Real,MIX_Meta,MIX_Real';ex='Carlos Martins / RP,13,41,3,1,3000,2200,35000,15000,12,7,125,70';}
  const blob=new Blob([h+'\n'+ex],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`modelo_${State.modo}.csv`;a.click();
}
function importCSV(){document.getElementById('csvFile').click();}
function handleCSV(e){
  const file=e.target.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=ev=>{
    const lines=ev.target.result.split('\n').filter(l=>l.trim());lines.shift();
    if(State.modo==='parcial'){
      State.dadosParcial=[];
      lines.forEach(l=>{const c=parseCSV(l);if(c[0]){const d=novoParcial({nome:c[0],ranking:c[1],perfParcial:c[2],perfMensal:c[3],nvMetaP:c[4],nvMetaM:c[5],nvReal:c[6],tmMeta:c[7],tmReal:c[8],ovMetaP:c[9],ovMetaM:c[10],ovReal:c[11],posMetaP:c[12],posMetaM:c[13],posReal:c[14],mixMetaP:c[15],mixMetaM:c[16],mixReal:c[17]});calcParcial(d);State.dadosParcial.push(d);}});
      renderParcial();
    }else{
      State.dadosFechamento=[];
      lines.forEach(l=>{const c=parseCSV(l);if(c[0]){const d=novoFechamento({nome:c[0],ranking:c[1],perfMensal:c[2],nvMeta:c[3],nvReal:c[4],tmMeta:c[5],tmReal:c[6],ovMeta:c[7],ovReal:c[8],posMeta:c[9],posReal:c[10],mixMeta:c[11],mixReal:c[12]});calcFechamento(d);State.dadosFechamento.push(d);}});
      renderFechamento();
    }
    alert('✅ Importado e calculado com sucesso!');
  };
  r.readAsText(file);e.target.value='';
}
function parseCSV(l){const r=[];let cur='',q=false;for(let i=0;i<l.length;i++){const c=l[i];if(c==='"'){q=!q;}else if(c===','&&!q){r.push(cur.trim());cur='';}else{cur+=c;}}r.push(cur.trim());return r;}

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
  return `<div class="rel">
    <div class="hd"><div class="hd-left"><h1>Relatório Individual de Desempenho</h1><h2>${d.nome} · ${mes}</h2></div><div class="hd-right"><strong>Referência: ${periodo}</strong><div class="rank-pill">🏆 ${d.ranking}º lugar no ranking</div></div></div>
    <div class="sec">Visão Geral</div>
    <div class="top-cards">
      <div class="tc tc-azul"><div class="lbl">Posição</div><div class="val c-azul">${d.ranking}º</div><div class="sub">ranking</div></div>
      <div class="tc ${ppTc}"><div class="lbl">Perf. Parcial</div><div class="val ${ppCls}">${pp}%</div><div class="sub">${periodo}</div></div>
      <div class="tc ${pmTc}"><div class="lbl">Perf. Mensal</div><div class="val ${pmCls}">${pm}%</div><div class="sub">${mes}</div></div>
      <div class="tc tc-azul"><div class="lbl">Resultado</div><div class="val c-azul">${tot}</div><div class="sub">de 100 pts</div></div>
    </div>
    <div class="sec">Performance Detalhada</div>
    <div class="perf-row">
      <div class="perf-card ${ppTc}"><div class="p-lbl ${ppCls}">Performance Parcial</div><div class="p-num ${ppCls}">${pp}%</div><div class="p-status ${ppCls}">● ${ppLbl}</div><div class="p-ref">${periodo}</div></div>
      <div class="perf-card ${pmTc}"><div class="p-lbl ${pmCls}">Performance Mensal</div><div class="p-num ${pmCls}">${pm}%</div><div class="p-status ${pmCls}">● ${pmLbl}</div><div class="p-ref">${mes} completo</div></div>
    </div>
    <div class="sec">Indicadores — Parcial</div>
    <table>
      <thead><tr><th>Indicador</th><th class="tr">Meta</th><th class="tr">Realizado</th><th class="tc2">%</th><th class="tc2">Peso</th><th style="width:140px">Progresso</th><th class="tc2">Resultado</th></tr></thead>
      <tbody>
        <tr><td><strong>Novas Vendas</strong></td><td class="tr">${d.nvMetaP} Qtd</td><td class="tr">${d.nvReal} Qtd</td><td class="tc2">${nvPct.toFixed(0)}%</td><td class="tc2">5</td><td>${barHTML(nvPct)}</td><td class="tc2"><span class="badge ${badgeC(nvPct)}">${fmt(f(d.nvRes))}</span></td></tr>
        <tr><td><strong>Ticket Médio</strong></td><td class="tr">R$ ${fmt(f(d.tmMeta))}</td><td class="tr">R$ ${fmt(f(d.tmReal))}</td><td class="tc2">${tmPct.toFixed(0)}%</td><td class="tc2">10</td><td>${barHTML(tmPct)}</td><td class="tc2"><span class="badge ${badgeC(tmPct)}">${tmPct>=100?'10,00':fmt(tmPct/10)}</span></td></tr>
        <tr><td><strong>Objetivo de Vendas</strong></td><td class="tr">R$ ${fmt(f(d.ovMetaP))}</td><td class="tr">R$ ${fmt(f(d.ovReal))}</td><td class="tc2">${ovPctP.toFixed(0)}%</td><td class="tc2">60</td><td>${barHTML(ovPctP)}</td><td class="tc2"><span class="badge ${badgeC(ovPctP)}">${fmt(f(d.ovRes))}</span></td></tr>
        <tr><td><strong>Positivação</strong></td><td class="tr">${d.posMetaP} Qtd</td><td class="tr">${d.posReal} Qtd</td><td class="tc2">${posPct.toFixed(0)}%</td><td class="tc2">15</td><td>${barHTML(posPct)}</td><td class="tc2"><span class="badge ${badgeC(posPct)}">${fmt(f(d.posRes))}</span></td></tr>
        <tr><td><strong>Mix de Vendas</strong></td><td class="tr">${d.mixMetaP} SKUs</td><td class="tr">${d.mixReal} SKUs</td><td class="tc2">${mixPct.toFixed(0)}%</td><td class="tc2">10</td><td>${barHTML(mixPct)}</td><td class="tc2"><span class="badge ${badgeC(mixPct)}">${fmt(f(d.mixRes))}</span></td></tr>
      </tbody>
      <tfoot><tr><td colspan="6"><strong>Resultado Total</strong></td><td class="tc2"><strong>${tot} pts</strong></td></tr></tfoot>
    </table>
    <div class="sec">Comparativo — Parcial vs Meta Mensal</div>
    <div class="comp-grid">
      <div class="comp-card"><div class="comp-title">📅 Parcial</div>
        <div class="comp-row"><span class="cl">Novas Vendas</span><span class="cv">${d.nvReal} / ${d.nvMetaP} ${f(d.nvReal)>=f(d.nvMetaP)?'✓':''}</span></div>
        <div class="comp-row"><span class="cl">Ticket Médio</span><span class="cv">R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))} ${f(d.tmReal)>=f(d.tmMeta)?'✓':''}</span></div>
        <div class="comp-row"><span class="cl">Obj. Vendas</span><span class="cv">R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMetaP))} ${f(d.ovReal)>=f(d.ovMetaP)?'✓':''}</span></div>
        <div class="comp-row"><span class="cl">Positivação</span><span class="cv">${d.posReal} / ${d.posMetaP} ${f(d.posReal)>=f(d.posMetaP)?'✓':''}</span></div>
        <div class="comp-row"><span class="cl">Mix de Vendas</span><span class="cv">${d.mixReal} / ${d.mixMetaP} SKUs ${f(d.mixReal)>=f(d.mixMetaP)?'✓':''}</span></div>
      </div>
      <div class="comp-card"><div class="comp-title">🗓 Meta Mensal</div>
        <div class="comp-row"><span class="cl">Novas Vendas</span><span class="cv ${f(d.nvReal)>=f(d.nvMetaM)?'c-verde':'c-baixa'}">${d.nvReal} / ${d.nvMetaM} ${f(d.nvMetaM)-f(d.nvReal)>0?'— faltam '+(f(d.nvMetaM)-f(d.nvReal)).toFixed(0):'✓'}</span></div>
        <div class="comp-row"><span class="cl">Ticket Médio</span><span class="cv ${f(d.tmReal)>=f(d.tmMeta)?'c-verde':'c-media'}">R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))} ${f(d.tmReal)>=f(d.tmMeta)?'✓':'— faltam R$ '+fmt(f(d.tmMeta)-f(d.tmReal))}</span></div>
        <div class="comp-row"><span class="cl">Obj. Vendas</span><span class="cv ${f(d.ovReal)>=f(d.ovMetaM)?'c-verde':'c-baixa'}">R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMetaM))} (${ovPctM.toFixed(0)}%) ${f(d.ovMetaM)-f(d.ovReal)>0?'— faltam R$ '+fmt(f(d.ovMetaM)-f(d.ovReal)):'✓'}</span></div>
        <div class="comp-row"><span class="cl">Positivação</span><span class="cv ${f(d.posReal)>=f(d.posMetaM)?'c-verde':'c-media'}">${d.posReal} / ${d.posMetaM} ${f(d.posMetaM)-f(d.posReal)>0?'— faltam '+(f(d.posMetaM)-f(d.posReal)).toFixed(0):'✓'}</span></div>
        <div class="comp-row"><span class="cl">Mix de Vendas</span><span class="cv ${f(d.mixReal)>=f(d.mixMetaM)?'c-verde':'c-media'}">${d.mixReal} / ${d.mixMetaM} SKUs ${f(d.mixMetaM)-f(d.mixReal)>0?'— faltam '+(f(d.mixMetaM)-f(d.mixReal)).toFixed(0):'✓'}</span></div>
      </div>
    </div>
    <div class="sec">⚡ Prioridades até o fim do mês</div>
    <div class="prior-box">${priorParcial(d)}</div>
    <div class="ft"><span>Relatório Individual · ${d.nome} · ${mes}</span><span>Confidencial · Diretoria Comercial</span></div>
  </div>`;
}

/* ============ RELATÓRIO FECHAMENTO ============ */
function relFechamento(d){
  const periodo=document.getElementById('periodoInput').value,mes=document.getElementById('mesInput').value;
  const pm=f(d.perfMensal);const [pmCls,pmLbl,pmTc]=perfClass(pm);
  const nvOk=f(d.nvReal)>=f(d.nvMeta),tmOk=f(d.tmReal)>=f(d.tmMeta),ovOk=f(d.ovReal)>=f(d.ovMeta),posOk=f(d.posReal)>=f(d.posMeta),mixOk=f(d.mixReal)>=f(d.mixMeta);
  const bat=[nvOk,tmOk,ovOk,posOk,mixOk].filter(Boolean).length;
  const tot=Math.round((f(d.nvRes)+f(d.tmRes)+f(d.ovRes)+f(d.posRes)+f(d.mixRes))*100)/100;
  const okI=[],failI=[];
  if(nvOk)okI.push(`<div class="resumo-item"><span>Novas Vendas</span><strong>${d.nvReal} / ${d.nvMeta}</strong></div>`);
  else failI.push(`<div class="resumo-item"><span>Novas Vendas</span><strong>${d.nvReal} / ${d.nvMeta} (faltaram ${(f(d.nvMeta)-f(d.nvReal)).toFixed(0)})</strong></div>`);
  if(tmOk)okI.push(`<div class="resumo-item"><span>Ticket Médio</span><strong>R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))}</strong></div>`);
  else failI.push(`<div class="resumo-item"><span>Ticket Médio</span><strong>R$ ${fmt(f(d.tmReal))} / R$ ${fmt(f(d.tmMeta))} (faltaram R$ ${fmt(f(d.tmMeta)-f(d.tmReal))})</strong></div>`);
  if(ovOk)okI.push(`<div class="resumo-item"><span>Obj. de Vendas</span><strong>R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMeta))}</strong></div>`);
  else failI.push(`<div class="resumo-item"><span>Obj. de Vendas</span><strong>R$ ${fmt(f(d.ovReal))} / R$ ${fmt(f(d.ovMeta))} (faltaram R$ ${fmt(f(d.ovMeta)-f(d.ovReal))})</strong></div>`);
  if(posOk)okI.push(`<div class="resumo-item"><span>Positivação</span><strong>${d.posReal} / ${d.posMeta}</strong></div>`);
  else failI.push(`<div class="resumo-item"><span>Positivação</span><strong>${d.posReal} / ${d.posMeta} (faltaram ${(f(d.posMeta)-f(d.posReal)).toFixed(0)})</strong></div>`);
  if(mixOk)okI.push(`<div class="resumo-item"><span>Mix de Vendas</span><strong>${d.mixReal} / ${d.mixMeta} SKUs</strong></div>`);
  else failI.push(`<div class="resumo-item"><span>Mix de Vendas</span><strong>${d.mixReal} / ${d.mixMeta} SKUs (faltaram ${(f(d.mixMeta)-f(d.mixReal)).toFixed(0)})</strong></div>`);
  return `<div class="rel">
    <div class="hd"><div class="hd-left"><h1>Relatório de Fechamento do Mês</h1><h2>${d.nome} · ${mes}</h2></div><div class="hd-right"><strong>Período: ${periodo}</strong><div class="rank-pill">🏆 ${d.ranking}º lugar no ranking</div></div></div>
    <div class="sec">Visão Geral</div>
    <div class="top-cards">
      <div class="tc tc-azul"><div class="lbl">Posição</div><div class="val c-azul">${d.ranking}º</div><div class="sub">ranking</div></div>
      <div class="tc ${pmTc}"><div class="lbl">Performance Final</div><div class="val ${pmCls}">${pm}%</div><div class="sub">${mes}</div></div>
      <div class="tc tc-azul"><div class="lbl">Resultado Total</div><div class="val c-azul">${tot}</div><div class="sub">de 100 pontos</div></div>
      <div class="tc ${bat===5?'tc-verde':bat===0?'tc-baixa':'tc-media'}"><div class="lbl">Metas Batidas</div><div class="val ${bat===5?'c-verde':bat===0?'c-baixa':'c-media'}">${bat}/5</div><div class="sub">indicadores</div></div>
    </div>
    <div class="sec">Performance Final</div>
    <div class="perf-row"><div class="perf-card ${pmTc}" style="grid-column:1/-1"><div class="p-lbl ${pmCls}">Performance Mensal — Fechamento</div><div class="p-num ${pmCls}">${pm}%</div><div class="p-status ${pmCls}">● ${pmLbl}</div><div class="p-ref">${mes} (mês encerrado)</div></div></div>
    <div class="sec">Indicadores — Resultado Final</div>
    <table>
      <thead><tr><th>Indicador</th><th class="tr">Meta</th><th class="tr">Realizado</th><th class="tc2">Status</th><th class="tc2">Peso</th><th class="tc2">Resultado</th></tr></thead>
      <tbody>
        <tr><td><strong>Novas Vendas</strong></td><td class="tr">${d.nvMeta} Qtd</td><td class="tr">${d.nvReal} Qtd</td><td class="tc2">${statusPill(nvOk)}</td><td class="tc2">5</td><td class="tc2"><span class="badge ${nvOk?'b-green':'b-red'}">${fmt(f(d.nvRes))}</span></td></tr>
        <tr><td><strong>Ticket Médio</strong></td><td class="tr">R$ ${fmt(f(d.tmMeta))}</td><td class="tr">R$ ${fmt(f(d.tmReal))}</td><td class="tc2">${statusPill(tmOk)}</td><td class="tc2">10</td><td class="tc2"><span class="badge ${tmOk?'b-green':'b-red'}">${fmt(f(d.tmRes))}</span></td></tr>
        <tr><td><strong>Objetivo de Vendas</strong></td><td class="tr">R$ ${fmt(f(d.ovMeta))}</td><td class="tr">R$ ${fmt(f(d.ovReal))}</td><td class="tc2">${statusPill(ovOk)}</td><td class="tc2">60</td><td class="tc2"><span class="badge ${ovOk?'b-green':'b-red'}">${fmt(f(d.ovRes))}</span></td></tr>
        <tr><td><strong>Positivação</strong></td><td class="tr">${d.posMeta} Qtd</td><td class="tr">${d.posReal} Qtd</td><td class="tc2">${statusPill(posOk)}</td><td class="tc2">15</td><td class="tc2"><span class="badge ${posOk?'b-green':'b-red'}">${fmt(f(d.posRes))}</span></td></tr>
        <tr><td><strong>Mix de Vendas</strong></td><td class="tr">${d.mixMeta} SKUs</td><td class="tr">${d.mixReal} SKUs</td><td class="tc2">${statusPill(mixOk)}</td><td class="tc2">10</td><td class="tc2"><span class="badge ${mixOk?'b-green':'b-red'}">${fmt(f(d.mixRes))}</span></td></tr>
      </tbody>
      <tfoot><tr><td colspan="5"><strong>Resultado Total</strong></td><td class="tc2"><strong>${tot} pts</strong></td></tr></tfoot>
    </table>
    <div class="sec">Resumo do Mês</div>
    <div class="resumo-grid">
      <div class="resumo-card ok"><div class="rc-title">✅ Metas Batidas (${okI.length})</div>${okI.length?okI.join(''):'<div class="resumo-item">Nenhuma meta batida</div>'}</div>
      <div class="resumo-card fail"><div class="rc-title">⚠️ Não Batidas (${failI.length})</div>${failI.length?failI.join(''):'<div class="resumo-item">Todas as metas foram batidas! 🎉</div>'}</div>
    </div>
    <div class="sec">🎯 Ações Recomendadas para o Próximo Mês</div>
    <div class="prior-box">${acoesAuto(d)}</div>
    <div class="ft"><span>Relatório de Fechamento · ${d.nome} · ${mes}</span><span>Confidencial · Diretoria Comercial</span></div>
  </div>`;
}

function gerarRelatorio(d){return State.modo==='parcial'?relParcial(d):relFechamento(d);}

/* ============ GERAR / VISUALIZAR ============ */
function gerarTodos(){
  if(State.modo==='dashboard')return;
  const dados=State.modo==='parcial'?State.dadosParcial:State.dadosFechamento;
  const validos=dados.filter(d=>d.nome&&d.nome.trim());
  if(!validos.length){alert('Adicione ao menos um representante com nome!');return;}
  const list=document.getElementById('repList');
  list.innerHTML='';
  validos.forEach((d,i)=>{
    const pm=f(d.perfMensal),pp=State.modo==='parcial'?f(d.perfParcial):null;
    const [pmCls,pmLbl,pmTc]=perfClass(pm);
    const div=document.createElement('div');div.className='rep-card-mini';
    let p2=State.modo==='parcial'
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
  document.getElementById('btnZipAll').style.display=State.modo==='fechamento'?'block':'none';
  document.getElementById('resultsSection').scrollIntoView({behavior:'smooth'});
}

function verRel(i){
  const dados=State.modo==='parcial'?State.dadosParcial:State.dadosFechamento;
  const html=gerarRelatorio(dados[i]);
  State.relAtual=html;State.relAtualNome=dados[i].nome;
  document.getElementById('modalTitle').textContent=`Relatório — ${dados[i].nome}`;
  document.getElementById('modalContent').innerHTML=html;
  document.getElementById('modalOverlay').classList.add('active');
}
function fecharModal(){document.getElementById('modalOverlay').classList.remove('active');}
function closeModal(e){if(e.target===document.getElementById('modalOverlay'))fecharModal();}

/* ============ IMPRESSÃO ============ */
const printCSS=`*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#2c3e50;font-size:13px;}.rel{padding:30px;max-width:860px;margin:0 auto;}.hd{border-bottom:3px solid #1a3c6e;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end;}.hd-left h1{font-size:19px;color:#1a3c6e;font-weight:800;}.hd-left h2{font-size:12px;color:#888;font-weight:400;margin-top:3px;}.hd-right{text-align:right;font-size:11px;color:#aaa;}.hd-right strong{display:block;color:#444;font-size:12px;}.rank-pill{display:inline-block;background:#1a3c6e;color:#fff;border-radius:30px;padding:4px 14px;font-size:11px;font-weight:700;margin-top:5px;}.sec{font-size:11px;font-weight:700;color:#1a3c6e;text-transform:uppercase;letter-spacing:1px;margin:22px 0 11px;border-left:4px solid #1a3c6e;padding-left:9px;}.top-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}.tc{border-radius:10px;padding:13px;text-align:center;}.tc .lbl{font-size:10px;color:#888;text-transform:uppercase;margin-bottom:5px;}.tc .val{font-size:20px;font-weight:800;}.tc .sub{font-size:10px;color:#aaa;margin-top:2px;}.tc-azul{background:#eef3fb;border:1px solid #c5d5ee;}.tc-verde{background:#eafaf1;border:1px solid #a9dfbf;}.tc-media{background:#fef9e7;border:1px solid #f9e79f;}.tc-baixa{background:#fdf2f2;border:1px solid #f5b7b1;}.c-azul{color:#1a3c6e;}.c-verde{color:#27ae60;}.c-media{color:#e67e22;}.c-baixa{color:#e74c3c;}.perf-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}.perf-card{border-radius:10px;padding:18px;}.p-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;}.p-num{font-size:34px;font-weight:800;line-height:1;}.p-status{font-size:11px;font-weight:700;margin-top:4px;}.p-ref{font-size:10px;color:#bbb;margin-top:3px;}table{width:100%;border-collapse:collapse;font-size:12px;}thead tr{background:#1a3c6e;color:#fff;}thead th{padding:8px 10px;text-align:left;font-size:11px;font-weight:600;}tbody tr:nth-child(even){background:#f7f9fc;}tbody td{padding:8px 10px;border-bottom:1px solid #eee;vertical-align:middle;}tfoot td{padding:9px 10px;font-weight:700;background:#e8edf5;border-top:2px solid #1a3c6e;}.tr{text-align:right;}.tc2{text-align:center;}.badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;color:#fff;}.b-green{background:#27ae60;}.b-orange{background:#e67e22;}.b-red{background:#e74c3c;}.bar-w{display:flex;align-items:center;gap:6px;}.bar-bg{flex:1;height:8px;background:#eee;border-radius:10px;overflow:hidden;}.bar-f{height:8px;border-radius:10px;}.bg-g{background:#27ae60;}.bg-o{background:#e67e22;}.bg-r{background:#e74c3c;}.bp{font-size:11px;font-weight:800;min-width:32px;text-align:right;}.comp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}.comp-card{border-radius:10px;padding:13px;border:1px solid #e0e6f0;}.comp-title{font-size:11px;font-weight:700;color:#1a3c6e;margin-bottom:9px;text-transform:uppercase;}.comp-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f5f5f5;font-size:11px;}.comp-row:last-child{border-bottom:none;}.cl{color:#888;}.cv{font-weight:600;}.prior-box{background:#fafbfc;border-radius:10px;border:1px solid #e0e6f0;padding:13px 17px;}.pi{display:flex;gap:9px;align-items:flex-start;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#444;line-height:1.45;}.pi:last-child{border-bottom:none;}.pdot{width:9px;height:9px;border-radius:50%;flex-shrink:0;margin-top:4px;}.d-r{background:#e74c3c;}.d-o{background:#e67e22;}.d-g{background:#27ae60;}.resumo-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.resumo-card{border-radius:10px;padding:16px;}.resumo-card.ok{background:#eafaf1;border:1px solid #a9dfbf;}.resumo-card.fail{background:#fdf2f2;border:1px solid #f5b7b1;}.resumo-card .rc-title{font-size:11px;font-weight:700;margin-bottom:10px;text-transform:uppercase;}.resumo-card.ok .rc-title{color:#1e8449;}.resumo-card.fail .rc-title{color:#c0392b;}.resumo-item{font-size:12px;padding:5px 0;border-bottom:1px solid rgba(0,0,0,.05);display:flex;justify-content:space-between;}.resumo-item:last-child{border-bottom:none;}.status-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}.status-ok{background:#eafaf1;color:#27ae60;}.status-fail{background:#fdf2f2;color:#e74c3c;}.ft{margin-top:28px;padding-top:12px;border-top:1px solid #eee;font-size:11px;color:#bbb;display:flex;justify-content:space-between;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}`;
function printHTML(html,nome){const win=window.open('','_blank');win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório Individual - ${nome}</title><style>${printCSS}</style></head><body>${html}</body></html>`);win.document.close();setTimeout(()=>{win.focus();win.print();},600);}
function imprimirAtual(){if(State.relAtual)printHTML(State.relAtual,State.relAtualNome||'Relatorio');}
function imprimirRel(i){const d=(State.modo==='parcial'?State.dadosParcial:State.dadosFechamento)[i];printHTML(gerarRelatorio(d),d.nome);}
function imprimirTodos(){const dados=State.modo==='parcial'?State.dadosParcial:State.dadosFechamento;let h='';dados.filter(d=>d.nome).forEach((d,i)=>{h+=gerarRelatorio(d)+(i<dados.length-1?'<div style="page-break-after:always"></div>':'');});printHTML(h,'Relatorios_Lote');}

/* ============ ZIP ============ */
async function baixarZip(){
  if(State.modo!=='fechamento')return;
  const zip=new JSZip();
  const mes=document.getElementById('mesInput').value;
  State.dadosFechamento.filter(d=>d.nome&&d.nome.trim()).forEach(d=>{
    const nome=`Relatório Individual - ${d.nome.replace(/[\/\\:*?"<>|]/g,'_')}`;
    zip.file(`${nome}.html`,`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${nome}</title><style>${printCSS}</style></head><body>${relFechamento(d)}</body></html>`);
  });
  const blob=await zip.generateAsync({type:'blob'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`Relatorios_Fechamento_${mes.replace(/ /g,'_')}.zip`;a.click();
}

/* ============ DASHBOARD ============ */
function renderDashboard(){
  const temF=State.dadosFechamento.some(d=>d.nome&&d.nome.trim());
  const temP=State.dadosParcial.some(d=>d.nome&&d.nome.trim());
  const wrap=document.getElementById('dashWrap');
  if(!temF&&!temP){wrap.innerHTML=`<div class="dash-section"><div class="dash-empty"><div class="icon">📈</div><p>Preencha a tabela Parcial ou Fechamento para ver o dashboard.</p></div></div>`;return;}
  const fonte=temF?'fechamento':'parcial';
  const dados=(fonte==='fechamento'?State.dadosFechamento:State.dadosParcial).filter(d=>d.nome&&d.nome.trim());
  const mes=document.getElementById('mesInput').value;
  const periodo=document.getElementById('periodoInput').value;
  const perfs=dados.map(d=>f(d.perfMensal));
  const alta=perfs.filter(p=>p>=90).length,media=perfs.filter(p=>p>=50&&p<90).length,baixa=perfs.filter(p=>p<50).length,total=dados.length;
  const mediaEq=total>0?perfs.reduce((a,b)=>a+b,0)/total:0;
  let totalVendido=0,totalMeta=0;
  dados.forEach(d=>{totalVendido+=f(d.ovReal);totalMeta+=fonte==='fechamento'?f(d.ovMeta):f(d.ovMetaM);});
  const pctEq=totalMeta>0?totalVendido/totalMeta*100:0;
  const inds=[
    {key:'ov',label:'Objetivo de Vendas',peso:60,mK:fonte==='fechamento'?'ovMeta':'ovMetaM'},
    {key:'pos',label:'Positivação',peso:15,mK:fonte==='fechamento'?'posMeta':'posMetaM'},
    {key:'tm',label:'Ticket Médio',peso:10,mK:'tmMeta'},
    {key:'mix',label:'Mix de Vendas',peso:10,mK:fonte==='fechamento'?'mixMeta':'mixMetaM'},
    {key:'nv',label:'Novas Vendas',peso:5,mK:fonte==='fechamento'?'nvMeta':'nvMetaM'}
  ];
  const gargalos=inds.map(ind=>{let soma=0,cnt=0;dados.forEach(d=>{const meta=f(d[ind.mK]),real=f(d[ind.key+'Real']);if(meta>0){soma+=Math.min(real/meta*100,150);cnt++;}});return{...ind,pctMedio:cnt>0?soma/cnt:0};}).sort((a,b)=>a.pctMedio-b.pctMedio);
  const ranking=[...dados].sort((a,b)=>f(b.perfMensal)-f(a.perfMensal));
  const topPerf=ranking.slice(0,3);
  const semMeta=fonte==='fechamento'?dados.filter(d=>{const nvOk=f(d.nvReal)>=f(d.nvMeta),tmOk=f(d.tmReal)>=f(d.tmMeta),ovOk=f(d.ovReal)>=f(d.ovMeta),posOk=f(d.posReal)>=f(d.posMeta),mixOk=f(d.mixReal)>=f(d.mixMeta);return![nvOk,tmOk,ovOk,posOk,mixOk].some(Boolean);}):[];
  const abaixoMedia=dados.filter(d=>f(d.perfMensal)<mediaEq).sort((a,b)=>f(a.perfMensal)-f(b.perfMensal));
  const piorInd=gargalos[0];
  const melhorInd=[...gargalos].sort((a,b)=>b.pctMedio-a.pctMedio)[0];
  const narrativas=[];
  if(baixa>0)narrativas.push({c:'#e74c3c',t:`${baixa} representante(s) com performance <strong>abaixo de 50%</strong> — ação imediata recomendada.`});
  if(semMeta.length>0)narrativas.push({c:'#e74c3c',t:`${semMeta.length} representante(s) <strong>sem nenhuma meta batida</strong>: ${semMeta.map(d=>d.nome).join(', ')}.`});
  if(piorInd.pctMedio<60)narrativas.push({c:'#e67e22',t:`<strong>${piorInd.label}</strong> é o gargalo coletivo — média da equipe em <strong>${piorInd.pctMedio.toFixed(0)}%</strong>.`});
  if(abaixoMedia.length>0)narrativas.push({c:'#e67e22',t:`${abaixoMedia.length} representante(s) abaixo da média (${mediaEq.toFixed(0)}%): ${abaixoMedia.slice(0,5).map(d=>d.nome+' ('+f(d.perfMensal)+'%)').join(', ')}${abaixoMedia.length>5?'…':''}.`});
  const positivas=[];
  if(alta>0)positivas.push({c:'#27ae60',t:`${alta} representante(s) em <strong>ALTA performance</strong> (≥90%)${alta===total?' — 100% da equipe!':' — referências da equipe'}.`});
  if(melhorInd.pctMedio>=90)positivas.push({c:'#27ae60',t:`<strong>${melhorInd.label}</strong> é o indicador mais forte — média da equipe em <strong>${melhorInd.pctMedio.toFixed(0)}%</strong>.`});
  if(pctEq>=90)positivas.push({c:'#27ae60',t:`Equipe atingiu <strong>${pctEq.toFixed(0)}%</strong> do Objetivo de Vendas consolidado.`});

  wrap.innerHTML=`
    <div class="dash-grid-top">
      <div class="dash-card"><div class="dc-lbl">Representantes</div><div class="dc-val">${total}</div><div class="dc-sub">${mes}</div></div>
      <div class="dash-card"><div class="dc-lbl">Performance Média</div><div class="dc-val" style="color:${colorHex(mediaEq)}">${mediaEq.toFixed(0)}%</div><div class="dc-sub">${mediaEq>=90?'ALTA':mediaEq>=50?'MÉDIA':'BAIXA'} — equipe</div></div>
      <div class="dash-card" style="text-align:left;padding:16px 18px">
        <div class="dc-lbl" style="text-align:center;margin-bottom:10px">Objetivo de Vendas — Equipe</div>
        <div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:11px;color:#888">Meta consolidada</span><span style="font-weight:700;color:#1a3c6e;font-size:12px">R$ ${fmt(totalMeta)}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:11px;color:#888">Realizado</span><span style="font-weight:700;color:${colorHex(pctEq)};font-size:12px">R$ ${fmt(totalVendido)}</span></div>
        <div style="height:7px;background:#eee;border-radius:10px;overflow:hidden;margin-bottom:6px"><div style="height:7px;width:${Math.min(pctEq,100)}%;background:${colorHex(pctEq)};border-radius:10px"></div></div>
        <div style="display:flex;justify-content:space-between">
          <span style="font-size:11px;font-weight:700;color:${colorHex(pctEq)}">${pctEq.toFixed(0)}% atingido</span>
          <span style="font-size:11px;color:#e74c3c">${totalMeta>totalVendido?'− R$ '+fmt(totalMeta-totalVendido):''}</span>
        </div>
      </div>
      <div class="dash-card"><div class="dc-lbl">Fonte dos Dados</div><div class="dc-val" style="font-size:16px">${fonte==='fechamento'?'Fechamento':'Parcial'}</div><div class="dc-sub">${periodo}</div></div>
    </div>

    <div class="dash-section">
      <h3>🚨 Pontos de Atenção e Destaques</h3>
      <div class="atencao-cards">
        <div class="atencao-card ${baixa>0?'red':'green'}"><div class="ac-icon">${baixa>0?'🔴':'✅'}</div><div class="ac-title">Perf. Baixa</div><div class="ac-val">${baixa}</div><div class="ac-desc">${baixa>0?'representante(s) abaixo de 50%':'Nenhum em baixa performance'}</div></div>
        <div class="atencao-card ${media>0?'orange':'green'}"><div class="ac-icon">${media>0?'🟡':'✅'}</div><div class="ac-title">Perf. Média</div><div class="ac-val">${media}</div><div class="ac-desc">${media>0?'entre 50–89% — monitorar':'Nenhum em faixa de atenção'}</div></div>
        ${fonte==='fechamento'?`<div class="atencao-card ${semMeta.length>0?'red':'green'}"><div class="ac-icon">${semMeta.length>0?'🚫':'✅'}</div><div class="ac-title">Zero Metas</div><div class="ac-val">${semMeta.length}</div><div class="ac-desc">${semMeta.length>0?'sem nenhum indicador atingido':'Todos bateram ao menos 1'}</div></div>`:''}
        <div class="atencao-card ${abaixoMedia.length>0?'orange':'green'}"><div class="ac-icon">${abaixoMedia.length>0?'📉':'📈'}</div><div class="ac-title">Abaixo da Média</div><div class="ac-val">${abaixoMedia.length}</div><div class="ac-desc">${abaixoMedia.length>0?`abaixo de ${mediaEq.toFixed(0)}%`:`Todos acima da média`}</div></div>
        <div class="atencao-card ${piorInd.pctMedio<60?'red':piorInd.pctMedio<90?'orange':'green'}"><div class="ac-icon">🎯</div><div class="ac-title">Gargalo</div><div class="ac-val">${piorInd.pctMedio.toFixed(0)}%</div><div class="ac-desc">${piorInd.label}</div></div>
        <div class="atencao-card green"><div class="ac-icon">🏆</div><div class="ac-title">Alta Perf.</div><div class="ac-val">${alta}</div><div class="ac-desc">representante(s) ≥90%</div></div>
      </div>
      <div class="narrativa-box">
        ${narrativas.map(n=>`<div class="narr-item"><div class="narr-dot" style="background:${n.c}"></div><span>${n.t}</span></div>`).join('')}
        ${positivas.map(n=>`<div class="narr-item"><div class="narr-dot" style="background:${n.c}"></div><span>${n.t}</span></div>`).join('')}
        ${!narrativas.length&&!positivas.length?'<div class="narr-item"><div class="narr-dot" style="background:#27ae60"></div><span>Sem pontos críticos — equipe dentro da faixa esperada.</span></div>':''}
      </div>
    </div>

    <div class="dash-two-col">
      <div class="dash-section">
        <h3>📊 Distribuição Alta / Média / Baixa</h3>
        <div class="dist-bars">
          <div class="dist-row"><div class="dist-label" style="color:#27ae60">🟢 Alta</div><div class="dist-track"><div class="dist-fill" style="width:${total>0?alta/total*100:0}%;background:linear-gradient(90deg,#27ae60,#2ecc71)">${alta>0?alta:''}</div></div><div class="dist-count">${alta}/${total}</div></div>
          <div class="dist-row"><div class="dist-label" style="color:#e67e22">🟡 Média</div><div class="dist-track"><div class="dist-fill" style="width:${total>0?media/total*100:0}%;background:linear-gradient(90deg,#e67e22,#f39c12)">${media>0?media:''}</div></div><div class="dist-count">${media}/${total}</div></div>
          <div class="dist-row"><div class="dist-label" style="color:#e74c3c">🔴 Baixa</div><div class="dist-track"><div class="dist-fill" style="width:${total>0?baixa/total*100:0}%;background:linear-gradient(90deg,#c0392b,#e74c3c)">${baixa>0?baixa:''}</div></div><div class="dist-count">${baixa}/${total}</div></div>
        </div>
        ${semMeta.length>0?`<div style="margin-top:16px"><p style="font-size:11px;font-weight:700;color:#c0392b;margin-bottom:8px;text-transform:uppercase">🚫 Sem nenhuma meta batida</p><div class="zero-list">${semMeta.map(d=>`<div class="zero-item"><div class="zero-dot"></div>${d.nome}</div>`).join('')}</div></div>`:''}
      </div>
      <div class="dash-section">
        <h3>🎯 Gargalo Coletivo por Indicador</h3>
        <div class="gargalo-list">
          ${gargalos.map((g,i)=>`<div class="gargalo-item"><div class="gargalo-rank" style="background:${i===0?'#e74c3c':i===1?'#e67e22':i===2?'#f39c12':'#27ae60'}">${i+1}</div><div class="gargalo-info"><div class="gi-name">${g.label} <span style="font-size:10px;color:#aaa">peso ${g.peso}pts</span></div><div class="gi-sub">Média de atingimento da equipe</div></div><div class="gargalo-pct" style="color:${colorHex(g.pctMedio)}">${g.pctMedio.toFixed(0)}%</div></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="dash-section">
      <h3>🏆 Top Performers</h3>
      <div class="top-list">
        ${topPerf.map((d,i)=>`<div class="top-item"><div class="ti-pos">${['🥇','🥈','🥉'][i]}</div><div class="ti-info"><div class="ti-name">${d.nome}</div><div class="ti-sub">${fonte==='fechamento'?`${[f(d.nvReal)>=f(d.nvMeta),f(d.tmReal)>=f(d.tmMeta),f(d.ovReal)>=f(d.ovMeta),f(d.posReal)>=f(d.posMeta),f(d.mixReal)>=f(d.mixMeta)].filter(Boolean).length}/5 metas batidas · Obj. Vendas: R$ ${fmt(f(d.ovReal))}`:`Perf. parcial: ${f(d.perfParcial)||'—'}%`}</div></div><div class="ti-pct">${f(d.perfMensal)}%</div></div>`).join('')}
      </div>
      <h3 style="margin-bottom:12px">📋 Ranking Completo</h3>
      <table class="rank-table">
        <thead><tr><th style="width:44px">#</th><th>Representante</th><th>Performance Mensal</th><th>Obj. Vendas — Meta</th><th>Obj. Vendas — Realizado</th><th style="text-align:center">% / Faltante</th></tr></thead>
        <tbody>${ranking.map((d,i)=>{
          const pct=f(d.perfMensal);const [cls,lbl]=perfClass(pct);
          const med=i===0?'rt-1':i===1?'rt-2':i===2?'rt-3':'rt-x';
          const ovMeta=fonte==='fechamento'?f(d.ovMeta):f(d.ovMetaM);
          const ovReal=f(d.ovReal);const ovPct=ovMeta>0?ovReal/ovMeta*100:0;const ovFalta=ovMeta>ovReal?ovMeta-ovReal:0;
          return `<tr>
            <td><span class="rt-medal ${med}">${i+1}</span></td>
            <td><strong>${d.nome}</strong>${pct<mediaEq?`<span style="font-size:10px;color:#e67e22;margin-left:6px">↓ abaixo da média</span>`:''}</td>
            <td><span class="rt-bar-bg"><span class="rt-bar-f" style="width:${Math.min(pct,100)}%;background:${colorHex(pct)}"></span></span> <span style="font-weight:700;color:${colorHex(pct)}">${pct}%</span> <span style="font-size:10px;font-weight:600;margin-left:4px;padding:2px 6px;border-radius:10px;background:${pct>=90?'#eafaf1':pct>=50?'#fef9e7':'#fdf2f2'};color:${colorHex(pct)}">${lbl}</span></td>
            <td style="font-size:12px;color:#555">R$ ${fmt(ovMeta)}</td>
            <td style="font-size:12px;font-weight:700;color:${colorHex(ovPct)}">R$ ${fmt(ovReal)}</td>
            <td style="text-align:center"><span style="font-weight:800;color:${colorHex(ovPct)};font-size:12px">${ovPct.toFixed(0)}%</span>${ovFalta>0?`<br><span style="font-size:10px;color:#e74c3c">− R$ ${fmt(ovFalta)}</span>`:`<br><span style="font-size:10px;color:#27ae60">✓</span>`}</td>
          </tr>`;}).join('')}</tbody>
      </table>
    </div>`;
}

// Inicializar com 3 linhas
State.dadosParcial.push(novoParcial());State.dadosParcial.push(novoParcial());State.dadosParcial.push(novoParcial());
renderParcial();
