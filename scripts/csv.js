import { estado } from "./state.js";
import { converterParaFloat } from "./helpers.js";
import { criarTabelaRepresentanteParcial, renderizarTabelaParcial } from "./tabelaParcial.js";
import { criarTabelaRepresentanteFechamento, renderizarTabelaFechamento } from "./tabelaFechamento.js";
import { calcFechamento, calcParcial } from "./helpers.js";

function downloadModelo(){
  let h,ex;
  if(modo==='parcial'){
    h='Nome,Ranking,Perf_Parcial_%,Perf_Mensal_%,NV_MetaP,NV_MetaM,NV_Real,TM_Meta,TM_Real,OV_MetaP,OV_MetaM,OV_Real,POS_MetaP,POS_MetaM,POS_Real,MIX_MetaP,MIX_MetaM,MIX_Real';ex='Carlos Martins / RP,13,77,41,1.43,3,0,3000,2094.53,16666.67,35000,12567.16,5.71,12,6,60,125,64';}
  else{
    h='Nome,Ranking,Perf_Mensal_%,NV_Meta,NV_Real,TM_Meta,TM_Real,OV_Meta,OV_Real,POS_Meta,POS_Real,MIX_Meta,MIX_Real';ex='Carlos Martins / RP,13,41,3,1,3000,2200,35000,15000,12,7,125,70';}
  const blob=new Blob([h+'\n'+ex],{
    type:'text/csv;charset=utf-8;'
});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`modelo_${modo}.csv`;
  a.click();
}
document.getElementById("btn-dnw-csv").addEventListener("click",downloadModelo);

function importCSV(){
    document.getElementById('csvFile').click();
}

function handleCSV(e){
  const file=e.target.files[0];
  
  if(!file)return;
  const r=new FileReader();

  r.onload=ev=>{
    const lines=ev.target.result.split('\n').filter(l=>l.trim());
    
    lines.shift();

    if(modo==='parcial'){
      dadosParcial=[];
      lines.forEach(l=>{
        const c = parseCSV(l);
        if(c[0]){
            const d=criarTabelaRepresentanteParcial({
              nome:c[0],
              ranking:c[1],
              perfParcial:c[2],
              perfMensal:c[3],
              nvMetaP:c[4],
              nvMetaM:c[5],
              nvReal:c[6],
              tmMeta:c[7],
              tmReal:c[8],
              ovMetaP:c[9],
              ovMetaM:c[10],
              ovReal:c[11],
              posMetaP:c[12],
              posMetaM:c[13],
              posReal:c[14],
              mixMetaP:c[15],
              mixMetaM:c[16],
              mixReal:c[17]});
              
              calcParcial(d);
              dadosParcial.push(d);
          }});
      renderizarTabelaParcial();
    }else{
      dadosFechamento=[];
      lines.forEach(l=>{
        const c=parseCSV(l);
        if(c[0]){
            const d=criarTabelaRepresentanteFechamento({nome:c[0],ranking:c[1],perfMensal:c[2],nvMeta:c[3],nvReal:c[4],tmMeta:c[5],tmReal:c[6],ovMeta:c[7],ovReal:c[8],posMeta:c[9],posReal:c[10],mixMeta:c[11],mixReal:c[12]});calcFechamento(d);dadosFechamento.push(d);}});
      renderizarTabelaFechamento();
    }
    alert('✅ Importado e calculado com sucesso!');
  };
  r.readAsText(file);e.target.value='';
}
function parseCSV(l){
    const r=[];
    let cur='',q=false;

    for(let i=0;i<l.length;i++){
        const c=l[i];
        if(c==='"'){
            q=!q;
        }else if(c===','&&!q){
            r.push(cur.trim());
            cur='';
        }else{
            cur+=c;
        }}r.push(cur.trim());
        return r;
    }


