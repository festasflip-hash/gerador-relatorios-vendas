import { estado } from "./state.js";
import { calcularResultadosParcial } from "./helpers.js";

// Representante parcial no estado da aplicação
export function criarRepresentanteParcial(representante = {}) {
  return {
    nome: representante.nome || "",
    ranking: representante.ranking || "",
    perfParcial: representante.perfParcial || "",
    perfMensal: representante.perfMensal || "",
    nvMetaP: representante.nvMetaP || "",
    nvMetaM: representante.nvMetaM || "",
    nvReal: representante.nvReal || "",
    nvRes: representante.nvRes || "",
    tmMeta: representante.tmMeta || "",
    tmReal: representante.tmReal || "",
    tmPct: representante.tmPct || "",
    ovMetaP: representante.ovMetaP || "",
    ovMetaM: representante.ovMetaM || "",
    ovReal: representante.ovReal || "",
    ovRes: representante.ovRes || "",
    posMetaP: representante.posMetaP || "",
    posMetaM: representante.posMetaM || "",
    posReal: representante.posReal || "",
    posRes: representante.posRes || "",
    mixMetaP: representante.mixMetaP || "",
    mixMetaM: representante.mixMetaM || "",
    mixReal: representante.mixReal || "",
    mixRes: representante.mixRes || ""
  };
}

export function renderizarTabelaParcial() {
  document.getElementById("tableBodyParcial").innerHTML = estado.listaRepresentantesParcial.map((representante, indice) => `
    <tr>
      <td class="row-num">${indice + 1}</td>
      <td><input class="nome" value="${representante.nome}" oninput="estado.listaRepresentantesParcial[${indice}].nome=this.value" placeholder="Nome"></td>
      <td><input class="num" value="${representante.ranking}" oninput="estado.listaRepresentantesParcial[${indice}].ranking=this.value" placeholder="#"></td>
      <td><input class="num" value="${representante.perfParcial}" oninput="estado.listaRepresentantesParcial[${indice}].perfParcial=this.value" placeholder="0"></td>
      <td><input class="num" value="${representante.perfMensal}" oninput="estado.listaRepresentantesParcial[${indice}].perfMensal=this.value" placeholder="0"></td>
      <td><input class="num" value="${representante.nvMetaP}" oninput="estado.listaRepresentantesParcial[${indice}].nvMetaP=this.value;recalcularLinhaParcial(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.nvMetaM}" oninput="estado.listaRepresentantesParcial[${indice}].nvMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${representante.nvReal}" oninput="estado.listaRepresentantesParcial[${indice}].nvReal=this.value;recalcularLinhaParcial(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.nvRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.tmMeta}" oninput="estado.listaRepresentantesParcial[${indice}].tmMeta=this.value;recalcularLinhaParcial(${indice})" placeholder="3000"></td>
      <td><input class="num" value="${representante.tmReal}" oninput="estado.listaRepresentantesParcial[${indice}].tmReal=this.value;recalcularLinhaParcial(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.tmPct}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.ovMetaP}" oninput="estado.listaRepresentantesParcial[${indice}].ovMetaP=this.value;recalcularLinhaParcial(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.ovMetaM}" oninput="estado.listaRepresentantesParcial[${indice}].ovMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${representante.ovReal}" oninput="estado.listaRepresentantesParcial[${indice}].ovReal=this.value;recalcularLinhaParcial(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.ovRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.posMetaP}" oninput="estado.listaRepresentantesParcial[${indice}].posMetaP=this.value;recalcularLinhaParcial(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.posMetaM}" oninput="estado.listaRepresentantesParcial[${indice}].posMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${representante.posReal}" oninput="estado.listaRepresentantesParcial[${indice}].posReal=this.value;recalcularLinhaParcial(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.posRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.mixMetaP}" oninput="estado.listaRepresentantesParcial[${indice}].mixMetaP=this.value;recalcularLinhaParcial(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.mixMetaM}" oninput="estado.listaRepresentantesParcial[${indice}].mixMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${representante.mixReal}" oninput="estado.listaRepresentantesParcial[${indice}].mixReal=this.value;recalcularLinhaParcial(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.mixRes}" readonly title="Calculado automaticamente"></td>
      <td style="white-space:nowrap"><button class="edit-btn" onclick="abrirModalEdicao(${indice}, 'parcial')" title="Editar em formulário">✏️</button><button class="del-btn" onclick="estado.listaRepresentantesParcial.splice(${indice},1);renderizarTabelaParcial()" title="Remover">✕</button></td>
    </tr>`).join("");
}

export function recalcularLinhaParcial(indice) {
  const representante = estado.listaRepresentantesParcial[indice];
  calcularResultadosParcial(representante);
  const cells = document.getElementById("tableBodyParcial").rows[indice].cells;
  const calcMap = [[8, "nvRes"], [10, "tmPct"], [15, "ovRes"], [19, "posRes"], [23, "mixRes"]];
  calcMap.forEach(([ci, key]) => {
    cells[ci].querySelector("input").value = representante[key];
  });
}

window.recalcularLinhaParcial = recalcularLinhaParcial;
window.renderizarTabelaParcial = renderizarTabelaParcial;
window.criarRepresentanteParcial = criarRepresentanteParcial;
