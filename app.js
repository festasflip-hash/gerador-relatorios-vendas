import {PrintCSS} from "./scripts/printCSS.js";
import { criarTabelaRepresentanteFechamento, renderizarTabelaFechamento } from "./scripts/tabelaFechamento.js";
import { criarTabelaRepresentanteParcial, renderizarTabelaParcial } from "./scripts/tabelaParcial.js";
import {getPrintPage} from "./scripts/templates.js";
import { estado,PESOS_INDICADORES } from "./scripts/state.js";



/* ============ TABS ============ */


function alternarAba(modoSelecionado){
  estado.modoAtivo = modoSelecionado;
  ['parcial','fechamento','dashboard'].forEach(t=>{
    document.getElementById('tab'+t.charAt(0).toUpperCase()+t.slice(1)).classList.toggle('active',estado.estado.modoAtivoAtivo===t);
  });
  document.getElementById('tableWrapParcial').classList.toggle('hidden',estado.modoAtivo!=='parcial');
  document.getElementById('tableWrapFechamento').classList.toggle('hidden',modo!=='fechamento');
  document.getElementById('dashWrap').classList.toggle('hidden',modo!=='dashboard');
  document.getElementById('controlsBar').classList.toggle('hidden',modo==='dashboard');
  document.getElementById('legendBar').classList.toggle('hidden',modo==='dashboard');
  document.getElementById('resultsSection').style.display='none';

  const subs={
    parcial:'Modo: Acompanhamento Parcial',fechamento:'Modo: Fechamento do Mês',dashboard:'Modo: Dashboard Consolidado'
  };
    document.getElementById('topbarSub').textContent=subs[modo];
  if(modo!=='dashboard'){
    document.getElementById('ctrlTitle').textContent=modo==='parcial'?'Representantes — Parcial':'Representantes — Fechamento';
    document.getElementById('lblPeriodo').textContent=modo==='parcial'?'Período Parcial':'Período do Fechamento';
    document.getElementById('legendaExtra').textContent=modo==='fechamento'?'Status: Meta Batida / Não Batida':'';
  } else { 
    renderDashboard(); 
  }
}



/* ============ ADD / CLEAR ============ */
function addRow(){
  if(modo==='parcial'){
    dadosParcial.push(criarTabelaRepresentanteParcial());
    renderizarTabelaParcial();
  }
  else if(modo==='fechamento'){
    dadosFechamento.push(criarTabelaRepresentanteFechamento());
    renderizarTabelaFechamento();
  }
}
document.getElementById("btn-add").addEventListener("click",addRow);

function clearAll(){
  if(modo==='dashboard')
    return;
  if(!confirm('Limpar todos os dados?'))
    return;
  if(modo==='parcial'){
    dadosParcial=[];
    renderizarTabelaParcial();
  }
  else{
    dadosFechamento=[];
    renderizarTabelaFechamento();
  }
  document.getElementById('resultsSection').style.display='none';
}
document.getElementById("btn-clear").addEventListener("click",clearAll);



/* ============ AÇÕES AUTOMÁTICAS ============ */
function acoesAuto(d){
  const itens=[];
  const ovFalta=f(d.ovMeta)-f(d.ovReal);
    if(ovFalta>0){
      const pct=(f(d.ovReal)/f(d.ovMeta)*100).toFixed(0);
      itens.push({
        c:'d-r',
        t:`<strong>Prioridade máxima:</strong> 
        faturar mais <strong>R$ ${fmt(ovFalta)}</strong> para fechar Objetivo de Vendas (${pct}%) — maior peso (60 pts).`
        });}
  const posFalta=f(d.posMeta)-f(d.posReal);
    if(posFalta>0)itens.push({
      c:'d-o',
      t:`Positivar mais <strong>
      ${posFalta.toFixed(0)} clientes</strong> para atingir a meta de ${d.posMeta}.`
    });
  const tmFalta=f(d.tmMeta)-f(d.tmReal);
    if(tmFalta>0)itens.push({
      c:'d-o',
      t:`Elevar Ticket Médio em <strong> R$ ${fmt(tmFalta)}</strong>, de R$ ${fmt(f(d.tmReal))} para R$ ${fmt(f(d.tmMeta))}.`
    });
  const mixFalta=f(d.mixMeta)-f(d.mixReal);
    if(mixFalta>0)itens.push({
      c:'d-o',
      t:`Ampliar Mix de Vendas em mais <strong>${mixFalta.toFixed(0)} SKUs</strong>.`
    });
  const nvFalta=f(d.nvMeta)-f(d.nvReal);
    if(nvFalta>0)itens.push({
      c:f(d.nvReal)===0?'d-r':'d-o',
      t:`Realizar mais <strong>${nvFalta.toFixed(0)} novas vendas</strong> para atingir a meta de ${d.nvMeta}.`
    });
  if(!itens.length)itens.push({
    c:'d-g',
    t:`Todas as metas batidas — <strong>manter o ritmo e consolidar os resultados</strong> no próximo período.`
  });
  return itens.map(i=>`
    <div class="pi">
      <div class="pdot ${i.c}"></div>
      <span>${i.t}</span>
    </div>`).join('');
}
function priorParcial(d){
  const itens=[];
  const nvFalta=f(d.nvMetaM)-f(d.nvReal);
    if(f(d.nvReal)===0)itens.push({
      c:'d-r',
      t:`Realizar <strong>${nvFalta.toFixed(0)} novas vendas</strong> — zerado até agora.`});
      else if(nvFalta>0)itens.push({
        c:'d-o',
        t:`Realizar mais <strong>${nvFalta.toFixed(0)} novas vendas</strong> para atingir meta mensal.`
      });
  const ovFalta=f(d.ovMetaM)-f(d.ovReal);
    if(ovFalta>0){
      const pct=(f(d.ovReal)/f(d.ovMetaM)*100).toFixed(0);
      itens.push({
        c:pct<50?'d-r':'d-o',
        t:`Faturar mais <strong>R$ ${fmt(ovFalta)}</strong> para fechar Objetivo de Vendas (${pct}%).`
      });
    }
  const posFalta=f(d.posMetaM)-f(d.posReal);
    if(posFalta>0)itens.push({
      c:'d-o',
      t:`Positivar mais <strong>${posFalta.toFixed(0)} clientes</strong>.`
    });
  const mixFalta=f(d.mixMetaM)-f(d.mixReal);
    if(mixFalta>0)itens.push({
      c:'d-o',
      t:`Ampliar Mix em mais <strong>${mixFalta.toFixed(0)} SKUs</strong>.`
    });
  const tmFalta=f(d.tmMeta)-f(d.tmReal);
    if(tmFalta>0)itens.push({
      c:'d-o',
      t:`Elevar Ticket Médio de <strong>R$ ${fmt(f(d.tmReal))}</strong> para <strong>R$ ${fmt(f(d.tmMeta))}</strong>.`
    });
  if(!itens.length)itens.push({
    c:'d-g',
    t:`Todos os indicadores mensais atingidos — <strong>excelente performance!</strong>`
  });
  return itens.map(i=>`
    <div class="pi">
      <div class="pdot ${i.c}"></div>
      <span>${i.t}</span>
    </div>`).join('');
}


/* ============ GERAR / VISUALIZAR ============ */
function gerarTodos(){
  if(modo==='dashboard')return;

  const dados=modo==='parcial'?dadosParcial:dadosFechamento;

  const validos=dados.filter(d=>d.nome&&d.nome.trim());

  if(!validos.length){alert('Adicione ao menos um representante com nome!');return;}

  const list=document.getElementById('repList');

  list.innerHTML='';

  validos.forEach((d,i)=>{
    const pm=f(d.perfMensal),pp=modo==='parcial'?f(d.perfParcial):null;
    const [pmCls,pmLbl,pmTc]=perfClass(pm);
    const div=document.createElement('div');div.className='rep-card-mini';

    let p2=modo==='parcial'
      ?`<div class="rcm-pi ${perfClass(pp)[2]}"><div class="pl">Parcial</div><div class="pv ${perfClass(pp)[0]}">${pp}%</div><div class="ps ${perfClass(pp)[0]}">${perfClass(pp)[1]}</div></div>`
      :(()=>{
        const nvOk=f(d.nvReal)>=f(d.nvMeta),
        tmOk=f(d.tmReal)>=f(d.tmMeta),
        ovOk=f(d.ovReal)>=f(d.ovMeta),
        posOk=f(d.posReal)>=f(d.posMeta),
        mixOk=f(d.mixReal)>=f(d.mixMeta);
        const bat=[nvOk,tmOk,ovOk,posOk,mixOk].filter(Boolean).length;
        const tc=bat===5?'tc-verde':bat===0?'tc-baixa':'tc-media';
        const vc=bat===5?'c-verde':bat===0?'c-baixa':'c-media';
        
        return `
          <div class="rcm-pi ${tc}">
            <div class="pl">Metas</div>
            <div class="pv ${vc}">${bat}/5</div>
            <div class="ps">batidas</div>
          </div>`;
        })();

    const idx=dados.indexOf(d);
    div.innerHTML=`
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
        <button class="btn-view" onclick="verRel(${idx})">👁 Ver</button>
        <button class="btn-print" onclick="imprimirRel(${idx})">🖨️ PDF</button>
      </div>
    </div>`;
    list.appendChild(div);
  });
  document.getElementById('resultsSection').style.display='block';
  document.getElementById('resultsTitle').textContent=`${validos.length} relatório(s) gerado(s)`;
  document.getElementById('btnPrintAll').style.display='block';
  document.getElementById('btnZipAll').style.display=modo==='fechamento'?'block':'none';
  document.getElementById('resultsSection').scrollIntoView({behavior:'smooth'});
}
//Vincular a função ao evento diretamente
document.getElementById("btn-gerar").addEventListener("click", gerarTodos);


function verRel(i){
  const dados=modo==='parcial'?dadosParcial:dadosFechamento;
  const html=gerarRelatorio(dados[i]);
  relAtual=html;relAtualNome=dados[i].nome;
  document.getElementById('modalTitle').textContent=`Relatório — ${dados[i].nome}`;
  document.getElementById('modalContent').innerHTML=html;
  document.getElementById('modalOverlay').classList.add('active');
}
function fecharModal(){document.getElementById('modalOverlay').classList.remove('active');}
function closeModal(e){if(e.target===document.getElementById('modalOverlay'))fecharModal();}


async function printHTML(html,nome){
 
  const win=window.open('','_blank');

  win.document.write(getPrintPage(html,nome,PrintCSS));

          win.document.close();
          setTimeout(()=>{
            win.focus();
            win.print();
          },600);
    }

function imprimirAtual(){
  if(relAtual)printHTML(relAtual,relAtualNome||'Relatorio');}
function imprimirRel(i){
  const d=(modo==='parcial'?dadosParcial:dadosFechamento)[i];
  printHTML(gerarRelatorio(d),d.nome);
}
function imprimirTodos(){
  const dados=modo==='parcial'?dadosParcial:dadosFechamento;
  let h='';
  dados.filter(d=>d.nome).forEach((d,i)=>{
    h+=gerarRelatorio(d)+(i<dados.length-1?'<div style="page-break-after:always"></div>':'');
  });
  printHTML(h,'Relatorios_Lote');
}

/* ============ ZIP ============ */
async function baixarZip(){
  if(modo!=='fechamento')return;
  const zip=new JSZip();
  const mes=document.getElementById('mesInput').value;
  dadosFechamento.filter(d=>d.nome&&d.nome.trim()).forEach(d=>{
    const nome=`Relatório Individual - ${d.nome.replace(/[\/\\:*?"<>|]/g,'_')}`;
    zip.file(`${nome}.html`,`
      <!DOCTYPE html>
        <html lang="pt-BR">
          <head>
            <meta charset="UTF-8">
              <title>${nome}</title>
              <style>${printCSS}</style>
          </head>
          <body>${relFechamento(d)}</body>
        </html>`);
  });
  const blob=await zip.generateAsync({type:'blob'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`Relatorios_Fechamento_${mes.replace(/ /g,'_')}.zip`;
  a.click();
}

/* ============ DASHBOARD ============ */

// Inicializar com 3 linhas
dadosParcial.push(criarTabelaRepresentanteParcial());
dadosParcial.push(criarTabelaRepresentanteParcial());
dadosParcial.push(criarTabelaRepresentanteParcial());
renderizarTabelaParcial();
