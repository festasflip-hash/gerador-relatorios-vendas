import { estado } from "./state.js";
import { calcularResultadosParcial, calcularResultadosFechamento } from "./helpers.js";
import { renderizarTabelaParcial } from "./tabelaParcial.js";
import { renderizarTabelaFechamento } from "./tabelaFechamento.js";

export function abrirModalEdicao(indice, modo) {
estado.indiceEdicaoAtivo = indice;
estado.modoEdicaoAtivo = modo;
const representante = modo === "parcial" ? estado.listaRepresentantesParcial[indice] : estado.listaRepresentantesFechamento[indice];
document.getElementById("editTitle").textContent = `✏️ Editar: ${representante.nome || "Representante " + (indice + 1)}`;

let html = "";
if (modo === "parcial") {
  html = `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
    <div class="edit-field"><label>Nome</label><input id="e_nome" value="${representante.nome}" placeholder="Nome completo"></div>
    <div class="edit-field"><label>Ranking</label><input id="e_ranking" type="number" value="${representante.ranking}"></div>
    <div class="edit-field"><label>Perf. Parcial %</label><input id="e_perfParcial" type="number" value="${representante.perfParcial}"></div>
    <div class="edit-field"><label>Perf. Mensal %</label><input id="e_perfMensal" type="number" value="${representante.perfMensal}"></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div class="edit-section"><h4>Novas Vendas (peso 5)</h4>
      <div class="edit-field"><label>Meta Parcial</label><input id="e_nvMetaP" type="number" value="${representante.nvMetaP}" oninput="atualizarCalculosModalParcial()"></div>
      <div class="edit-field"><label>Meta Mensal</label><input id="e_nvMetaM" type="number" value="${representante.nvMetaM}"></div>
      <div class="edit-field"><label>Realizado</label><input id="e_nvReal" type="number" value="${representante.nvReal}" oninput="atualizarCalculosModalParcial()"></div>
      <div class="edit-field"><label>Resultado 🟢</label><input id="e_nvRes" class="calc-field" readonly value="${representante.nvRes}"></div>
    </div>
    <div class="edit-section"><h4>Ticket Médio (peso 10)</h4>
      <div class="edit-field"><label>Meta R$</label><input id="e_tmMeta" type="number" value="${representante.tmMeta}" oninput="atualizarCalculosModalParcial()"></div>
      <div class="edit-field"><label>Realizado R$</label><input id="e_tmReal" type="number" value="${representante.tmReal}" oninput="atualizarCalculosModalParcial()"></div>
      <div class="edit-field"><label>% Atingido 🟢</label><input id="e_tmPct" class="calc-field" readonly value="${representante.tmPct}"></div>
      </div>
    <div class="edit-section"><h4>Objetivo de Vendas (peso 60)</h4>
      <div class="edit-field"><label>Meta Parcial R$</label><input id="e_ovMetaP" type="number" value="${representante.ovMetaP}" oninput="atualizarCalculosModalParcial()"></div>
      <div class="edit-field"><label>Meta Mensal R$</label><input id="e_ovMetaM" type="number" value="${representante.ovMetaM}"></div>
      <div class="edit-field"><label>Realizado R$</label><input id="e_ovReal" type="number" value="${representante.ovReal}" oninput="atualizarCalculosModalParcial()"></div>
      <div class="edit-field"><label>Resultado 🟢</label><input id="e_ovRes" class="calc-field" readonly value="${representante.ovRes}"></div>
      </div>
    <div class="edit-section"><h4>Positivação (peso 15)</h4>
      <div class="edit-field"><label>Meta Parcial</label><input id="e_posMetaP" type="number" value="${representante.posMetaP}" oninput="atualizarCalculosModalParcial()"></div>
      <div class="edit-field"><label>Meta Mensal</label><input id="e_posMetaM" type="number" value="${representante.posMetaM}"></div>
      <div class="edit-field"><label>Realizado</label><input id="e_posReal" type="number" value="${representante.posReal}" oninput="atualizarCalculosModalParcial()"></div>
      <div class="edit-field"><label>Resultado 🟢</label><input id="e_posRes" class="calc-field" readonly value="${representante.posRes}"></div>
    </div>
    <div class="edit-section" style="grid-column:1/-1"><h4>Mix de Vendas (peso 10)</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px">
        <div class="edit-field"><label>Meta Parcial</label><input id="e_mixMetaP" type="number" value="${representante.mixMetaP}" oninput="atualizarCalculosModalParcial()"></div>
        <div class="edit-field"><label>Meta Mensal</label><input id="e_mixMetaM" type="number" value="${representante.mixMetaM}"></div>
        <div class="edit-field"><label>Realizado</label><input id="e_mixReal" type="number" value="${representante.mixReal}" oninput="atualizarCalculosModalParcial()"></div>
        <div class="edit-field"><label>Resultado 🟢</label><input id="e_mixRes" class="calc-field" readonly value="${representante.mixRes}"></div>
      </div>
    </div>
  </div>`;
} else {
  html = `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
    <div class="edit-field"><label>Nome</label><input id="e_nome" value="${representante.nome}" placeholder="Nome completo"></div>
    <div class="edit-field"><label>Ranking</label><input id="e_ranking" type="number" value="${representante.ranking}"></div>
    <div class="edit-field" style="grid-column:1/-1"><label>Perf. Mensal %</label><input id="e_perfMensal" type="number" value="${representante.perfMensal}"></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div class="edit-section"><h4>Novas Vendas (peso 5)</h4>
      <div class="edit-field"><label>Meta</label><input id="e_nvMeta" type="number" value="${representante.nvMeta}" oninput="atualizarCalculosModalFechamento()"></div>
      <div class="edit-field"><label>Realizado</label><input id="e_nvReal" type="number" value="${representante.nvReal}" oninput="atualizarCalculosModalFechamento()"></div>
      <div class="edit-field"><label>Resultado 🟢</label><input id="e_nvRes" class="calc-field" readonly value="${representante.nvRes}"></div>
    </div>
    <div class="edit-section"><h4>Ticket Médio (peso 10)</h4>
      <div class="edit-field"><label>Meta R$</label><input id="e_tmMeta" type="number" value="${representante.tmMeta}" oninput="atualizarCalculosModalFechamento()"></div>
      <div class="edit-field"><label>Realizado R$</label><input id="e_tmReal" type="number" value="${representante.tmReal}" oninput="atualizarCalculosModalFechamento()"></div>
      <div class="edit-field"><label>Resultado 🟢</label><input id="e_tmRes" class="calc-field" readonly value="${representante.tmRes}"></div>
    </div>
    <div class="edit-section"><h4>Objetivo de Vendas (peso 60)</h4>
      <div class="edit-field"><label>Meta R$</label><input id="e_ovMeta" type="number" value="${representante.ovMeta}" oninput="atualizarCalculosModalFechamento()"></div>
      <div class="edit-field"><label>Realizado R$</label><input id="e_ovReal" type="number" value="${representante.ovReal}" oninput="atualizarCalculosModalFechamento()"></div>
      <div class="edit-field"><label>Resultado 🟢</label><input id="e_ovRes" class="calc-field" readonly value="${representante.ovRes}"></div>
    </div>
    <div class="edit-section"><h4>Positivação (peso 15)</h4>
      <div class="edit-field"><label>Meta</label><input id="e_posMeta" type="number" value="${representante.posMeta}" oninput="atualizarCalculosModalFechamento()"></div>
      <div class="edit-field"><label>Realizado</label><input id="e_posReal" type="number" value="${representante.posReal}" oninput="atualizarCalculosModalFechamento()"></div>
      <div class="edit-field"><label>Resultado 🟢</label><input id="e_posRes" class="calc-field" readonly value="${representante.posRes}"></div>
    </div>
    <div class="edit-section" style="grid-column:1/-1"><h4>Mix de Vendas (peso 10)</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div class="edit-field"><label>Meta</label><input id="e_mixMeta" type="number" value="${representante.mixMeta}" oninput="atualizarCalculosModalFechamento()"></div>
        <div class="edit-field"><label>Realizado</label><input id="e_mixReal" type="number" value="${representante.mixReal}" oninput="atualizarCalculosModalFechamento()"></div>
        <div class="edit-field"><label>Resultado 🟢</label><input id="e_mixRes" class="calc-field" readonly value="${representante.mixRes}"></div>
      </div>
    </div>
  </div>`;
}

html += `<div class="edit-actions">
  <button class="btn-cancel" onclick="fecharModalEdicao()">Cancelar</button>
  <button class="btn-save-tpl" onclick="salvarMetasComoTemplate()" title="Salvar metas deste representante como template">💾 Salvar Metas como Template</button>
  <button class="btn-save" onclick="salvarEdicaoRepresentante()">✅ Confirmar</button>
</div>`;

document.getElementById("editBody").innerHTML = html;
document.getElementById("editOverlay").classList.add("active");
}

export function obterValorCampo(idElemento) {
const elemento = document.getElementById(idElemento);
return elemento ? elemento.value : "";
}

export function atualizarCalculosModalParcial() {
const representacao = {
  nvMetaP: obterValorCampo("e_nvMetaP"),
  nvReal: obterValorCampo("e_nvReal"),
  tmMeta: obterValorCampo("e_tmMeta"),
  tmReal: obterValorCampo("e_tmReal"),
  ovMetaP: obterValorCampo("e_ovMetaP"),
  ovReal: obterValorCampo("e_ovReal"),
  posMetaP: obterValorCampo("e_posMetaP"),
  posReal: obterValorCampo("e_posReal"),
  mixMetaP: obterValorCampo("e_mixMetaP"),
  mixReal: obterValorCampo("e_mixReal")
};

calcularResultadosParcial(representacao);

const campos = {
  e_nvRes: "nvRes",
  e_tmPct: "tmPct",
  e_ovRes: "ovRes",
  e_posRes: "posRes",
  e_mixRes: "mixRes"
};

Object.entries(campos).forEach(([idElemento, chave]) => {
  const elemento = document.getElementById(idElemento);
  if (elemento) elemento.value = representacao[chave];
});
}

export function atualizarCalculosModalFechamento() {
const representacao = {
  nvMeta: obterValorCampo("e_nvMeta"),
  nvReal: obterValorCampo("e_nvReal"),
  tmMeta: obterValorCampo("e_tmMeta"),
  tmReal: obterValorCampo("e_tmReal"),
  ovMeta: obterValorCampo("e_ovMeta"),
  ovReal: obterValorCampo("e_ovReal"),
  posMeta: obterValorCampo("e_posMeta"),
  posReal: obterValorCampo("e_posReal"),
  mixMeta: obterValorCampo("e_mixMeta"),
  mixReal: obterValorCampo("e_mixReal")
};

calcularResultadosFechamento(representacao);

const campos = {
  e_nvRes: "nvRes",
  e_tmRes: "tmRes",
  e_ovRes: "ovRes",
  e_posRes: "posRes",
  e_mixRes: "mixRes"
};

Object.entries(campos).forEach(([idElemento, chave]) => {
  const elemento = document.getElementById(idElemento);
  if (elemento) elemento.value = representacao[chave];
});
}

export function salvarEdicaoRepresentante() {
const representante = estado.modoEdicaoAtivo === "parcial"
  ? estado.listaRepresentantesParcial[estado.indiceEdicaoAtivo]
  : estado.listaRepresentantesFechamento[estado.indiceEdicaoAtivo];

representante.nome = obterValorCampo("e_nome");
representante.ranking = obterValorCampo("e_ranking");

if (estado.modoEdicaoAtivo === "parcial") {
  representante.perfParcial = obterValorCampo("e_perfParcial");
  representante.perfMensal = obterValorCampo("e_perfMensal");
  representante.nvMetaP = obterValorCampo("e_nvMetaP");
  representante.nvMetaM = obterValorCampo("e_nvMetaM");
  representante.nvReal = obterValorCampo("e_nvReal");
  representante.tmMeta = obterValorCampo("e_tmMeta");
  representante.tmReal = obterValorCampo("e_tmReal");
  representante.ovMetaP = obterValorCampo("e_ovMetaP");
  representante.ovMetaM = obterValorCampo("e_ovMetaM");
  representante.ovReal = obterValorCampo("e_ovReal");
  representante.posMetaP = obterValorCampo("e_posMetaP");
  representante.posMetaM = obterValorCampo("e_posMetaM");
  representante.posReal = obterValorCampo("e_posReal");
  representante.mixMetaP = obterValorCampo("e_mixMetaP");
  representante.mixMetaM = obterValorCampo("e_mixMetaM");
  representante.mixReal = obterValorCampo("e_mixReal");
  calcularResultadosParcial(representante);
  renderizarTabelaParcial();
} else {
  representante.perfMensal = obterValorCampo("e_perfMensal");
  representante.nvMeta = obterValorCampo("e_nvMeta");
  representante.nvReal = obterValorCampo("e_nvReal");
  representante.tmMeta = obterValorCampo("e_tmMeta");
  representante.tmReal = obterValorCampo("e_tmReal");
  representante.ovMeta = obterValorCampo("e_ovMeta");
  representante.ovReal = obterValorCampo("e_ovReal");
  representante.posMeta = obterValorCampo("e_posMeta");
  representante.posReal = obterValorCampo("e_posReal");
  representante.mixMeta = obterValorCampo("e_mixMeta");
  representante.mixReal = obterValorCampo("e_mixReal");
  calcularResultadosFechamento(representante);
  renderizarTabelaFechamento();
}

fecharModalEdicao();
}

export function fecharModalEdicao() {
document.getElementById("editOverlay").classList.remove("active");
}

export function fecharModalEdicaoAoClicarFora(evento) {
if (evento.target === document.getElementById("editOverlay")) {
  fecharModalEdicao();
}
}

window.abrirModalEdicao = abrirModalEdicao;
window.fecharModalEdicao = fecharModalEdicao;
window.fecharModalEdicaoAoClicarFora = fecharModalEdicaoAoClicarFora;
window.atualizarCalculosModalParcial = atualizarCalculosModalParcial;
window.atualizarCalculosModalFechamento = atualizarCalculosModalFechamento;
window.salvarEdicaoRepresentante = salvarEdicaoRepresentante;
window.obterValorCampo = obterValorCampo;
