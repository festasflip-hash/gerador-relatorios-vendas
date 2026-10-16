/* ============ TABS ============ */
function switchTab(m) {
  modo = m;
  atualizarStatusHistorico();
  ["parcial", "fechamento", "dashboard"].forEach((t) => {
    document
      .getElementById("tab" + t.charAt(0).toUpperCase() + t.slice(1))
      .classList.toggle("active", modo === t);
  });
  document
    .getElementById("tableWrapParcial")
    .classList.toggle("hidden", modo !== "parcial");
  document
    .getElementById("tableWrapFechamento")
    .classList.toggle("hidden", modo !== "fechamento");
  document
    .getElementById("dashWrap")
    .classList.toggle("hidden", modo !== "dashboard");
  document
    .getElementById("controlsBar")
    .classList.toggle("hidden", modo === "dashboard");
  document
    .getElementById("legendBar")
    .classList.toggle("hidden", modo === "dashboard");
  document.getElementById("resultsSection").style.display = "none";
  const subs = {
    parcial: "Modo: Acompanhamento Parcial",
    fechamento: "Modo: Fechamento do Mês",
    dashboard: "Modo: Dashboard Consolidado",
  };
  document.getElementById("topbarSub").textContent = subs[modo];
  if (modo !== "dashboard") {
    document.getElementById("ctrlTitle").textContent =
      modo === "parcial"
        ? "Representantes — Parcial"
        : "Representantes — Fechamento";
    document.getElementById("lblPeriodo").textContent =
      modo === "parcial" ? "Período Parcial" : "Período do Fechamento";
    document.getElementById("legendaExtra").textContent =
      modo === "fechamento" ? "Status: Meta Batida / Não Batida" : "";
  } else {
    renderDashboard();
  }
}

/* ============ PARCIAL — TABELA ============ */
function novoParcial(d = {}) {
  return {
    nome: d.nome || "",
    ranking: d.ranking || "",
    perfParcial: d.perfParcial || "",
    perfMensal: d.perfMensal || "",
    nvMetaP: d.nvMetaP || "",
    nvMetaM: d.nvMetaM || "",
    nvReal: d.nvReal || "",
    nvRes: d.nvRes || "",
    tmMeta: d.tmMeta || "",
    tmReal: d.tmReal || "",
    tmPct: d.tmPct || "",
    ovMetaP: d.ovMetaP || "",
    ovMetaM: d.ovMetaM || "",
    ovReal: d.ovReal || "",
    ovRes: d.ovRes || "",
    posMetaP: d.posMetaP || "",
    posMetaM: d.posMetaM || "",
    posReal: d.posReal || "",
    posRes: d.posRes || "",
    mixMetaP: d.mixMetaP || "",
    mixMetaM: d.mixMetaM || "",
    mixReal: d.mixReal || "",
    mixRes: d.mixRes || "",
  };
}
function renderParcial() {
  document.getElementById("tableBodyParcial").innerHTML = dadosParcial
    .map(
      (d, i) => `
    <tr>
      <td class="row-num">${i + 1}</td>
      <td><input class="nome" value="${d.nome}" oninput="dadosParcial[${i}].nome=this.value" placeholder="Nome"></td>
      <td><input class="num" value="${d.ranking}" oninput="dadosParcial[${i}].ranking=this.value" placeholder="#"></td>
      <td><input class="num" value="${d.perfParcial}" oninput="dadosParcial[${i}].perfParcial=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.perfMensal}" oninput="dadosParcial[${i}].perfMensal=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.nvMetaP}" oninput="dadosParcial[${i}].nvMetaP=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.nvMetaM}" oninput="dadosParcial[${i}].nvMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.nvReal}" oninput="dadosParcial[${i}].nvReal=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.nvRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.tmMeta}" oninput="dadosParcial[${i}].tmMeta=this.value;autoCalcP(${i})" placeholder="3000"></td>
      <td><input class="num" value="${d.tmReal}" oninput="dadosParcial[${i}].tmReal=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.tmPct}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.ovMetaP}" oninput="dadosParcial[${i}].ovMetaP=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.ovMetaM}" oninput="dadosParcial[${i}].ovMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.ovReal}" oninput="dadosParcial[${i}].ovReal=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.ovRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.posMetaP}" oninput="dadosParcial[${i}].posMetaP=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.posMetaM}" oninput="dadosParcial[${i}].posMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.posReal}" oninput="dadosParcial[${i}].posReal=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.posRes}" readonly title="Calculado automaticamente"></td>
      <td><input class="num" value="${d.mixMetaP}" oninput="dadosParcial[${i}].mixMetaP=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num" value="${d.mixMetaM}" oninput="dadosParcial[${i}].mixMetaM=this.value" placeholder="0"></td>
      <td><input class="num" value="${d.mixReal}" oninput="dadosParcial[${i}].mixReal=this.value;autoCalcP(${i})" placeholder="0"></td>
      <td><input class="num calc" value="${d.mixRes}" readonly title="Calculado automaticamente"></td>
      <td style="white-space:nowrap">
        <button class="edit-btn" onclick="abrirEdit(${i},'parcial')" title="Editar em formulário">✏️</button>
        <button class="del-btn" onclick="dadosParcial.splice(${i},1);renderParcial()" title="Remover">✕</button>
      </td>
    </tr>`,
    )
    .join("");
}
function autoCalcP(i) {
  calcParcial(dadosParcial[i]);
  const cells = document.getElementById("tableBodyParcial").rows[i].cells;
  // atualiza campos calc: índices 8(nvRes),10(tmPct),15(ovRes),19(posRes),23(mixRes)
  const calcMap = [
    [8, "nvRes"],
    [10, "tmPct"],
    [15, "ovRes"],
    [19, "posRes"],
    [23, "mixRes"],
  ];
  calcMap.forEach(([ci, key]) => {
    cells[ci].querySelector("input").value = dadosParcial[i][key];
  });
}

/* ============ FECHAMENTO — TABELA ============ */
function novoFechamento(d = {}) {
  return {
    nome: d.nome || "",
    ranking: d.ranking || "",
    perfMensal: d.perfMensal || "",
    nvMeta: d.nvMeta || "",
    nvReal: d.nvReal || "",
    nvRes: d.nvRes || "",
    tmMeta: d.tmMeta || "",
    tmReal: d.tmReal || "",
    tmRes: d.tmRes || "",
    ovMeta: d.ovMeta || "",
    ovReal: d.ovReal || "",
    ovRes: d.ovRes || "",
    posMeta: d.posMeta || "",
    posReal: d.posReal || "",
    posRes: d.posRes || "",
    mixMeta: d.mixMeta || "",
    mixReal: d.mixReal || "",
    mixRes: d.mixRes || "",
  };
}
function renderFechamento() {
  document.getElementById("tableBodyFechamento").innerHTML = dadosFechamento
    .map(
      (d, i) => `
    <tr>
      <td class="row-num">${i + 1}</td>
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
    </tr>`,
    )
    .join("");
}
function autoCalcF(i) {
  calcFechamento(dadosFechamento[i]);
  const cells = document.getElementById("tableBodyFechamento").rows[i].cells;
  const calcMap = [
    [6, "nvRes"],
    [9, "tmRes"],
    [12, "ovRes"],
    [15, "posRes"],
    [18, "mixRes"],
  ];
  calcMap.forEach(([ci, key]) => {
    cells[ci].querySelector("input").value = dadosFechamento[i][key];
  });
}

/* ============ ADD / CLEAR ============ */
function addRow() {
  if (modo === "parcial") {
    dadosParcial.push(novoParcial());
    renderParcial();
  } else if (modo === "fechamento") {
    dadosFechamento.push(novoFechamento());
    renderFechamento();
  }
}
function clearAll() {
  if (modo === "dashboard") return;
  if (!confirm("Limpar todos os dados?")) return;
  if (modo === "parcial") {
    dadosParcial = [];
    renderParcial();
  } else {
    dadosFechamento = [];
    renderFechamento();
  }
  document.getElementById("resultsSection").style.display = "none";
}

/* ============ MODAL EDIÇÃO ============ */
function abrirEdit(i, m) {
  editIdx = i;
  editModo = m;
  const d = m === "parcial" ? dadosParcial[i] : dadosFechamento[i];
  document.getElementById("editTitle").textContent =
    `✏️ Editar: ${d.nome || "Representante " + (i + 1)}`;

  let html = "";
  if (m === "parcial") {
    html = `
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
      <div class="edit-section" style="grid-column:1/-1"><h4>Mix de Produtos (peso 10)</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px">
          <div class="edit-field"><label>Meta Parcial</label><input id="e_mixMetaP" type="number" value="${d.mixMetaP}" oninput="previewCalcP()"></div>
          <div class="edit-field"><label>Meta Mensal</label><input id="e_mixMetaM" type="number" value="${d.mixMetaM}"></div>
          <div class="edit-field"><label>Realizado</label><input id="e_mixReal" type="number" value="${d.mixReal}" oninput="previewCalcP()"></div>
          <div class="edit-field"><label>Resultado 🟢</label><input id="e_mixRes" class="calc-field" readonly value="${d.mixRes}"></div>
        </div>
      </div>
    </div>`;
  } else {
    html = `
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
      <div class="edit-section" style="grid-column:1/-1"><h4>Mix de Produtos (peso 10)</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
          <div class="edit-field"><label>Meta</label><input id="e_mixMeta" type="number" value="${d.mixMeta}" oninput="previewCalcF()"></div>
          <div class="edit-field"><label>Realizado</label><input id="e_mixReal" type="number" value="${d.mixReal}" oninput="previewCalcF()"></div>
          <div class="edit-field"><label>Resultado 🟢</label><input id="e_mixRes" class="calc-field" readonly value="${d.mixRes}"></div>
        </div>
      </div>
    </div>`;
  }
  html += `<div class="edit-actions">
    <button class="btn-cancel" onclick="fecharEditModal()">Cancelar</button>
    <button class="btn-save-tpl" onclick="salvarComoTemplate()" title="Salvar metas deste representante como template">💾 Salvar Metas como Template</button>
    <button class="btn-save" onclick="salvarEdit()">✅ Confirmar</button>
  </div>`;
  document.getElementById("editBody").innerHTML = html;
  document.getElementById("editOverlay").classList.add("active");
}
function gv(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}
function previewCalcP() {
  const tmp = {
    nvMetaP: gv("e_nvMetaP"),
    nvReal: gv("e_nvReal"),
    tmMeta: gv("e_tmMeta"),
    tmReal: gv("e_tmReal"),
    ovMetaP: gv("e_ovMetaP"),
    ovReal: gv("e_ovReal"),
    posMetaP: gv("e_posMetaP"),
    posReal: gv("e_posReal"),
    mixMetaP: gv("e_mixMetaP"),
    mixReal: gv("e_mixReal"),
  };
  calcParcial(tmp);
  const map = {
    e_nvRes: "nvRes",
    e_tmPct: "tmPct",
    e_ovRes: "ovRes",
    e_posRes: "posRes",
    e_mixRes: "mixRes",
  };
  Object.entries(map).forEach(([eid, key]) => {
    const el = document.getElementById(eid);
    if (el) el.value = tmp[key];
  });
}
function previewCalcF() {
  const tmp = {
    nvMeta: gv("e_nvMeta"),
    nvReal: gv("e_nvReal"),
    tmMeta: gv("e_tmMeta"),
    tmReal: gv("e_tmReal"),
    ovMeta: gv("e_ovMeta"),
    ovReal: gv("e_ovReal"),
    posMeta: gv("e_posMeta"),
    posReal: gv("e_posReal"),
    mixMeta: gv("e_mixMeta"),
    mixReal: gv("e_mixReal"),
  };
  calcFechamento(tmp);
  const map = {
    e_nvRes: "nvRes",
    e_tmRes: "tmRes",
    e_ovRes: "ovRes",
    e_posRes: "posRes",
    e_mixRes: "mixRes",
  };
  Object.entries(map).forEach(([eid, key]) => {
    const el = document.getElementById(eid);
    if (el) el.value = tmp[key];
  });
}
function salvarEdit() {
  if (editModo === "parcial") {
    const d = dadosParcial[editIdx];
    d.nome = gv("e_nome");
    d.ranking = gv("e_ranking");
    d.perfParcial = gv("e_perfParcial");
    d.perfMensal = gv("e_perfMensal");
    d.nvMetaP = gv("e_nvMetaP");
    d.nvMetaM = gv("e_nvMetaM");
    d.nvReal = gv("e_nvReal");
    d.tmMeta = gv("e_tmMeta");
    d.tmReal = gv("e_tmReal");
    d.ovMetaP = gv("e_ovMetaP");
    d.ovMetaM = gv("e_ovMetaM");
    d.ovReal = gv("e_ovReal");
    d.posMetaP = gv("e_posMetaP");
    d.posMetaM = gv("e_posMetaM");
    d.posReal = gv("e_posReal");
    d.mixMetaP = gv("e_mixMetaP");
    d.mixMetaM = gv("e_mixMetaM");
    d.mixReal = gv("e_mixReal");
    calcParcial(d);
    renderParcial();
  } else {
    const d = dadosFechamento[editIdx];
    d.nome = gv("e_nome");
    d.ranking = gv("e_ranking");
    d.perfMensal = gv("e_perfMensal");
    d.nvMeta = gv("e_nvMeta");
    d.nvReal = gv("e_nvReal");
    d.tmMeta = gv("e_tmMeta");
    d.tmReal = gv("e_tmReal");
    d.ovMeta = gv("e_ovMeta");
    d.ovReal = gv("e_ovReal");
    d.posMeta = gv("e_posMeta");
    d.posReal = gv("e_posReal");
    d.mixMeta = gv("e_mixMeta");
    d.mixReal = gv("e_mixReal");
    calcFechamento(d);
    renderFechamento();
  }
  fecharEditModal();
}
function fecharEditModal() {
  document.getElementById("editOverlay").classList.remove("active");
}
function closeEditModal(e) {
  if (e.target === document.getElementById("editOverlay")) fecharEditModal();
}
