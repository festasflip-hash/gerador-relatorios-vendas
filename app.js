import { PrintCSS } from "./scripts/printCSS.js";
import { criarRepresentanteFechamento, renderizarTabelaFechamento } from "./scripts/tabelaFechamento.js";
import { criarRepresentanteParcial, renderizarTabelaParcial } from "./scripts/tabelaParcial.js";
import { abrirSeletorCSV } from "./scripts/csv.js";
import { abrirGerenciadorTemplates, getPrintPage } from "./scripts/templates.js";
import { estado } from "./scripts/state.js";
import { gerarHTMLRelatorioParcial } from "./scripts/relatorioParcial.js";
import { gerarHTMLRelatorioFechamento } from "./scripts/relatorioFechamento.js";
import { renderDashboard } from "./scripts/dashboard.js";
import {
  converterParaFloat,
  formatarMoeda,
  obterClassePerformance,
  obterCorHex
} from "./scripts/helpers.js";

function obterDadosAtivos() {
  return estado.modoAtivo === "parcial"
    ? estado.listaRepresentantesParcial
    : estado.listaRepresentantesFechamento;
}

export function alternarAba(modoSelecionado) {
  estado.modoAtivo = modoSelecionado;

  document.getElementById("tabParcial").classList.toggle("active", modoSelecionado === "parcial");
  document.getElementById("tabFechamento").classList.toggle("active", modoSelecionado === "fechamento");
  document.getElementById("tabDashboard").classList.toggle("active", modoSelecionado === "dashboard");

  document.getElementById("tableWrapParcial").classList.toggle("hidden", modoSelecionado !== "parcial");
  document.getElementById("tableWrapFechamento").classList.toggle("hidden", modoSelecionado !== "fechamento");
  document.getElementById("dashWrap").classList.toggle("hidden", modoSelecionado !== "dashboard");

  document.getElementById("controlsBar").classList.toggle("hidden", modoSelecionado === "dashboard");
  document.getElementById("legendBar").classList.toggle("hidden", modoSelecionado === "dashboard");
  document.getElementById("resultsSection").style.display = "none";

  const subtitulo = {
    parcial: "Modo: Acompanhamento Parcial",
    fechamento: "Modo: Fechamento do Mês",
    dashboard: "Modo: Dashboard Consolidado"
  };

  document.getElementById("topbarSub").textContent = subtitulo[modoSelecionado] || "";

  if (modoSelecionado === "dashboard") {
    renderDashboard();
    return;
  }

  document.getElementById("ctrlTitle").textContent =
    modoSelecionado === "parcial" ? "Representantes — Parcial" : "Representantes — Fechamento";
  document.getElementById("lblPeriodo").textContent =
    modoSelecionado === "parcial" ? "Período Parcial" : "Período do Fechamento";
  document.getElementById("legendaExtra").textContent =
    modoSelecionado === "fechamento" ? "Status: Meta Batida / Não Batida" : "";

  if (modoSelecionado === "parcial") {
    renderizarTabelaParcial();
  } else {
    renderizarTabelaFechamento();
  }
}

export function adicionarLinha() {
  if (estado.modoAtivo === "parcial") {
    estado.listaRepresentantesParcial.push(criarRepresentanteParcial());
    renderizarTabelaParcial();
  } else if (estado.modoAtivo === "fechamento") {
    estado.listaRepresentantesFechamento.push(criarRepresentanteFechamento());
    renderizarTabelaFechamento();
  }
}

export function limparTabela() {
  if (estado.modoAtivo === "dashboard") return;
  if (!confirm("Limpar todos os dados?")) return;

  if (estado.modoAtivo === "parcial") {
    estado.listaRepresentantesParcial = [];
    renderizarTabelaParcial();
  } else {
    estado.listaRepresentantesFechamento = [];
    renderizarTabelaFechamento();
  }

  document.getElementById("resultsSection").style.display = "none";
}

export function gerarTodosRelatorios() {
  if (estado.modoAtivo === "dashboard") return;

  const dados = obterDadosAtivos();
  const validos = dados.filter(d => d.nome && d.nome.trim());

  if (!validos.length) {
    alert("Adicione ao menos um representante com nome!");
    return;
  }

  const list = document.getElementById("repList");
  list.innerHTML = "";

  validos.forEach((d, i) => {
    const pm = converterParaFloat(d.perfMensal);
    const [pmCls, pmLbl, pmTc] = obterClassePerformance(pm);
    const idx = dados.indexOf(d);

    const p2 =
      estado.modoAtivo === "parcial"
        ? (() => {
            const pp = converterParaFloat(d.perfParcial);
            const [ppCls, ppLbl, ppTc] = obterClassePerformance(pp);
            return `<div class="rcm-pi ${ppTc}"><div class="pl">Parcial</div><div class="pv ${ppCls}">${pp}%</div><div class="ps ${ppCls}">${ppLbl}</div></div>`;
          })()
        : (() => {
            const nvOk = converterParaFloat(d.nvReal) >= converterParaFloat(d.nvMeta);
            const tmOk = converterParaFloat(d.tmReal) >= converterParaFloat(d.tmMeta);
            const ovOk = converterParaFloat(d.ovReal) >= converterParaFloat(d.ovMeta);
            const posOk = converterParaFloat(d.posReal) >= converterParaFloat(d.posMeta);
            const mixOk = converterParaFloat(d.mixReal) >= converterParaFloat(d.mixMeta);
            const bat = [nvOk, tmOk, ovOk, posOk, mixOk].filter(Boolean).length;
            const tc = bat === 5 ? "tc-verde" : bat === 0 ? "tc-baixa" : "tc-media";
            const vc = bat === 5 ? "c-verde" : bat === 0 ? "c-baixa" : "c-media";
            return `
              <div class="rcm-pi ${tc}">
                <div class="pl">Metas</div>
                <div class="pv ${vc}">${bat}/5</div>
                <div class="ps">batidas</div>
              </div>`;
          })();

    const div = document.createElement("div");
    div.className = "rep-card-mini";
    div.innerHTML = `
      <div class="rcm-head">
        <span class="rcm-name">${d.nome}</span>
        <span class="rcm-rank">${d.ranking}º</span>
      </div>
      <div class="rcm-body">
        <div class="rcm-perf">${p2}<div class="rcm-pi ${pmTc}">
          <div class="pl">Mensal</div>
          <div class="pv ${pmCls}">${pm}%</div>
          <div class="ps ${pmCls}">${pmLbl}</div>
        </div>
      </div>
      <div class="rcm-actions">
        <button class="btn-view" onclick="visualizarRelatorio(${idx})">👁 Ver</button>
        <button class="btn-print" onclick="imprimirRelatorioPorIndice(${idx})">🖨️ PDF</button>
      </div>`;

    list.appendChild(div);
  });

  document.getElementById("resultsSection").style.display = "block";
  document.getElementById("resultsTitle").textContent = `${validos.length} relatório(s) gerado(s)`;
  document.getElementById("btnPrintAll").style.display = "block";
  document.getElementById("btnZipAll").style.display = estado.modoAtivo === "fechamento" ? "block" : "none";
  document.getElementById("resultsSection").scrollIntoView({ behavior: "smooth" });
}

export function visualizarRelatorio(indice) {
  const dados = obterDadosAtivos();
  const representante = dados[indice];
  if (!representante) return;

  const html =
    estado.modoAtivo === "parcial"
      ? gerarHTMLRelatorioParcial(representante)
      : gerarHTMLRelatorioFechamento(representante);

  estado.htmlRelatorioAtivo = html;
  estado.nomeRelatorioAtivo = representante.nome;
  document.getElementById("modalTitle").textContent = `Relatório — ${representante.nome}`;
  document.getElementById("modalContent").innerHTML = html;
  document.getElementById("modalOverlay").classList.add("active");
}

export function fecharModalRelatorio() {
  document.getElementById("modalOverlay").classList.remove("active");
}

export function fecharModalRelatorioAoClicarFora(evento) {
  if (evento.target === document.getElementById("modalOverlay")) {
    fecharModalRelatorio();
  }
}

function abrirJanelaImpressao(html, nome) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(getPrintPage(html, nome, PrintCSS));
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 600);
}

export function imprimirRelatorioAtivo() {
  if (estado.htmlRelatorioAtivo) {
    abrirJanelaImpressao(estado.htmlRelatorioAtivo, estado.nomeRelatorioAtivo || "Relatorio");
  }
}

export function imprimirRelatorioPorIndice(indice) {
  const dados = obterDadosAtivos();
  const representante = dados[indice];
  if (!representante) return;

  const html =
    estado.modoAtivo === "parcial"
      ? gerarHTMLRelatorioParcial(representante)
      : gerarHTMLRelatorioFechamento(representante);

  abrirJanelaImpressao(html, representante.nome);
}

export function imprimirTodosRelatorios() {
  const dados = obterDadosAtivos().filter(d => d.nome && d.nome.trim());
  if (!dados.length) return;

  const html = dados
    .map((d, index) => {
      const rel =
        estado.modoAtivo === "parcial"
          ? gerarHTMLRelatorioParcial(d)
          : gerarHTMLRelatorioFechamento(d);
      return rel + (index < dados.length - 1 ? '<div style="page-break-after:always"></div>' : "");
    })
    .join("");

  abrirJanelaImpressao(html, "Relatorios_Lote");
}

export async function baixarRelatoriosEmZip() {
  if (estado.modoAtivo !== "fechamento") return;
  const zip = new JSZip();
  const mes = document.getElementById("mesInput").value || "Relatorios";

  estado.listaRepresentantesFechamento
    .filter(d => d.nome && d.nome.trim())
    .forEach(d => {
      const nomeArquivo = `Relatório Individual - ${d.nome.replace(/[\\/:*?"<>|]/g, "_")}`;
      const conteudo = getPrintPage(gerarHTMLRelatorioFechamento(d), nomeArquivo, PrintCSS);
      zip.file(`${nomeArquivo}.html`, conteudo);
    });

  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Relatorios_Fechamento_${mes.replace(/ /g, "_")}.zip`;
  a.click();
}

const btnAdicionar = document.getElementById("btn-add");
const btnLimpar = document.getElementById("btn-clear");
const btnGerar = document.getElementById("btn-gerar");
const btnCsv = document.getElementById("btn-csv");
const btnTpl = document.getElementById("btn-tpl");

if (btnAdicionar) btnAdicionar.addEventListener("click", adicionarLinha);
if (btnLimpar) btnLimpar.addEventListener("click", limparTabela);
if (btnGerar) btnGerar.addEventListener("click", gerarTodosRelatorios);
if (btnCsv) btnCsv.addEventListener("click", abrirSeletorCSV);
if (btnTpl) btnTpl.addEventListener("click", abrirGerenciadorTemplates);

estado.listaRepresentantesParcial.push(criarRepresentanteParcial());
estado.listaRepresentantesParcial.push(criarRepresentanteParcial());
estado.listaRepresentantesParcial.push(criarRepresentanteParcial());
renderizarTabelaParcial();

window.alternarAba = alternarAba;
window.adicionarLinha = adicionarLinha;
window.limparTabela = limparTabela;
window.gerarTodosRelatorios = gerarTodosRelatorios;
window.visualizarRelatorio = visualizarRelatorio;
window.fecharModalRelatorio = fecharModalRelatorio;
window.fecharModalRelatorioAoClicarFora = fecharModalRelatorioAoClicarFora;
window.imprimirRelatorioAtivo = imprimirRelatorioAtivo;
window.imprimirRelatorioPorIndice = imprimirRelatorioPorIndice;
window.imprimirTodosRelatorios = imprimirTodosRelatorios;
window.baixarRelatoriosEmZip = baixarRelatoriosEmZip;
