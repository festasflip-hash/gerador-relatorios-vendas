import {estado, PESOS_INDICADORES} from "./state.js"

export const converterParaFloat = valor =>
  parseFloat((valor||'').toString().replace(',','.'))||0;

export const formatarMoeda = valor =>
  valor.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

export function obterClassePerformance(percentual){
  return percentual>=90?['c-verde','ALTA','tc-verde']:percentual>=50?['c-media','MÉDIA','tc-media']:['c-baixa','BAIXA','tc-baixa'];
}
export function obterCorBadge(percentual){
  return percentual>=90?'b-green':percentual>=50?'b-orange':'b-red';
}
export function obterCorBarra(percentual){
  return percentual>=90?'bg-g':percentual>=50?'bg-o':'bg-r';
}
export function obterCorTexto(percentual){
  return percentual>=90?'c-verde':percentual>=50?'c-media':'c-baixa';
}
export function obterCorHex(percentual){
  return percentual>=90?'#27ae60':percentual>=50?'#e67e22':'#e74c3c';
}
export function gerarHTMLBarra(percentual){
  const w = Math.min(Math.max(percentual,1),100);
  return `<div class="bar-w">
            <div class="bar-bg">
              <div class="bar-f ${barC(percentual)}" style="width:${w}%"></div>
            </div>
              <span class="bp ${txtC(percentual)}">
                ${percentual.toFixed(0)}%
              </span>
          </div>`;
        }
export function gerarPilulaStatus(metaBatida){
  return metaBatida?`
    <span class="status-pill status-ok">✓ Meta Batida</span>`:`<span class="status-pill status-fail">✕ Não Batida</span>`;
}

/* ============ CÁLCULOS AUTOMÁTICOS ============ */
export function calcParcial(representante){
  // NV resultado: (real/metaP)*peso, cap 100%
  const nvPct=f(representante.nvMetaP)>0?Math.min(f(representante.nvReal)/f(representante.nvMetaP)*100,100):0;
  representante.nvRes=(nvPct/100*PESOS.nv).toFixed(2);
  // TM pct e resultado
  const tmPct=f(representante.tmMeta)>0?Math.min(f(representante.tmReal)/f(representante.tmMeta)*100,100):0;
  representante.tmPct=tmPct.toFixed(2);
  // OV resultado
  const ovPct=f(representante.ovMetaP)>0?Math.min(f(representante.ovReal)/f(representante.ovMetaP)*100,100):0;
  representante.ovRes=(ovPct/100*PESOS.ov).toFixed(2);
  // POS resultado
  const posPct=f(representante.posMetaP)>0?Math.min(f(representante.posReal)/f(representante.posMetaP)*100,100):0;
  representante.posRes=(posPct/100*PESOS.pos).toFixed(2);
  // MIX resultado
  const mixPct=f(representante.mixMetaP)>0?Math.min(f(representante.mixReal)/f(representante.mixMetaP)*100,100):0;
  representante.mixRes=(mixPct/100*PESOS.mix).toFixed(2);
}
export function calcFechamento(representante){
  const nvPct=f(representante.nvMeta)>0?Math.min(f(representante.nvReal)/f(representante.nvMeta)*100,100):0;
  representante.nvRes=(nvPct/100*PESOS.nv).toFixed(2);
  const tmPct=f(representante.tmMeta)>0?Math.min(f(representante.tmReal)/f(representante.tmMeta)*100,100):0;
  representante.tmRes=(tmPct/100*PESOS.tm).toFixed(2);
  const ovPct=f(representante.ovMeta)>0?Math.min(f(representante.ovReal)/f(representante.ovMeta)*100,100):0;
  representante.ovRes=(ovPct/100*PESOS.ov).toFixed(2);
  const posPct=f(representante.posMeta)>0?Math.min(f(representante.posReal)/f(representante.posMeta)*100,100):0;
  representante.posRes=(posPct/100*PESOS.pos).toFixed(2);
  const mixPct=f(representante.mixMeta)>0?Math.min(f(representante.mixReal)/f(representante.mixMeta)*100,100):0;
  representante.mixRes=(mixPct/100*PESOS.mix).toFixed(2);
}