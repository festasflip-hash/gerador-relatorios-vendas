function abrirEdit(i, m){
  editIdx=i; editModo=m;
  const d=m==='parcial'?dadosParcial[i]:dadosFechamento[i];
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
function gv(id){
  const el=document.getElementById(id);
  return el?el.value:'';
}
function previewCalcP(){
  const tmp={
    nvMetaP:gv('e_nvMetaP'),nvReal:gv('e_nvReal'),tmMeta:gv('e_tmMeta'),tmReal:gv('e_tmReal'),ovMetaP:gv('e_ovMetaP'),ovReal:gv('e_ovReal'),posMetaP:gv('e_posMetaP'),posReal:gv('e_posReal'),mixMetaP:gv('e_mixMetaP'),mixReal:gv('e_mixReal')
  };
  calcParcial(tmp);
  const map={
    e_nvRes:'nvRes',e_tmPct:'tmPct',e_ovRes:'ovRes',e_posRes:'posRes',e_mixRes:'mixRes'
  };
  Object.entries(map).forEach(([eid,key])=>{
    const el=document.getElementById(eid);
    if(el)el.value=tmp[key];
  });
}
function previewCalcF(){
  const tmp={
    nvMeta:gv('e_nvMeta'),nvReal:gv('e_nvReal'),tmMeta:gv('e_tmMeta'),tmReal:gv('e_tmReal'),ovMeta:gv('e_ovMeta'),ovReal:gv('e_ovReal'),posMeta:gv('e_posMeta'),posReal:gv('e_posReal'),mixMeta:gv('e_mixMeta'),mixReal:gv('e_mixReal')};
  calcFechamento(tmp);
  const map={
    e_nvRes:'nvRes',e_tmRes:'tmRes',e_ovRes:'ovRes',e_posRes:'posRes',e_mixRes:'mixRes'
    };
  Object.entries(map).forEach(([eid,key])=>{
    const el=document.getElementById(eid);
    if(el)el.value=tmp[key];
});

}
function salvarEdit(){
  if(editModo==='parcial'){
    const d=dadosParcial[editIdx];
    d.nome=gv('e_nome');d.ranking=gv('e_ranking');d.perfParcial=gv('e_perfParcial');d.perfMensal=gv('e_perfMensal');
    d.nvMetaP=gv('e_nvMetaP');d.nvMetaM=gv('e_nvMetaM');d.nvReal=gv('e_nvReal');
    d.tmMeta=gv('e_tmMeta');d.tmReal=gv('e_tmReal');
    d.ovMetaP=gv('e_ovMetaP');d.ovMetaM=gv('e_ovMetaM');d.ovReal=gv('e_ovReal');
    d.posMetaP=gv('e_posMetaP');d.posMetaM=gv('e_posMetaM');d.posReal=gv('e_posReal');
    d.mixMetaP=gv('e_mixMetaP');d.mixMetaM=gv('e_mixMetaM');d.mixReal=gv('e_mixReal');
    calcParcial(d);renderizarTabelaParcial();
  } else {
    const d=dadosFechamento[editIdx];
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
function fecharEditModal(){
    document.getElementById('editOverlay').classList.remove('active');
}
function closeEditModal(e){
    if(e.target===document.getElementById('editOverlay'))
        fecharEditModal();
    }