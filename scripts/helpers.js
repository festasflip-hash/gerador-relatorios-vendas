const f=v=>parseFloat((v||'').toString().replace(',','.'))||0;

const fmt=v=>v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

function perfClass(p){
  return p>=90?['c-verde','ALTA','tc-verde']:p>=50?['c-media','MÉDIA','tc-media']:['c-baixa','BAIXA','tc-baixa'];
}
function badgeC(p){
  return p>=90?'b-green':p>=50?'b-orange':'b-red';
}
function barC(p){
  return p>=90?'bg-g':p>=50?'bg-o':'bg-r';
}
function txtC(p){
  return p>=90?'c-verde':p>=50?'c-media':'c-baixa';
}
function colorHex(p){
  return p>=90?'#27ae60':p>=50?'#e67e22':'#e74c3c';
}
function barHTML(p){
  const w=Math.min(Math.max(p,1),100);
  return `<div class="bar-w">
            <div class="bar-bg">
              <div class="bar-f ${barC(p)}" style="width:${w}%"></div>
            </div>
              <span class="bp ${txtC(p)}">
                ${p.toFixed(0)}%
              </span>
          </div>`;
        }
function statusPill(ok){
  return ok?`<span class="status-pill status-ok">✓ Meta Batida</span>`:`<span class="status-pill status-fail">✕ Não Batida</span>`;
}

/* ============ CÁLCULOS AUTOMÁTICOS ============ */
function calcParcial(d){
  // NV resultado: (real/metaP)*peso, cap 100%
  const nvPct=f(d.nvMetaP)>0?Math.min(f(d.nvReal)/f(d.nvMetaP)*100,100):0;
  d.nvRes=(nvPct/100*PESOS.nv).toFixed(2);
  // TM pct e resultado
  const tmPct=f(d.tmMeta)>0?Math.min(f(d.tmReal)/f(d.tmMeta)*100,100):0;
  d.tmPct=tmPct.toFixed(2);
  // OV resultado
  const ovPct=f(d.ovMetaP)>0?Math.min(f(d.ovReal)/f(d.ovMetaP)*100,100):0;
  d.ovRes=(ovPct/100*PESOS.ov).toFixed(2);
  // POS resultado
  const posPct=f(d.posMetaP)>0?Math.min(f(d.posReal)/f(d.posMetaP)*100,100):0;
  d.posRes=(posPct/100*PESOS.pos).toFixed(2);
  // MIX resultado
  const mixPct=f(d.mixMetaP)>0?Math.min(f(d.mixReal)/f(d.mixMetaP)*100,100):0;
  d.mixRes=(mixPct/100*PESOS.mix).toFixed(2);
}
function calcFechamento(d){
  const nvPct=f(d.nvMeta)>0?Math.min(f(d.nvReal)/f(d.nvMeta)*100,100):0;
  d.nvRes=(nvPct/100*PESOS.nv).toFixed(2);
  const tmPct=f(d.tmMeta)>0?Math.min(f(d.tmReal)/f(d.tmMeta)*100,100):0;
  d.tmRes=(tmPct/100*PESOS.tm).toFixed(2);
  const ovPct=f(d.ovMeta)>0?Math.min(f(d.ovReal)/f(d.ovMeta)*100,100):0;
  d.ovRes=(ovPct/100*PESOS.ov).toFixed(2);
  const posPct=f(d.posMeta)>0?Math.min(f(d.posReal)/f(d.posMeta)*100,100):0;
  d.posRes=(posPct/100*PESOS.pos).toFixed(2);
  const mixPct=f(d.mixMeta)>0?Math.min(f(d.mixReal)/f(d.mixMeta)*100,100):0;
  d.mixRes=(mixPct/100*PESOS.mix).toFixed(2);
}