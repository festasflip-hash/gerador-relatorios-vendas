const TPL_KEY='relatorios_templates_v1';
function getTemplates(){try{return JSON.parse(localStorage.getItem(TPL_KEY)||'[]');}catch{return[];}}
function saveTemplates(t){localStorage.setItem(TPL_KEY,JSON.stringify(t));}

function salvarComoTemplate(){
  const nome=gv('e_nome')||'Sem nome';
  const tpls=getTemplates();
  // metas fixas — sem realizados nem rankings
  const tpl={id:Date.now(),nome,modo:editModo,metas:{}};
  if(editModo==='parcial'){
    tpl.metas={nvMetaP:gv('e_nvMetaP'),nvMetaM:gv('e_nvMetaM'),tmMeta:gv('e_tmMeta'),ovMetaP:gv('e_ovMetaP'),ovMetaM:gv('e_ovMetaM'),posMetaP:gv('e_posMetaP'),posMetaM:gv('e_posMetaM'),mixMetaP:gv('e_mixMetaP'),mixMetaM:gv('e_mixMetaM')};
  } else {
    tpl.metas={nvMeta:gv('e_nvMeta'),tmMeta:gv('e_tmMeta'),ovMeta:gv('e_ovMeta'),posMeta:gv('e_posMeta'),mixMeta:gv('e_mixMeta')};
  }
  const existe=tpls.findIndex(t=>t.nome===nome&&t.modo===editModo);
  if(existe>=0){
    if(!confirm(`Template "${nome}" já existe. Sobrescrever?`))
      return;
    tpls[existe]=tpl;
  }
  else 
    tpls.push(tpl);
  saveTemplates(tpls);
  alert(`✅ Template "${nome}" salvo com sucesso!`);
}

function abrirTemplateManager(){
  renderTplBody();
  document.getElementById('tplOverlay').classList.add('active');
}
function renderTplBody(){
  const tpls=getTemplates().filter(t=>t.modo===modo||modo==='dashboard');
  const body=document.getElementById('tplBody');
  if(!tpls.length){
    body.innerHTML=`<p style="color:#aaa;font-size:12px;text-align:center;padding:20px">Nenhum template salvo para o modo ${modo}.<br>Edite um representante e clique em "Salvar Metas como Template".</p>
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
  if(t.modo==='parcial'){dadosParcial.push(novoParcial({nome:t.nome,...t.metas}));renderParcial();}
  else{dadosFechamento.push(novoFechamento({nome:t.nome,...t.metas}));renderFechamento();}
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
