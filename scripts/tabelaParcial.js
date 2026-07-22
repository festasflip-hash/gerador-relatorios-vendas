// d => representante
//i => indice

export function criarTabelaRepresentanteParcial(representante={}){
  return {
    nome:representante.nome||'',ranking:representante.ranking||'',perfParcial:representante.perfParcial||'',perfMensal:representante.perfMensal||'',
    nvMetaP:representante.nvMetaP||'',nvMetaM:representante.nvMetaM||'',nvReal:representante.nvReal||'',nvRes:representante.nvRes||'',
    tmMeta:representante.tmMeta||'',tmReal:representante.tmReal||'',tmPct:representante.tmPct||'',
    ovMetaP:representante.ovMetaP||'',ovMetaM:representante.ovMetaM||'',ovReal:representante.ovReal||'',ovRes:representante.ovRes||'',
    posMetaP:representante.posMetaP||'',posMetaM:representante.posMetaM||'',posReal:representante.posReal||'',posRes:representante.posRes||'',
    mixMetaP:representante.mixMetaP||'',mixMetaM:representante.mixMetaM||'',mixReal:representante.mixReal||'',mixRes:representante.mixRes||''};
}

export function renderizarTabelaParcial(){
  document.getElementById('tableBodyParcial').innerHTML=dadosParcial.map((representante,indice)=>`
    <tr>
      <td class="row-num">${indice+1}</td>
      <td>
        <input class="nome" value="${representante.nome}" oninput="dadosParcial[${indice}].nome=this.value" placeholder="Nome">
      </td>
      <td>
        <input class="num" value="${representante.ranking}" oninput="dadosParcial[${indice}].ranking=this.value" placeholder="#">
      </td>
      <td>
        <input class="num" value="${representante.perfParcial}" oninput="dadosParcial[${indice}].perfParcial=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${representante.perfMensal}" oninput="dadosParcial[${indice}].perfMensal=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${representante.nvMetaP}" oninput="dadosParcial[${indice}].nvMetaP=this.value;autoCalcP(${indice})" placeholder="0">
      </td>
      <td>
        <input class="num" value="${representante.nvMetaM}" oninput="dadosParcial[${indice}].nvMetaM=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${representante.nvReal}" oninput="dadosParcial[${indice}].nvReal=this.value;autoCalcP(${indice})" placeholder="0">
      </td>
      <td>
        <input class="num calc" value="${representante.nvRes}" readonly title="Calculado automaticamente">
      </td>
      <td>
        <input class="num" value="${representante.tmMeta}" oninput="dadosParcial[${indice}].tmMeta=this.value;autoCalcP(${indice})" placeholder="3000">
      </td>
      <td>
        <input class="num" value="${representante.tmReal}" oninput="dadosParcial[${indice}].tmReal=this.value;autoCalcP(${indice})" placeholder="0">
      </td>
      <td>
        <input class="num calc" value="${representante.tmPct}" readonly title="Calculado automaticamente">
      </td>
      <td>
        <input class="num" value="${representante.ovMetaP}" oninput="dadosParcial[${indice}].ovMetaP=this.value;autoCalcP(${indice})" placeholder="0">
      </td>
      <td>
        <input class="num" value="${representante.ovMetaM}" oninput="dadosParcial[${indice}].ovMetaM=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${representante.ovReal}" oninput="dadosParcial[${indice}].ovReal=this.value;autoCalcP(${indice})" placeholder="0">
      </td>
      <td>
        <input class="num calc" value="${representante.ovRes}" readonly title="Calculado automaticamente">
      </td>
      <td>
        <input class="num" value="${representante.posMetaP}" oninput="dadosParcial[${indice}].posMetaP=this.value;autoCalcP(${indice})" placeholder="0">
      </td>
      <td>
        <input class="num" value="${representante.posMetaM}" oninput="dadosParcial[${indice}].posMetaM=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${representante.posReal}" oninput="dadosParcial[${indice}].posReal=this.value;autoCalcP(${indice})" placeholder="0">
      </td>
      <td>
        <input class="num calc" value="${representante.posRes}" readonly title="Calculado automaticamente">
      </td>
      <td>
        <input class="num" value="${representante.mixMetaP}" oninput="dadosParcial[${indice}].mixMetaP=this.value;autoCalcP(${indice})" placeholder="0">
      </td>
      <td>
        <input class="num" value="${representante.mixMetaM}" oninput="dadosParcial[${indice}].mixMetaM=this.value" placeholder="0">
      </td>
      <td>
        <input class="num" value="${representante.mixReal}" oninput="dadosParcial[${indice}].mixReal=this.value;autoCalcP(${indice})" placeholder="0">
      </td>
      <td>
        <input class="num calc" value="${representante.mixRes}" readonly title="Calculado automaticamente">
      </td>
      <td style="white-space:nowrap">
        <button class="edit-btn" onclick="abrirEdit(${indice},'parcial')" title="Editar em formulário">✏️</button>
        <button class="del-btn" onclick="dadosParcial.splice(${indice},1);renderizarTabelaParcial()" title="Remover">✕</button>
      </td>
    </tr>`).join('');
}
export function autoCalcP(indice){
  calcParcial(dadosParcial[indice]);
  const cells=document.getElementById('tableBodyParcial').rows[indice].cells;

  // atualiza campos calc: índices 8(nvRes),10(tmPct),15(ovRes),19(posRes),23(mixRes)
  const calcMap=[[8,'nvRes'],[10,'tmPct'],[15,'ovRes'],[19,'posRes'],[23,'mixRes']];
  
  calcMap.forEach(([ci,key])=>{cells[ci].querySelector('input').value=dadosParcial[indice][key];});
}