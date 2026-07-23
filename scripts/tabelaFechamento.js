import { estado } from "./state.js";
import { calcularResultadosFechamento } from "./helpers.js";

export function criarRepresentanteFechamento(representante = {}) {
  return {
    nome: representante.nome || "",
    ranking: representante.ranking || "",
    perfMensal: representante.perfMensal || "",
    nvMeta: representante.nvMeta || "",
    nvReal: representante.nvReal || "",
    nvRes: representante.nvRes || "",
    tmMeta: representante.tmMeta || "",
    tmReal: representante.tmReal || "",
    tmRes: representante.tmRes || "",
    ovMeta: representante.ovMeta || "",
    ovReal: representante.ovReal || "",
    ovRes: representante.ovRes || "",
    posMeta: representante.posMeta || "",
    posReal: representante.posReal || "",
    posRes: representante.posRes || "",
    mixMeta: representante.mixMeta || "",
    mixReal: representante.mixReal || "",
    mixRes: representante.mixRes || ""
  };
}

export function renderizarTabelaFechamento() {
  document.getElementById("tableBodyFechamento").innerHTML = estado.listaRepresentantesFechamento.map((representante, indice) => `
    <tr>
      <td class="row-num">${indice + 1}</td>
      <td><input class="nome" value="${representante.nome}" oninput="estado.listaRepresentantesFechamento[${indice}].nome=this.value" placeholder="Nome"></td>
      <td><input class="num" value="${representante.ranking}" oninput="estado.listaRepresentantesFechamento[${indice}].ranking=this.value" placeholder="#"></td>
      <td><input class="num" value="${representante.perfMensal}" oninput="estado.listaRepresentantesFechamento[${indice}].perfMensal=this.value" placeholder="0"></td>
      <td><input class="num" value="${representante.nvMeta}" oninput="estado.listaRepresentantesFechamento[${indice}].nvMeta=this.value;recalcularLinhaFechamento(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.nvReal}" oninput="estado.listaRepresentantesFechamento[${indice}].nvReal=this.value;recalcularLinhaFechamento(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.nvRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.tmMeta}" oninput="estado.listaRepresentantesFechamento[${indice}].tmMeta=this.value;recalcularLinhaFechamento(${indice})" placeholder="3000"></td>
      <td><input class="num" value="${representante.tmReal}" oninput="estado.listaRepresentantesFechamento[${indice}].tmReal=this.value;recalcularLinhaFechamento(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.tmRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.ovMeta}" oninput="estado.listaRepresentantesFechamento[${indice}].ovMeta=this.value;recalcularLinhaFechamento(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.ovReal}" oninput="estado.listaRepresentantesFechamento[${indice}].ovReal=this.value;recalcularLinhaFechamento(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.ovRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.posMeta}" oninput="estado.listaRepresentantesFechamento[${indice}].posMeta=this.value;recalcularLinhaFechamento(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.posReal}" oninput="estado.listaRepresentantesFechamento[${indice}].posReal=this.value;recalcularLinhaFechamento(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.posRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${representante.mixMeta}" oninput="estado.listaRepresentantesFechamento[${indice}].mixMeta=this.value;recalcularLinhaFechamento(${indice})" placeholder="0"></td>
      <td><input class="num" value="${representante.mixReal}" oninput="estado.listaRepresentantesFechamento[${indice}].mixReal=this.value;recalcularLinhaFechamento(${indice})" placeholder="0"></td>
      <td><input class="num calc" value="${representante.mixRes}" readonly title="Calculado automaticamente"></td>
      <td style="white-space:nowrap"><button class="edit-btn" onclick="abrirModalEdicao(${indice}, 'fechamento')" title="Editar em formulário">✏️</button><button class="del-btn" onclick="estado.listaRepresentantesFechamento.splice(${indice},1);renderizarTabelaFechamento()" title="Remover">✕</button></td>
    </tr>`).join("");
}

export function recalcularLinhaFechamento(indice) {
  const representante = estado.listaRepresentantesFechamento[indice];
  calcularResultadosFechamento(representante);
  const cells = document.getElementById("tableBodyFechamento").rows[indice].cells;
  const calcMap = [[6, "nvRes"], [9, "tmRes"], [12, "ovRes"], [15, "posRes"], [18, "mixRes"]];
  calcMap.forEach(([ci, key]) => {
    cells[ci].querySelector("input").value = representante[key];
  });
}

window.recalcularLinhaFechamento = recalcularLinhaFechamento;
window.renderizarTabelaFechamento = renderizarTabelaFechamento;
window.criarRepresentanteFechamento = criarRepresentanteFechamento;
