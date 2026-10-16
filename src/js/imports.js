/* ============ CSV ============ */
function downloadModelo() {
  let h, ex;
  if (modo === "parcial") {
    h =
      "Nome,Ranking,Perf_Parcial_%,Perf_Mensal_%,NV_MetaP,NV_MetaM,NV_Real,TM_Meta,TM_Real,OV_MetaP,OV_MetaM,OV_Real,POS_MetaP,POS_MetaM,POS_Real,MIX_MetaP,MIX_MetaM,MIX_Real";
    ex =
      "Carlos Martins / RP,13,77,41,1.43,3,0,3000,2094.53,16666.67,35000,12567.16,5.71,12,6,60,125,64";
  } else {
    h =
      "Nome,Ranking,Perf_Mensal_%,NV_Meta,NV_Real,TM_Meta,TM_Real,OV_Meta,OV_Real,POS_Meta,POS_Real,MIX_Meta,MIX_Real";
    ex = "Carlos Martins / RP,13,41,3,1,3000,2200,35000,15000,12,7,125,70";
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
function parseReportCSV(texto, modoRelatorio) {
  const linhas = texto.split("\n").filter((linha) => linha.trim());
  linhas.shift();
  const dados = [];
  linhas.forEach((linha) => {
    const c = parseCSV(linha);
    if (!c[0]) return;
    if (modoRelatorio === "parcial") {
      const d = novoParcial({
        nome: c[0],
        ranking: c[1],
        perfParcial: c[2],
        perfMensal: c[3],
        nvMetaP: c[4],
        nvMetaM: c[5],
        nvReal: c[6],
        tmMeta: c[7],
        tmReal: c[8],
        ovMetaP: c[9],
        ovMetaM: c[10],
        ovReal: c[11],
        posMetaP: c[12],
        posMetaM: c[13],
        posReal: c[14],
        mixMetaP: c[15],
        mixMetaM: c[16],
        mixReal: c[17],
      });
      calcParcial(d);
      dados.push(d);
    } else {
      const d = novoFechamento({
        nome: c[0],
        ranking: c[1],
        perfMensal: c[2],
        nvMeta: c[3],
        nvReal: c[4],
        tmMeta: c[5],
        tmReal: c[6],
        ovMeta: c[7],
        ovReal: c[8],
        posMeta: c[9],
        posReal: c[10],
        mixMeta: c[11],
        mixReal: c[12],
      });
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
    dadosMesAnterior = parseReportCSV(ev.target.result, "fechamento");
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
  atualizarStatusHistorico();
  if (modo === "dashboard") renderDashboard();
}
function parseCSV(l) {
  const r = [];
  let cur = "",
    q = false;
  for (let i = 0; i < l.length; i++) {
    const c = l[i];
    if (c === '"') {
      q = !q;
    } else if (c === "," && !q) {
      r.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  r.push(cur.trim());
  return r;
}
