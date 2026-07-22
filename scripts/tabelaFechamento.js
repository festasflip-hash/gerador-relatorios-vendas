//d => representante
//i => indice

/* ============ FECHAMENTO — TABELA ============ */
function criarTabelaRepresentanteFechamento(representante={}){
  return {
    nome:representante.nome||'',ranking:representante.ranking||'',perfMensal:representante.perfMensal||'',
    nvMeta:representante.nvMeta||'',nvReal:representante.nvReal||'',nvRes:representante.nvRes||'',
    tmMeta:representante.tmMeta||'',tmReal:representante.tmReal||'',tmRes:representante.tmRes||'',
    ovMeta:representante.ovMeta||'',ovReal:representante.ovReal||'',ovRes:representante.ovRes||'',
    posMeta:representante.posMeta||'',posReal:representante.posReal||'',posRes:representante.posRes||'',
    mixMeta:representante.mixMeta||'',mixReal:representante.mixReal||'',mixRes:representante.mixRes||''};
}
function renderizarTabelaFechamento(){
  document.getElementById('tableBodyFechamento').innerHTML=dadosFechamento.map((representante,indice)=>`
    <tr>
      <td class="row-num">${i+1}</td>
      <td><input class="nome" value="${representante.nome}" oninput="dadosFechamento[${indice}].nome=this.value" placeholder="Nome"></td>
      <td><input class="num" value="${representante.ranking}" oninput="dadosFechamento[${indice}].ranking=this.value" placeholder="#"></td>
      <td><input class="num" value="${representante.perfMensal}" oninput="dadosFechamento[${indice}].perfMensal=this.value" placeholder="0"></td>
      <td><input class="num" value="${representante.nvMeta}" oninput="dadosFechamento[${indice}].nvMeta=this.value;autoCalcF(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.nvReal}" oninput="dadosFechamento[${indice}].nvReal=this.value;autoCalcF(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.nvRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.tmMeta}" oninput="dadosFechamento[${indice}].tmMeta=this.value;autoCalcF(${indice})" placeholder="3000"></td>
      <td><input class="num" value="${representante.tmReal}" oninput="dadosFechamento[${indice}].tmReal=this.value;autoCalcF(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.tmRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.ovMeta}" oninput="dadosFechamento[${indice}].ovMeta=this.value;autoCalcF(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.ovReal}" oninput="dadosFechamento[${indice}].ovReal=this.value;autoCalcF(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.ovRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.posMeta}" oninput="dadosFechamento[${indice}].posMeta=this.value;autoCalcF(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.posReal}" oninput="dadosFechamento[${indice}].posReal=this.value;autoCalcF(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.posRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.mixMeta}" oninput="dadosFechamento[${indice}].mixMeta=this.value;autoCalcF(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.mixReal}" oninput="dadosFechamento[${indice}].mixReal=this.value;autoCalcF(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.mixRes}" readonly title="Calculado automaticamente"></td>
      <td style="white-space:nowrap">
        <button class="edit-btn" onclick="abrirEdit(${indice},'fechamento')" title="Editar em formulário">✏️</button>
        <button class="del-btn" onclick="dadosFechamento.splice(${indice},1);renderFechamento()" title="Remover">✕</button>
      </td>
    </tr>`).join('');
}
function autoCalcF(indice){
  calcFechamento(dadosFechamento[indice]);
  const cells=document.getElementById('tableBodyFechamento').rows[indice].cells;
  const calcMap=[[6,'nvRes'],[9,'tmRes'],[12,'ovRes'],[15,'posRes'],[18,'mixRes']];
  calcMap.forEach(([ci,key])=>{cells[ci].querySelector('input').value=dadosFechamento[indice][key];});
}
