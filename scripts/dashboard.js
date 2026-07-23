import { estado } from "./state.js";
import { converterParaFloat, formatarMoeda, obterClassePerformance, obterCorHex } from "./helpers.js";

export function renderDashboard() {
  const temFechamento = estado.listaRepresentantesFechamento.some(d => d.nome && d.nome.trim());
  const temParcial = estado.listaRepresentantesParcial.some(d => d.nome && d.nome.trim());
  const wrap = document.getElementById("dashWrap");

  if (!temFechamento && !temParcial) {
    wrap.innerHTML = `
    <div class="dash-section">
      <div class="dash-empty">
        <div class="icon">📈</div>
        <p>Preencha a tabela Parcial ou Fechamento para ver o dashboard.</p>
      </div>
    </div>`;
    return;
  }

  const fonte = temFechamento ? "fechamento" : "parcial";
  const dados = (fonte === "fechamento" ? estado.listaRepresentantesFechamento : estado.listaRepresentantesParcial)
    .filter(d => d.nome && d.nome.trim());
  const mes = document.getElementById("mesInput").value;
  const periodo = document.getElementById("periodoInput").value;
  const perfs = dados.map(d => converterParaFloat(d.perfMensal));

  const alta = perfs.filter(p => p >= 90).length;
  const media = perfs.filter(p => p >= 50 && p < 90).length;
  const baixa = perfs.filter(p => p < 50).length;
  const total = dados.length;
  const mediaEq = total > 0 ? perfs.reduce((a, b) => a + b, 0) / total : 0;

  let totalVendido = 0;
  let totalMeta = 0;
  dados.forEach(d => {
    totalVendido += converterParaFloat(d.ovReal);
    totalMeta += fonte === "fechamento"
      ? converterParaFloat(d.ovMeta)
      : converterParaFloat(d.ovMetaM);
  });

  const pctEq = totalMeta > 0 ? (totalVendido / totalMeta) * 100 : 0;

  const indicadores = [
    { key: "ov", label: "Objetivo de Vendas", peso: 60, metaChave: fonte === "fechamento" ? "ovMeta" : "ovMetaM" },
    { key: "pos", label: "Positivação", peso: 15, metaChave: fonte === "fechamento" ? "posMeta" : "posMetaM" },
    { key: "tm", label: "Ticket Médio", peso: 10, metaChave: "tmMeta" },
    { key: "mix", label: "Mix de Vendas", peso: 10, metaChave: fonte === "fechamento" ? "mixMeta" : "mixMetaM" },
    { key: "nv", label: "Novas Vendas", peso: 5, metaChave: fonte === "fechamento" ? "nvMeta" : "nvMetaM" }
  ];

  const gargalos = indicadores
    .map(ind => {
      let soma = 0;
      let contador = 0;
      dados.forEach(d => {
        const meta = converterParaFloat(d[ind.metaChave]);
        const real = converterParaFloat(d[`${ind.key}Real`]);
        if (meta > 0) {
          soma += Math.min((real / meta) * 100, 150);
          contador += 1;
        }
      });
      return {
        ...ind,
        pctMedio: contador > 0 ? soma / contador : 0
      };
    })
    .sort((a, b) => a.pctMedio - b.pctMedio);

  const ranking = [...dados].sort((a, b) => converterParaFloat(b.perfMensal) - converterParaFloat(a.perfMensal));
  const topPerf = ranking.slice(0, 3);

  const semMeta = fonte === "fechamento"
    ? dados.filter(d => {
        const nvOk = converterParaFloat(d.nvReal) >= converterParaFloat(d.nvMeta);
        const tmOk = converterParaFloat(d.tmReal) >= converterParaFloat(d.tmMeta);
        const ovOk = converterParaFloat(d.ovReal) >= converterParaFloat(d.ovMeta);
        const posOk = converterParaFloat(d.posReal) >= converterParaFloat(d.posMeta);
        const mixOk = converterParaFloat(d.mixReal) >= converterParaFloat(d.mixMeta);
        return ![nvOk, tmOk, ovOk, posOk, mixOk].some(Boolean);
      })
    : [];

  const abaixoMedia = dados
    .filter(d => converterParaFloat(d.perfMensal) < mediaEq)
    .sort((a, b) => converterParaFloat(a.perfMensal) - converterParaFloat(b.perfMensal));

  const piorInd = gargalos[0];
  const melhorInd = [...gargalos].sort((a, b) => b.pctMedio - a.pctMedio)[0];

  const narrativas = [];
  if (baixa > 0) {
    narrativas.push({
      c: "#e74c3c",
      t: `${baixa} representante(s) com performance <strong>abaixo de 50%</strong> — ação imediata recomendada.`
    });
  }

  if (semMeta.length > 0) {
    narrativas.push({
      c: "#e74c3c",
      t: `${semMeta.length} representante(s) <strong>sem nenhuma meta batida</strong>: ${semMeta.map(d => d.nome).join(", ")}.`
    });
  }

  if (piorInd && piorInd.pctMedio < 60) {
    narrativas.push({
      c: "#e67e22",
      t: `<strong>${piorInd.label}</strong> é o gargalo coletivo — média da equipe em <strong>${piorInd.pctMedio.toFixed(0)}%</strong>.`
    });
  }

  if (abaixoMedia.length > 0) {
    narrativas.push({
      c: "#e67e22",
      t: `${abaixoMedia.length} representante(s) abaixo da média (${mediaEq.toFixed(0)}%): ${abaixoMedia.slice(0, 5).map(d => `${d.nome} (${converterParaFloat(d.perfMensal)}%)`).join(", ")}${abaixoMedia.length > 5 ? "…" : ""}.`
    });
  }

  const positivas = [];
  if (alta > 0) {
    positivas.push({
      c: "#27ae60",
      t: `${alta} representante(s) em <strong>ALTA performance</strong> (≥90%)${alta === total ? " — 100% da equipe!" : " — referências da equipe"}.`
    });
  }

  if (melhorInd && melhorInd.pctMedio >= 90) {
    positivas.push({
      c: "#27ae60",
      t: `<strong>${melhorInd.label}</strong> é o indicador mais forte — média da equipe em <strong>${melhorInd.pctMedio.toFixed(0)}%</strong>.`
    });
  }

  if (pctEq >= 90) {
    positivas.push({
      c: "#27ae60",
      t: `Equipe atingiu <strong>${pctEq.toFixed(0)}%</strong> do Objetivo de Vendas consolidado.`
    });
  }

  wrap.innerHTML = `
    <div class="dash-grid-top">
      <div class="dash-card">
        <div class="dc-lbl">Representantes</div>
        <div class="dc-val">${total}</div>
        <div class="dc-sub">${mes}</div>
      </div>
      <div class="dash-card">
        <div class="dc-lbl">Performance Média</div>
        <div class="dc-val" style="color:${obterCorHex(mediaEq)}">${mediaEq.toFixed(0)}%</div>
        <div class="dc-sub">${mediaEq >= 90 ? "ALTA" : mediaEq >= 50 ? "MÉDIA" : "BAIXA"} — equipe</div>
      </div>
      <div class="dash-card" style="text-align:left;padding:16px 18px">
        <div class="dc-lbl" style="text-align:center;margin-bottom:10px">Objetivo de Vendas — Equipe</div>
        <div style="display:flex;justify-content:space-between;margin-bottom:5px">
          <span style="font-size:11px;color:#888">Meta consolidada</span>
          <span style="font-weight:700;color:#1a3c6e;font-size:12px">R$ ${formatarMoeda(totalMeta)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:11px;color:#888">Realizado</span>
          <span style="font-weight:700;color:${obterCorHex(pctEq)};font-size:12px">R$ ${formatarMoeda(totalVendido)}</span>
        </div>
        <div style="height:7px;background:#eee;border-radius:10px;overflow:hidden;margin-bottom:6px">
          <div style="height:7px;width:${Math.min(pctEq, 100)}%;background:${obterCorHex(pctEq)};border-radius:10px"></div>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="font-size:11px;font-weight:700;color:${obterCorHex(pctEq)}">${pctEq.toFixed(0)}% atingido</span>
          <span style="font-size:11px;color:#e74c3c">${totalMeta > totalVendido ? "− R$ " + formatarMoeda(totalMeta - totalVendido) : ""}</span>
        </div>
      </div>
      <div class="dash-card">
        <div class="dc-lbl">Fonte dos Dados</div>
        <div class="dc-val" style="font-size:16px">${fonte === "fechamento" ? "Fechamento" : "Parcial"}</div>
        <div class="dc-sub">${periodo}</div>
      </div>
    </div>

    <div class="dash-section">
      <h3>🚨 Pontos de Atenção e Destaques</h3>
      <div class="atencao-cards">
        <div class="atencao-card ${baixa > 0 ? "red" : "green"}">
          <div class="ac-icon">${baixa > 0 ? "🔴" : "✅"}</div>
          <div class="ac-title">Perf. Baixa</div>
          <div class="ac-val">${baixa}</div>
          <div class="ac-desc">${baixa > 0 ? "representante(s) abaixo de 50%" : "Nenhum em baixa performance"}</div>
        </div>
        <div class="atencao-card ${media > 0 ? "orange" : "green"}">
          <div class="ac-icon">${media > 0 ? "🟡" : "✅"}</div>
          <div class="ac-title">Perf. Média</div>
          <div class="ac-val">${media}</div>
          <div class="ac-desc">${media > 0 ? "entre 50–89% — monitorar" : "Nenhum em faixa de atenção"}</div>
        </div>
        ${fonte === "fechamento" ? `
          <div class="atencao-card ${semMeta.length > 0 ? "red" : "green"}">
            <div class="ac-icon">${semMeta.length > 0 ? "🚫" : "✅"}</div>
            <div class="ac-title">Zero Metas</div>
            <div class="ac-val">${semMeta.length}</div>
            <div class="ac-desc">${semMeta.length > 0 ? "sem nenhum indicador atingido" : "Todos bateram ao menos 1"}</div>
          </div>` : ""}
        <div class="atencao-card ${abaixoMedia.length > 0 ? "orange" : "green"}">
          <div class="ac-icon">${abaixoMedia.length > 0 ? "📉" : "📈"}</div>
          <div class="ac-title">Abaixo da Média</div>
          <div class="ac-val">${abaixoMedia.length}</div>
          <div class="ac-desc">${abaixoMedia.length > 0 ? `abaixo de ${mediaEq.toFixed(0)}%` : `Todos acima da média`}</div>
        </div>
        <div class="atencao-card ${piorInd && piorInd.pctMedio < 60 ? "red" : piorInd && piorInd.pctMedio < 90 ? "orange" : "green"}">
          <div class="ac-icon">🎯</div>
          <div class="ac-title">Gargalo</div>
          <div class="ac-val">${piorInd ? piorInd.pctMedio.toFixed(0) : 0}%</div>
          <div class="ac-desc">${piorInd ? piorInd.label : "—"}</div>
        </div>
        <div class="atencao-card green">
          <div class="ac-icon">🏆</div>
          <div class="ac-title">Alta Perf.</div>
          <div class="ac-val">${alta}</div>
          <div class="ac-desc">representante(s) ≥90%</div>
        </div>
      </div>
      <div class="narrativa-box">
        ${narrativas.map(n => `
          <div class="narr-item">
            <div class="narr-dot" style="background:${n.c}"></div>
            <span>${n.t}</span>
          </div>`).join("")}

        ${positivas.map(n => `
          <div class="narr-item">
            <div class="narr-dot" style="background:${n.c}"></div>
            <span>${n.t}</span>
          </div>`).join("")}

        ${!narrativas.length && !positivas.length ?
          `<div class="narr-item"><div class="narr-dot" style="background:#27ae60"></div><span>Sem pontos críticos — equipe dentro da faixa esperada.</span></div>` : ""}
      </div>
    </div>

    <div class="dash-two-col">
      <div class="dash-section">
        <h3>📊 Distribuição Alta / Média / Baixa</h3>
        <div class="dist-bars">
          <div class="dist-row">
            <div class="dist-label" style="color:#27ae60">🟢 Alta</div>
            <div class="dist-track">
              <div class="dist-fill" style="width:${total > 0 ? alta / total * 100 : 0}%;background:linear-gradient(90deg,#27ae60,#2ecc71)">${alta > 0 ? alta : ""}</div>
            </div>
            <div class="dist-count">${alta}/${total}</div>
          </div>
          <div class="dist-row">
            <div class="dist-label" style="color:#e67e22">🟡 Média</div>
            <div class="dist-track">
              <div class="dist-fill" style="width:${total > 0 ? media / total * 100 : 0}%;background:linear-gradient(90deg,#e67e22,#f39c12)">${media > 0 ? media : ""}</div>
            </div>
            <div class="dist-count">${media}/${total}</div>
          </div>
          <div class="dist-row">
            <div class="dist-label" style="color:#e74c3c">🔴 Baixa</div>
            <div class="dist-track">
              <div class="dist-fill" style="width:${total > 0 ? baixa / total * 100 : 0}%;background:linear-gradient(90deg,#c0392b,#e74c3c)">${baixa > 0 ? baixa : ""}</div>
            </div>
            <div class="dist-count">${baixa}/${total}</div>
          </div>
        </div>
        ${semMeta.length > 0 ? `
          <div style="margin-top:16px">
            <p style="font-size:11px;font-weight:700;color:#c0392b;margin-bottom:8px;text-transform:uppercase">🚫 Sem nenhuma meta batida</p>
            <div class="zero-list">${semMeta.map(d => `<div class="zero-item"><div class="zero-dot"></div>${d.nome}</div>`).join("")}</div>
          </div>` : ""}
      </div>
      <div class="dash-section">
        <h3>🎯 Gargalo Coletivo por Indicador</h3>
        <div class="gargalo-list">
          ${gargalos.map((g, i) => `
            <div class="gargalo-item">
              <div class="gargalo-rank" style="background:${i === 0 ? "#e74c3c" : i === 1 ? "#e67e22" : i === 2 ? "#f39c12" : "#27ae60"}">${i + 1}</div>
              <div class="gargalo-info">
                <div class="gi-name">${g.label} <span style="font-size:10px;color:#aaa">peso ${g.peso}pts</span></div>
                <div class="gi-sub">Média de atingimento da equipe</div>
              </div>
              <div class="gargalo-pct" style="color:${obterCorHex(g.pctMedio)}">${g.pctMedio.toFixed(0)}%</div>
            </div>`).join("")}
        </div>
      </div>
    </div>

    <div class="dash-section">
      <h3>🏆 Top Performers</h3>
      <div class="top-list">
        ${topPerf.map((d, i) => {
          const pct = converterParaFloat(d.perfMensal);
          const [cls] = obterClassePerformance(pct);
          return `
            <div class="top-item">
              <div class="ti-pos">${["🥇", "🥈", "🥉"][i]}</div>
              <div class="ti-info">
                <div class="ti-name">${d.nome}</div>
                <div class="ti-sub">${fonte === "fechamento" ? `${[
                  converterParaFloat(d.nvReal) >= converterParaFloat(d.nvMeta),
                  converterParaFloat(d.tmReal) >= converterParaFloat(d.tmMeta),
                  converterParaFloat(d.ovReal) >= converterParaFloat(d.ovMeta),
                  converterParaFloat(d.posReal) >= converterParaFloat(d.posMeta),
                  converterParaFloat(d.mixReal) >= converterParaFloat(d.mixMeta)
                ].filter(Boolean).length}/5 metas batidas · Obj. Vendas: R$ ${formatarMoeda(converterParaFloat(d.ovReal))}` : `Perf. parcial: ${converterParaFloat(d.perfParcial) || "—"}%`} </div>
              </div>
              <div class="ti-pct">${pct}%</div>
            </div>`;
        }).join("")}
      </div>
      <h3 style="margin-bottom:12px">📋 Ranking Completo</h3>
      <table class="rank-table">
        <thead>
          <tr>
            <th style="width:44px">#</th>
            <th>Representante</th>
            <th>Performance Mensal</th>
            <th>Obj. Vendas — Meta</th>
            <th>Obj. Vendas — Realizado</th>
            <th style="text-align:center">% / Faltante</th>
          </tr>
        </thead>
        <tbody>${ranking.map((d, i) => {
          const pct = converterParaFloat(d.perfMensal);
          const [cls, lbl] = obterClassePerformance(pct);
          const med = i === 0 ? "rt-1" : i === 1 ? "rt-2" : i === 2 ? "rt-3" : "rt-x";
          const ovMeta = fonte === "fechamento" ? converterParaFloat(d.ovMeta) : converterParaFloat(d.ovMetaM);
          const ovReal = converterParaFloat(d.ovReal);
          const ovPct = ovMeta > 0 ? (ovReal / ovMeta) * 100 : 0;
          const ovFalta = ovMeta > ovReal ? ovMeta - ovReal : 0;
          return `
            <tr>
              <td><span class="rt-medal ${med}">${i + 1}</span></td>
              <td><strong>${d.nome}</strong>${pct < mediaEq ? `<span style="font-size:10px;color:#e67e22;margin-left:6px">↓ abaixo da média</span>` : ""}</td>
              <td><span class="rt-bar-bg"><span class="rt-bar-f" style="width:${Math.min(pct, 100)}%;background:${obterCorHex(pct)}"></span></span> <span style="font-weight:700;color:${obterCorHex(pct)}">${pct}%</span> <span style="font-size:10px;font-weight:600;margin-left:4px;padding:2px 6px;border-radius:10px;background:${pct >= 90 ? "#eafaf1" : pct >= 50 ? "#fef9e7" : "#fdf2f2"};color:${obterCorHex(pct)}">${lbl}</span></td>
              <td style="font-size:12px;color:#555">R$ ${formatarMoeda(ovMeta)}</td>
              <td style="font-size:12px;font-weight:700;color:${obterCorHex(ovPct)}">R$ ${formatarMoeda(ovReal)}</td>
              <td style="text-align:center">
                <span style="font-weight:800;color:${obterCorHex(ovPct)};font-size:12px">${ovPct.toFixed(0)}%</span>
                ${ovFalta > 0 ? `<br><span style="font-size:10px;color:#e74c3c">− R$ ${formatarMoeda(ovFalta)}</span>` : `<br><span style="font-size:10px;color:#27ae60">✓</span>`}
              </td>
            </tr>`;
        }).join("")}</tbody>
      </table>
    </div>`;
}
