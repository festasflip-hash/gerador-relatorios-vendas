/* ============ CSV ============ */
function downloadModelo() {
  let h, ex;
  if (modo === "parcial") {
    h =
      "Nome,Ranking,NV_MetaM,NV_Real,TM_Meta,TM_Real,OV_MetaM,OV_Real,POS_MetaM,POS_Real,MIX_MetaM,MIX_Real";
    ex =
      "Carlos Martins / RP,13,3,0,3000,2094.53,35000,12567.16,12,6,125,64";
  } else {
    h =
      "Nome,Ranking,NV_Meta,NV_Real,TM_Meta,TM_Real,OV_Meta,OV_Real,POS_Meta,POS_Real,MIX_Meta,MIX_Real";
    ex = "Carlos Martins / RP,13,3,1,3000,2200,35000,15000,12,7,125,70";
  }
  const blob = new Blob([h + "\n" + ex], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `modelo_${modo}.csv`;
  a.click();
}
function importCSV() {
  document.getElementById("csvFile").click();
}
function parseReportCSV(
  texto,
  modoRelatorio,
  { recalcularPerformance = false } = {},
) {
  const linhas = texto.split("\n").filter((linha) => linha.trim());
  const delimitador = detectarDelimitadorCSV(linhas[0] || "");
  const cabecalho = parseCSV(linhas.shift() || "", delimitador).map((campo) =>
    campo.replace(/^\uFEFF/, "").trim().toLocaleLowerCase("pt-BR"),
  );
  const coluna = (campos, ...nomes) => {
    const indice = nomes
      .map((nome) => cabecalho.indexOf(nome.toLowerCase()))
      .find((indice) => indice !== -1);
    return indice === undefined ? undefined : campos[indice];
  };
  const modeloParcial =
    cabecalho.includes("nv_metam") &&
    !cabecalho.includes("nv_metap") &&
    !cabecalho.includes("perf_parcial_%") &&
    !cabecalho.includes("perf_mensal_%");
  const modeloFechamento =
    cabecalho.includes("nv_meta") && !cabecalho.includes("perf_mensal_%");
  const historicoParcial = recalcularPerformance && cabecalho.includes("nv_metam");
  const dados = [];
  linhas.forEach((linha) => {
    const c = parseCSV(linha, delimitador);
    if (!coluna(c, "nome")) return;
    if (modoRelatorio === "parcial") {
      const d = novoParcial(
        modeloParcial
          ? {
              nome: coluna(c, "nome"),
              ranking: coluna(c, "ranking"),
              nvMetaM: coluna(c, "nv_metam"),
              nvReal: coluna(c, "nv_real"),
              tmMeta: coluna(c, "tm_meta"),
              tmReal: coluna(c, "tm_real"),
              ovMetaM: coluna(c, "ov_metam"),
              ovReal: coluna(c, "ov_real"),
              posMetaM: coluna(c, "pos_metam"),
              posReal: coluna(c, "pos_real"),
              mixMetaM: coluna(c, "mix_metam"),
              mixReal: coluna(c, "mix_real"),
            }
          : {
              nome: coluna(c, "nome"),
              ranking: coluna(c, "ranking"),
              perfParcial: coluna(c, "perf_parcial_%"),
              perfParcialManual:
                coluna(c, "perf_parcial_%") !== undefined &&
                coluna(c, "perf_parcial_%") !== "",
              perfMensal: coluna(c, "perf_mensal_%"),
              perfMensalManual:
                coluna(c, "perf_mensal_%") !== undefined &&
                coluna(c, "perf_mensal_%") !== "",
              nvMetaM: coluna(c, "nv_metam"),
              nvReal: coluna(c, "nv_real"),
              tmMeta: coluna(c, "tm_meta"),
              tmReal: coluna(c, "tm_real"),
              ovMetaM: coluna(c, "ov_metam"),
              ovReal: coluna(c, "ov_real"),
              posMetaM: coluna(c, "pos_metam"),
              posReal: coluna(c, "pos_real"),
              mixMetaM: coluna(c, "mix_metam"),
              mixReal: coluna(c, "mix_real"),
            },
      );
      calcParcial(d);
      dados.push(d);
    } else {
      const d = novoFechamento(
        modeloFechamento
          ? {
              nome: coluna(c, "nome"),
              ranking: coluna(c, "ranking"),
              nvMeta: coluna(c, "nv_meta"),
              nvReal: coluna(c, "nv_real"),
              tmMeta: coluna(c, "tm_meta"),
              tmReal: coluna(c, "tm_real"),
              ovMeta: coluna(c, "ov_meta"),
              ovReal: coluna(c, "ov_real"),
              posMeta: coluna(c, "pos_meta"),
              posReal: coluna(c, "pos_real"),
              mixMeta: coluna(c, "mix_meta"),
              mixReal: coluna(c, "mix_real"),
            }
          : {
              nome: coluna(c, "nome"),
              ranking: coluna(c, "ranking"),
              perfMensal: recalcularPerformance
                ? undefined
                : coluna(c, "perf_mensal_%"),
              perfMensalManual:
                !recalcularPerformance &&
                coluna(c, "perf_mensal_%") !== undefined &&
                coluna(c, "perf_mensal_%") !== "",
              nvMeta: historicoParcial
                ? coluna(c, "nv_meta", "nv_metam")
                : coluna(c, "nv_meta"),
              nvReal: coluna(c, "nv_real"),
              tmMeta: coluna(c, "tm_meta"),
              tmReal: coluna(c, "tm_real"),
              ovMeta: historicoParcial
                ? coluna(c, "ov_meta", "ov_metam")
                : coluna(c, "ov_meta"),
              ovReal: coluna(c, "ov_real"),
              posMeta: historicoParcial
                ? coluna(c, "pos_meta", "pos_metam")
                : coluna(c, "pos_meta"),
              posReal: coluna(c, "pos_real"),
              mixMeta: historicoParcial
                ? coluna(c, "mix_meta", "mix_metam")
                : coluna(c, "mix_meta"),
              mixReal: coluna(c, "mix_real"),
            },
      );
      calcFechamento(d);
      dados.push(d);
    }
  });
  return dados;
}
function handleCSV(e) {
  const file = e.target.files[0];
  if (!file) return;
  const modoImportacao = modo === "fechamento" ? "fechamento" : "parcial";
  const r = new FileReader();
  r.onload = (ev) => {
    const dados = parseReportCSV(ev.target.result, modoImportacao);
    if (modoImportacao === "parcial") {
      dadosParcial = dados;
      renderParcial();
    } else {
      dadosFechamento = dados;
      renderFechamento();
    }
    alert("✅ Importado e calculado com sucesso!");
  };
  r.readAsText(file);
  e.target.value = "";
}
function importarCSVAnterior() {
  document.getElementById("previousCsvFile").click();
}
function handleCSVAnterior(e) {
  const file = e.target.files[0];
  if (!file) return;
  const mesAnterior = mesComDeslocamento(
    document.getElementById("mesInput").value,
    -1,
  );
  if (!mesAnterior) {
    alert(
      "Selecione um mês de referência válido antes de importar o histórico.",
    );
    e.target.value = "";
    return;
  }
  const r = new FileReader();
  r.onload = (ev) => {
    dadosMesAnterior = parseReportCSV(ev.target.result, "fechamento", {
      recalcularPerformance: true,
    });
    mesHistorico = mesAnterior;
    atualizarStatusHistorico();
    if (modo === "dashboard") renderDashboard();
    alert(
      `✅ Fechamento de ${rotuloMes(mesAnterior)} importado para comparação!`,
    );
  };
  r.readAsText(file);
  e.target.value = "";
}
function handleMonthChange() {
  atualizarDatasDoMes();
  atualizarStatusHistorico();
  if (modo === "dashboard") renderDashboard();
}
function detectarDelimitadorCSV(linha) {
  const contagens = [",", ";", "\t"].map((delimitador) => {
    let dentroDeAspas = false;
    let quantidade = 0;
    for (const caractere of linha) {
      if (caractere === '"') dentroDeAspas = !dentroDeAspas;
      else if (caractere === delimitador && !dentroDeAspas) quantidade++;
    }
    return { delimitador, quantidade };
  });
  return contagens.reduce((maior, atual) =>
    atual.quantidade > maior.quantidade ? atual : maior,
  ).delimitador;
}
function parseCSV(l, delimitador = ",") {
  const r = [];
  let cur = "",
    q = false;
  for (let i = 0; i < l.length; i++) {
    const c = l[i];
    if (c === '"') {
      q = !q;
    } else if (c === delimitador && !q) {
      r.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  r.push(cur.trim());
  return r;
}
