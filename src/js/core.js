/* ============ ESTADO ============ */
let modo = "parcial";
let dadosParcial = [];
let dadosFechamento = [];
let relAtual = null,
  relAtualNome = null;
let editIdx = -1,
  editModo = "parcial";
/* ============ PESOS ============ */
const PESOS = { nv: 5, tm: 10, ov: 60, pos: 15, mix: 10 };

let dadosMesAnterior = [];
let mesHistorico = "";
const BRAND_KEY = "relatorios_marca_v1";
const BRAND_FALLBACK = "Gerador de Relatórios Comerciais";
const BRAND_LOGO_MAX_BYTES = 1024 * 1024;
let marcaAtual = carregarMarca();
let marcaEmEdicao = null;
/* ============ HELPERS ============ */
const f = (v) => {
  const valor = (v ?? "").toString().trim().replace(/\s/g, "");
  if (!valor) return 0;
  const ultimaVirgula = valor.lastIndexOf(",");
  const ultimoPonto = valor.lastIndexOf(".");
  let normalizado = valor;
  if (ultimaVirgula !== -1 && ultimoPonto !== -1) {
    normalizado =
      ultimaVirgula > ultimoPonto
        ? valor.replace(/\./g, "").replace(",", ".")
        : valor.replace(/,/g, "");
  } else if (ultimaVirgula !== -1) {
    normalizado =
      (valor.match(/,/g) || []).length > 1
        ? valor.replace(/,/g, "")
        : valor.replace(",", ".");
  } else if (/^-?\d{1,3}(?:\.\d{3})+$/.test(valor)) {
    normalizado = valor.replace(/\./g, "");
  }
  const numero = parseFloat(normalizado.replace(/[^\d.-]/g, ""));
  return Number.isFinite(numero) ? numero : 0;
};
const fmt = (v) =>
  v.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
function escaparHTML(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (caractere) => {
    const entidades = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entidades[caractere];
  });
}
function logoMarcaValido(logo) {
  return (
    typeof logo === "string" &&
    logo.length <= Math.ceil((BRAND_LOGO_MAX_BYTES * 4) / 3) + 64 &&
    /^data:image\/(png|jpeg|webp);base64,[a-z\d+/]+={0,2}$/i.test(logo)
  );
}
function carregarMarca() {
  try {
    const marca = JSON.parse(localStorage.getItem(BRAND_KEY) || "{}");
    return {
      nome: typeof marca.nome === "string" ? marca.nome.slice(0, 60) : "",
      logo: logoMarcaValido(marca.logo) ? marca.logo : "",
    };
  } catch {
    return { nome: "", logo: "" };
  }
}
function nomeMarca() {
  return marcaAtual.nome.trim() || BRAND_FALLBACK;
}
function atualizarMarcaUI() {
  const nome = document.getElementById("appBrandName");
  const logo = document.getElementById("appBrandLogo");
  if (!nome || !logo) return;
  nome.textContent = nomeMarca();
  logo.hidden = !logoMarcaValido(marcaAtual.logo);
  logo.src = logo.hidden ? "" : marcaAtual.logo;
}
function atualizarPreviewMarca() {
  const preview = document.getElementById("brandLogoPreview");
  if (!preview || !marcaEmEdicao) return;
  preview.hidden = !logoMarcaValido(marcaEmEdicao.logo);
  preview.src = preview.hidden ? "" : marcaEmEdicao.logo;
}
function abrirMarcaModal() {
  marcaEmEdicao = { ...marcaAtual };
  document.getElementById("brandNameInput").value = marcaEmEdicao.nome;
  document.getElementById("brandLogoInput").value = "";
  atualizarPreviewMarca();
  document.getElementById("brandOverlay").classList.add("active");
}
function fecharMarcaModal() {
  document.getElementById("brandOverlay").classList.remove("active");
  marcaEmEdicao = null;
}
function closeBrandModal(event) {
  if (event.target === document.getElementById("brandOverlay"))
    fecharMarcaModal();
}
function handleBrandLogo(event) {
  const arquivo = event.target.files?.[0];
  if (!arquivo || !marcaEmEdicao) return;
  const tiposPermitidos = ["image/png", "image/jpeg", "image/webp"];
  if (!tiposPermitidos.includes(arquivo.type)) {
    alert("Selecione uma imagem PNG, JPG ou WebP.");
    event.target.value = "";
    return;
  }
  if (arquivo.size > BRAND_LOGO_MAX_BYTES) {
    alert("O logo deve ter no máximo 1 MiB.");
    event.target.value = "";
    return;
  }
  const leitor = new FileReader();
  leitor.onload = () => {
    if (!logoMarcaValido(leitor.result)) {
      alert("Não foi possível carregar essa imagem.");
      return;
    }
    marcaEmEdicao.logo = leitor.result;
    atualizarPreviewMarca();
  };
  leitor.onerror = () => alert("Não foi possível ler essa imagem.");
  leitor.readAsDataURL(arquivo);
}
function removerLogoMarca() {
  if (!marcaEmEdicao) return;
  marcaEmEdicao.logo = "";
  document.getElementById("brandLogoInput").value = "";
  atualizarPreviewMarca();
}
function salvarMarca() {
  if (!marcaEmEdicao) return;
  marcaEmEdicao.nome = document
    .getElementById("brandNameInput")
    .value.trim()
    .slice(0, 60);
  try {
    localStorage.setItem(BRAND_KEY, JSON.stringify(marcaEmEdicao));
  } catch {
    alert("Não foi possível salvar a marca neste navegador.");
    return;
  }
  marcaAtual = { ...marcaEmEdicao };
  atualizarMarcaUI();
  fecharMarcaModal();
}
function marcaRelatorioHTML() {
  const logo = logoMarcaValido(marcaAtual.logo)
    ? `<img src="${marcaAtual.logo}" alt="" />`
    : "";
  return `<div class="report-brand">${logo}<span>${escaparHTML(nomeMarca())}</span></div>`;
}
function perfClass(p) {
  return p >= 90
    ? ["c-verde", "ALTA", "tc-verde"]
    : p >= 50
      ? ["c-media", "MÉDIA", "tc-media"]
      : ["c-baixa", "BAIXA", "tc-baixa"];
}
function mesComDeslocamento(valor, deslocamento = 0) {
  const match = /^(\d{4})-(\d{2})$/.exec(valor || "");
  if (!match) return "";
  const ano = Number(match[1]);
  const mes = Number(match[2]);
  if (mes < 1 || mes > 12) return "";
  const data = new Date(Date.UTC(ano, mes - 1 + deslocamento, 1));
  return `${data.getUTCFullYear()}-${String(data.getUTCMonth() + 1).padStart(2, "0")}`;
}
function rotuloMes(valor) {
  const match = /^(\d{4})-(\d{2})$/.exec(valor || "");
  if (!match || Number(match[2]) < 1 || Number(match[2]) > 12)
    return "Mês inválido";
  const data = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  const rotulo = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(data);
  return rotulo.charAt(0).toLocaleUpperCase("pt-BR") + rotulo.slice(1);
}
function atualizarStatusHistorico() {
  const status = document.getElementById("historyStatus");
  if (!status) return;
  const mesAnterior = mesComDeslocamento(
    document.getElementById("mesInput").value,
    -1,
  );
  if (mesHistorico && mesHistorico !== mesAnterior) {
    status.textContent = `CSV carregado para ${rotuloMes(mesHistorico)}. Reimporte o mês anterior.`;
  } else if (mesHistorico && dadosMesAnterior.length) {
    status.textContent = `${dadosMesAnterior.length} representante(s) em ${rotuloMes(mesHistorico)}`;
  } else {
    status.textContent = `Sem CSV de ${rotuloMes(mesAnterior)}`;
  }
}
function historicoDoMesAtual() {
  const mesAnterior = mesComDeslocamento(
    document.getElementById("mesInput").value,
    -1,
  );
  return mesHistorico === mesAnterior ? dadosMesAnterior : [];
}
function normalizarNome(nome) {
  return (nome || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}
function buscarNoHistorico(dados) {
  const nome = normalizarNome(dados.nome);
  return historicoDoMesAtual().find(
    (anterior) => normalizarNome(anterior.nome) === nome,
  );
}
function resultadoPonderado(dados, fonte) {
  const ticket =
    fonte === "parcial" ? Math.min(f(dados.tmPct), 100) / 10 : f(dados.tmRes);
  return (
    Math.round(
      (f(dados.nvRes) +
        ticket +
        f(dados.ovRes) +
        f(dados.posRes) +
        f(dados.mixRes)) *
        100,
    ) / 100
  );
}
function periodoParcialAtual() {
  const mes = document.getElementById("mesInput").value;
  const inicio = document.getElementById("periodoInicioInput").value;
  const fim = document.getElementById("periodoFimInput").value;
  const mesMatch = /^(\d{4})-(\d{2})$/.exec(mes);
  const dataMatch = (valor) => /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor || "");
  const inicioMatch = dataMatch(inicio);
  const fimMatch = dataMatch(fim);
  if (!mesMatch || !inicioMatch || !fimMatch)
    return { valido: false, erro: "Informe as datas inicial e final do acompanhamento." };

  const ano = Number(mesMatch[1]);
  const numeroMes = Number(mesMatch[2]);
  const ultimoDia = new Date(Date.UTC(ano, numeroMes, 0)).getUTCDate();
  const dataUTC = (match) =>
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const inicioUTC = dataUTC(inicioMatch);
  const fimUTC = dataUTC(fimMatch);
  const dataValida = (match, utc) =>
    Number(match[1]) === ano &&
    Number(match[2]) === numeroMes &&
    Number(match[3]) >= 1 &&
    Number(match[3]) <= ultimoDia &&
    new Date(utc).toISOString().slice(0, 10) ===
      `${match[1]}-${match[2]}-${match[3]}`;
  if (!dataValida(inicioMatch, inicioUTC) || !dataValida(fimMatch, fimUTC))
    return {
      valido: false,
      erro: "As datas do acompanhamento devem estar dentro do mês de referência.",
    };
  if (Number(inicioMatch[3]) !== 1)
    return {
      valido: false,
      erro: "O acompanhamento Parcial deve iniciar no primeiro dia do mês.",
    };
  if (inicioUTC > fimUTC)
    return {
      valido: false,
      erro: "A data inicial deve ser anterior ou igual à data final.",
    };

  const formatarData = (match) =>
    `${match[3]}/${match[2]}/${match[1]}`;
  return {
    valido: true,
    inicio,
    fim,
    diasDecorridos: Number(fimMatch[3]),
    diasNoMes: ultimoDia,
    proporcao: Number(fimMatch[3]) / ultimoDia,
    rotulo: `${formatarData(inicioMatch)} a ${formatarData(fimMatch)}`,
  };
}
function atualizarMetasParciais(dados) {
  const periodo = periodoParcialAtual();
  const metas = [
    ["nvMetaP", "nvMetaM"],
    ["ovMetaP", "ovMetaM"],
    ["posMetaP", "posMetaM"],
    ["mixMetaP", "mixMetaM"],
  ];
  metas.forEach(([metaParcial, metaMensal]) => {
    dados[metaParcial] =
      periodo.valido && f(dados[metaMensal]) > 0
        ? (f(dados[metaMensal]) * periodo.proporcao).toFixed(2)
        : "";
  });
}
function temValor(valor) {
  return valor !== "" && valor !== null && valor !== undefined;
}
function pontosIndicador(realizado, meta, peso) {
  const atingimento =
    f(meta) > 0 ? Math.min((f(realizado) / f(meta)) * 100, 100) : 0;
  return (atingimento / 100) * peso;
}
function performanceCalculada(dados, metas) {
  const pontos =
    pontosIndicador(dados.nvReal, metas.nv, PESOS.nv) +
    pontosIndicador(dados.tmReal, dados.tmMeta, PESOS.tm) +
    pontosIndicador(dados.ovReal, metas.ov, PESOS.ov) +
    pontosIndicador(dados.posReal, metas.pos, PESOS.pos) +
    pontosIndicador(dados.mixReal, metas.mix, PESOS.mix);
  return Math.min(pontos, 100).toFixed(2);
}
function rotuloPeriodoParcial() {
  const periodo = periodoParcialAtual();
  return periodo.valido ? periodo.rotulo : "Período inválido";
}
const metricasHistorico = [
  {
    key: "perfMensal",
    label: "Performance mensal",
    dashboardLabel: "Performance da equipe (média)",
    tipo: "percent",
    agregacao: "media",
  },
  {
    key: "nvReal",
    label: "Novas vendas",
    dashboardLabel: "Novas vendas (total)",
    tipo: "count",
    agregacao: "soma",
  },
  {
    key: "tmReal",
    label: "Ticket médio",
    dashboardLabel: "Ticket médio por representante (média)",
    tipo: "money",
    agregacao: "media",
  },
  {
    key: "ovReal",
    label: "Objetivo de vendas",
    dashboardLabel: "Faturamento (total)",
    tipo: "money",
    agregacao: "soma",
  },
  {
    key: "posReal",
    label: "Positivação",
    dashboardLabel: "Positivação (soma por representante)",
    tipo: "count",
    agregacao: "soma",
  },
  {
    key: "mixReal",
    label: "Mix de produtos",
    dashboardLabel: "Mix de produtos (soma por representante)",
    tipo: "count",
    agregacao: "soma",
  },
  {
    key: "resultado",
    label: "Resultado ponderado",
    dashboardLabel: "Resultado ponderado (total)",
    tipo: "points",
    agregacao: "soma",
  },
];
function valorHistorico(dados, metrica, fonte) {
  return metrica.key === "resultado"
    ? resultadoPonderado(dados, fonte)
    : f(dados[metrica.key]);
}
function agregarMetricaDashboard(dados, metrica, fonte) {
  const total = dados.reduce(
    (soma, representante) =>
      soma + valorHistorico(representante, metrica, fonte),
    0,
  );
  return metrica.agregacao === "media" && dados.length
    ? total / dados.length
    : total;
}
function formatarValorHistorico(valor, tipo) {
  if (valor === null || valor === undefined) return "Indisponível";
  const numero = Number(valor).toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  });
  if (tipo === "money") return `R$ ${numero}`;
  if (tipo === "percent") return `${numero}%`;
  if (tipo === "points") return `${numero} pts`;
  return numero;
}
function variacaoHistorico(atual, anterior, tipo) {
  if (anterior === null || anterior === undefined) return "Indisponível";
  const variacao = atual - anterior;
  const sinal = variacao > 0 ? "+" : "";
  return `${sinal}${formatarValorHistorico(variacao, tipo)}`;
}
function tendenciaHistoricoHTML(
  atual,
  anterior,
  tipo,
  mostrarPercentual = false,
) {
  const indisponivel = anterior === null || anterior === undefined;
  const variacao = indisponivel ? null : atual - anterior;
  const classe = indisponivel
    ? "history-unavailable"
    : variacao > 0
      ? "history-positive"
      : variacao < 0
        ? "history-negative"
        : "history-neutral";
  const seta = indisponivel
    ? "–"
    : variacao > 0
      ? "↑"
      : variacao < 0
        ? "↓"
        : "→";
  const descricao = indisponivel
    ? "Comparação indisponível"
    : variacao > 0
      ? "Aumento"
      : variacao < 0
        ? "Queda"
        : "Sem variação";
  const texto = variacaoHistorico(atual, anterior, tipo);
  const percentual =
    mostrarPercentual && !indisponivel
      ? anterior === 0
        ? "Sem base"
        : `${variacao > 0 ? "+" : ""}${((variacao / Math.abs(anterior)) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
      : "";
  const percentualHTML = percentual
    ? `<small class="history-change-percent">(${percentual})</small>`
    : "";
  const complemento = percentual ? `, ${percentual}` : "";
  return `<span class="history-change ${classe}" aria-label="${descricao}: ${texto}${complemento}"><span class="history-arrow" aria-hidden="true">${seta}</span><span class="history-change-values"><span>${texto}</span>${percentualHTML}</span></span>`;
}
function tabelaHistoricoHTML(dadosAtuais, fonte) {
  const mesAtual = document.getElementById("mesInput").value;
  const mesAnterior = mesComDeslocamento(mesAtual, -1);
  const dadosAnteriores = historicoDoMesAtual();
  const anterior = dadosAnteriores.length
    ? buscarNoHistorico(dadosAtuais)
    : null;
  const linhas = metricasHistorico
    .map((metrica) => {
      const valorAtual = valorHistorico(dadosAtuais, metrica, fonte);
      const valorAnterior = anterior
        ? valorHistorico(anterior, metrica, "fechamento")
        : null;
      const destaque = metrica.key === "resultado" ? "history-result-row" : "";
      return `<tr class="${destaque}"><td>${metrica.label}</td><td>${formatarValorHistorico(valorAnterior, metrica.tipo)}</td><td class="history-current-cell">${formatarValorHistorico(valorAtual, metrica.tipo)}</td><td>${tendenciaHistoricoHTML(valorAtual, valorAnterior, metrica.tipo)}</td></tr>`;
    })
    .join("");
  const nota = dadosAnteriores.length
    ? `Fechamento completo de ${rotuloMes(mesAnterior)} comparado ao mês atual.`
    : `Importe o CSV de fechamento de ${rotuloMes(mesAnterior)} para habilitar a comparação.`;
  return `<div class="history-comparison"><div class="history-heading"><strong>Evolução mês a mês</strong><p>${nota}</p></div><table><thead><tr><th>Indicador</th><th>${rotuloMes(mesAnterior)}</th><th class="history-current-head">${rotuloMes(mesAtual)} (${fonte === "parcial" ? "parcial" : "fechamento"})</th><th>Variação</th></tr></thead><tbody>${linhas}</tbody></table></div>`;
}
function badgeC(p) {
  return p >= 90 ? "b-green" : p >= 50 ? "b-orange" : "b-red";
}
function barC(p) {
  return p >= 90 ? "bg-g" : p >= 50 ? "bg-o" : "bg-r";
}
function txtC(p) {
  return p >= 90 ? "c-verde" : p >= 50 ? "c-media" : "c-baixa";
}
function colorHex(p) {
  return p >= 90 ? "#27ae60" : p >= 50 ? "#e67e22" : "#e74c3c";
}
function barHTML(p) {
  const w = Math.min(Math.max(p, 1), 100);
  return `<div class="bar-w"><div class="bar-bg"><div class="bar-f ${barC(p)}" style="width:${w}%"></div></div><span class="bp ${txtC(p)}">${p.toFixed(0)}%</span></div>`;
}
function statusPill(ok) {
  return ok
    ? `<span class="status-pill status-ok">✓ Meta Batida</span>`
    : `<span class="status-pill status-fail">✕ Não Batida</span>`;
}

/* ============ CÁLCULOS AUTOMÁTICOS ============ */
function calcParcial(d) {
  atualizarMetasParciais(d);
  const nvPct =
    f(d.nvMetaP) > 0 ? Math.min((f(d.nvReal) / f(d.nvMetaP)) * 100, 100) : 0;
  d.nvRes = ((nvPct / 100) * PESOS.nv).toFixed(2);
  const tmPct =
    f(d.tmMeta) > 0 ? Math.min((f(d.tmReal) / f(d.tmMeta)) * 100, 100) : 0;
  d.tmPct = tmPct.toFixed(2);
  const ovPct =
    f(d.ovMetaP) > 0 ? Math.min((f(d.ovReal) / f(d.ovMetaP)) * 100, 100) : 0;
  d.ovRes = ((ovPct / 100) * PESOS.ov).toFixed(2);
  const posPct =
    f(d.posMetaP) > 0 ? Math.min((f(d.posReal) / f(d.posMetaP)) * 100, 100) : 0;
  d.posRes = ((posPct / 100) * PESOS.pos).toFixed(2);
  const mixPct =
    f(d.mixMetaP) > 0 ? Math.min((f(d.mixReal) / f(d.mixMetaP)) * 100, 100) : 0;
  d.mixRes = ((mixPct / 100) * PESOS.mix).toFixed(2);
  if (!d.perfParcialManual)
    d.perfParcial = performanceCalculada(d, {
      nv: d.nvMetaP,
      ov: d.ovMetaP,
      pos: d.posMetaP,
      mix: d.mixMetaP,
    });
  if (!d.perfMensalManual)
    d.perfMensal = performanceCalculada(d, {
      nv: d.nvMetaM,
      ov: d.ovMetaM,
      pos: d.posMetaM,
      mix: d.mixMetaM,
    });
}
function calcFechamento(d) {
  const nvPct =
    f(d.nvMeta) > 0 ? Math.min((f(d.nvReal) / f(d.nvMeta)) * 100, 100) : 0;
  d.nvRes = ((nvPct / 100) * PESOS.nv).toFixed(2);
  const tmPct =
    f(d.tmMeta) > 0 ? Math.min((f(d.tmReal) / f(d.tmMeta)) * 100, 100) : 0;
  d.tmRes = ((tmPct / 100) * PESOS.tm).toFixed(2);
  const ovPct =
    f(d.ovMeta) > 0 ? Math.min((f(d.ovReal) / f(d.ovMeta)) * 100, 100) : 0;
  d.ovRes = ((ovPct / 100) * PESOS.ov).toFixed(2);
  const posPct =
    f(d.posMeta) > 0 ? Math.min((f(d.posReal) / f(d.posMeta)) * 100, 100) : 0;
  d.posRes = ((posPct / 100) * PESOS.pos).toFixed(2);
  const mixPct =
    f(d.mixMeta) > 0 ? Math.min((f(d.mixReal) / f(d.mixMeta)) * 100, 100) : 0;
  d.mixRes = ((mixPct / 100) * PESOS.mix).toFixed(2);
  if (!d.perfMensalManual)
    d.perfMensal = performanceCalculada(d, {
      nv: d.nvMeta,
      ov: d.ovMeta,
      pos: d.posMeta,
      mix: d.mixMeta,
    });
}
