import { estado } from "./state.js";
import { converterParaFloat, calcularResultadosParcial, calcularResultadosFechamento } from "./helpers.js";
import { criarRepresentanteParcial, renderizarTabelaParcial } from "./tabelaParcial.js";
import { criarRepresentanteFechamento, renderizarTabelaFechamento } from "./tabelaFechamento.js";

function baixarModeloCSV() {
  let cabecalho, exemplo;
  if (estado.modoAtivo === "parcial") {
  cabecalho = "Nome,Ranking,Perf_Parcial_%,Perf_Mensal_%,NV_MetaP,NV_MetaM,NV_Real,TM_Meta,TM_Real,OV_MetaP,OV_MetaM,OV_Real,POS_MetaP,POS_MetaM,POS_Real,MIX_MetaP,MIX_MetaM,MIX_Real";
  exemplo = "Carlos Martins / RP,13,77,41,1.43,3,0,3000,2094.53,16666.67,35000,12567.16,5.71,12,6,60,125,64";
  } else {
  cabecalho = "Nome,Ranking,Perf_Mensal_%,NV_Meta,NV_Real,TM_Meta,TM_Real,OV_Meta,OV_Real,POS_Meta,POS_Real,MIX_Meta,MIX_Real";
  exemplo = "Carlos Martins / RP,13,41,3,1,3000,2200,35000,15000,12,7,125,70";
  }

  const blob = new Blob([cabecalho + "\n" + exemplo], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `modelo_${estado.modoAtivo}.csv`;
  a.click();
}

document.getElementById("btn-dnw-csv").addEventListener("click", baixarModeloCSV);

export function abrirSeletorCSV() {
  document.getElementById("csvFile").click();
}

export function processarArquivoCSV(e) {
  const file = e.target.files[0];
  if (!file) return;

  const leitor = new FileReader();
  leitor.onload = ev => {
  const lines = ev.target.result.split("\n").filter(l => l.trim());
    lines.shift();

  if (estado.modoAtivo === "parcial") {
    estado.listaRepresentantesParcial = [];
    lines.forEach(linha => {
      const campos = parsearLinhaCSV(linha);
      if (campos[0]) {
        const representante = criarRepresentanteParcial({
          nome: campos[0],
          ranking: campos[1],
          perfParcial: campos[2],
          perfMensal: campos[3],
          nvMetaP: campos[4],
          nvMetaM: campos[5],
          nvReal: campos[6],
          tmMeta: campos[7],
          tmReal: campos[8],
          ovMetaP: campos[9],
          ovMetaM: campos[10],
          ovReal: campos[11],
          posMetaP: campos[12],
          posMetaM: campos[13],
          posReal: campos[14],
          mixMetaP: campos[15],
          mixMetaM: campos[16],
          mixReal: campos[17]
        });
        calcularResultadosParcial(representante);
        estado.listaRepresentantesParcial.push(representante);
      }
    });
    renderizarTabelaParcial();
  } else {
    estado.listaRepresentantesFechamento = [];
    lines.forEach(linha => {
      const campos = parsearLinhaCSV(linha);
      if (campos[0]) {
        const representante = criarRepresentanteFechamento({
          nome: campos[0],
          ranking: campos[1],
          perfMensal: campos[2],
          nvMeta: campos[3],
          nvReal: campos[4],
          tmMeta: campos[5],
          tmReal: campos[6],
          ovMeta: campos[7],
          ovReal: campos[8],
          posMeta: campos[9],
          posReal: campos[10],
          mixMeta: campos[11],
          mixReal: campos[12]
        });
        calcularResultadosFechamento(representante);
        estado.listaRepresentantesFechamento.push(representante);
      }
    });
    renderizarTabelaFechamento();
  }

  alert("✅ Importado e calculado com sucesso!");
  };

  leitor.readAsText(file);
  e.target.value = "";
}

export function parsearLinhaCSV(linha) {
  const resultado = [];
  let campo = "";
  let entreAspas = false;

  for (let index = 0; index < linha.length; index++) {
  const caractere = linha[index];
  if (caractere === '"') {
    entreAspas = !entreAspas;
  } else if (caractere === "," && !entreAspas) {
    resultado.push(campo.trim());
    campo = "";
  } else {
    campo += caractere;
  }
  }

  resultado.push(campo.trim());
  return resultado;
}

window.handleCSV = processarArquivoCSV;
window.processarArquivoCSV = processarArquivoCSV;
window.abrirSeletorCSV = abrirSeletorCSV;
window.parsearLinhaCSV = parsearLinhaCSV;

