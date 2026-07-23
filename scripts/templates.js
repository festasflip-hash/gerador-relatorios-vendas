import { estado } from "./state.js";
import { criarRepresentanteParcial, renderizarTabelaParcial } from "./tabelaParcial.js";
import { criarRepresentanteFechamento, renderizarTabelaFechamento } from "./tabelaFechamento.js";

export function getPrintPage(html, nome, css) {
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Relatório Individual - ${nome}</title>
      <style>${css}</style>
    </head>
    <body>${html}</body>
  </html>`;
}

const CHAVE_STORAGE_TEMPLATES = 'relatorios_templates_v1';

function getTemplates() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_STORAGE_TEMPLATES) || '[]');
  } catch (error) {
    return [];
  }
}

function saveTemplates(templates) {
  localStorage.setItem(CHAVE_STORAGE_TEMPLATES, JSON.stringify(templates));
}

export function salvarMetasComoTemplate() {
  const nome = window.obterValorCampo('e_nome') || 'Sem nome';
  const templates = getTemplates();
  const tpl = { id: Date.now(), nome, modo: estado.modoEdicaoAtivo, metas: {} };

  if (estado.modoEdicaoAtivo === 'parcial') {
    tpl.metas = {
      nvMetaP: window.obterValorCampo('e_nvMetaP'),
      nvMetaM: window.obterValorCampo('e_nvMetaM'),
      tmMeta: window.obterValorCampo('e_tmMeta'),
      ovMetaP: window.obterValorCampo('e_ovMetaP'),
      ovMetaM: window.obterValorCampo('e_ovMetaM'),
      posMetaP: window.obterValorCampo('e_posMetaP'),
      posMetaM: window.obterValorCampo('e_posMetaM'),
      mixMetaP: window.obterValorCampo('e_mixMetaP'),
      mixMetaM: window.obterValorCampo('e_mixMetaM')
    };
  } else {
    tpl.metas = {
      nvMeta: window.obterValorCampo('e_nvMeta'),
      tmMeta: window.obterValorCampo('e_tmMeta'),
      ovMeta: window.obterValorCampo('e_ovMeta'),
      posMeta: window.obterValorCampo('e_posMeta'),
      mixMeta: window.obterValorCampo('e_mixMeta')
    };
  }

  const existe = templates.findIndex(item => item.nome === nome && item.modo === estado.modoEdicaoAtivo);
  if (existe >= 0) {
    if (!confirm(`Template "${nome}" já existe. Sobrescrever?`)) return;
    templates[existe] = tpl;
  } else {
    templates.push(tpl);
  }

  saveTemplates(templates);
  alert(`✅ Template "${nome}" salvo com sucesso!`);
}

export function abrirGerenciadorTemplates() {
  renderizarListaTemplates();
  document.getElementById('tplOverlay').classList.add('active');
}

export function renderizarListaTemplates() {
  const templates = getTemplates().filter(template => template.modo === estado.modoAtivo || estado.modoAtivo === 'dashboard');
  const body = document.getElementById('tplBody');

  if (!templates.length) {
    body.innerHTML = `
      <p style="color:#aaa;font-size:12px;text-align:center;padding:20px">Nenhum template salvo para o modo ${estado.modoAtivo}.<br>Edite um representante e clique em "Salvar Metas como Template".</p>
      <div class="tpl-actions-row">
        <button class="btn btn-csv" onclick="document.getElementById('jsonFile').click()">📂 Importar JSON</button>
        <button class="btn btn-tpl" onclick="exportarTemplatesJSON()">⬇ Exportar JSON</button>
      </div>`;
    return;
  }

  body.innerHTML = `
    <div class="tpl-list">
      ${templates.map(template => `
        <div class="tpl-item">
          <div>
            <div class="ti-name">${template.nome}</div>
            <div class="ti-sub">${template.modo === 'parcial' ? 'Parcial' : 'Fechamento'} · ${Object.keys(template.metas).length} campos de meta</div>
          </div>
          <button class="btn btn-add" onclick="aplicarTemplateNaTabela(${template.id})" style="padding:5px 10px;font-size:11px">+ Aplicar</button>
          <button class="del-btn" onclick="removerTemplate(${template.id})" style="font-size:11px">✕</button>
        </div>`).join('')}
    </div>
    <div class="tpl-actions-row">
      <button class="btn btn-csv" onclick="document.getElementById('jsonFile').click()">📂 Importar JSON</button>
      <button class="btn btn-tpl" onclick="exportarTemplatesJSON()">⬇ Exportar JSON</button>
      <button class="btn btn-clear" onclick="if(confirm('Apagar todos os templates?')){localStorage.removeItem('${CHAVE_STORAGE_TEMPLATES}');renderizarListaTemplates()}">🗑 Apagar Todos</button>
    </div>`;
}

export function aplicarTemplateNaTabela(idTemplate) {
  const template = getTemplates().find(item => item.id === idTemplate);
  if (!template) return;

  if (template.modo === 'parcial') {
    estado.listaRepresentantesParcial.push(criarRepresentanteParcial({ nome: template.nome, ...template.metas }));
    renderizarTabelaParcial();
  } else {
    estado.listaRepresentantesFechamento.push(criarRepresentanteFechamento({ nome: template.nome, ...template.metas }));
    renderizarTabelaFechamento();
  }

  fecharModalTemplates();
  alert(`✅ Template "${template.nome}" aplicado! Preencha os realizados na linha adicionada.`);
}

export function removerTemplate(idTemplate) {
  if (!confirm('Remover este template?')) return;
  saveTemplates(getTemplates().filter(template => template.id !== idTemplate));
  renderizarListaTemplates();
}

export function exportarTemplatesJSON() {
  const templates = getTemplates();
  if (!templates.length) {
    alert('Nenhum template para exportar.');
    return;
  }
  const blob = new Blob([JSON.stringify(templates, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'templates_relatorios.json';
  a.click();
}

export function processarArquivoJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const leitor = new FileReader();

  leitor.onload = ev => {
    try {
      const imported = JSON.parse(ev.target.result);
      if (!Array.isArray(imported)) throw new Error();
      const existing = getTemplates();
      let added = 0;
      imported.forEach(template => {
        if (template.id && template.nome && template.metas) {
          if (!existing.find(item => item.id === template.id)) {
            existing.push(template);
            added++;
          }
        }
      });
      saveTemplates(existing);
      alert(`✅ ${added} template(s) importado(s)!`);
      renderizarListaTemplates();
    } catch (error) {
      alert('Arquivo JSON inválido.');
    }
  };

  leitor.readAsText(file);
  e.target.value = '';
}

export function fecharModalTemplates() {
  document.getElementById('tplOverlay').classList.remove('active');
}

export function fecharModalTemplatesAoClicarFora(evento) {
  if (evento.target === document.getElementById('tplOverlay')) {
    fecharModalTemplates();
  }
}

window.abrirGerenciadorTemplates = abrirGerenciadorTemplates;
window.renderizarListaTemplates = renderizarListaTemplates;
window.aplicarTemplateNaTabela = aplicarTemplateNaTabela;
window.removerTemplate = removerTemplate;
window.exportarTemplatesJSON = exportarTemplatesJSON;
window.processarArquivoJSON = processarArquivoJSON;
window.fecharModalTemplates = fecharModalTemplates;
window.fecharModalTemplatesAoClicarFora = fecharModalTemplatesAoClicarFora;
window.salvarMetasComoTemplate = salvarMetasComoTemplate;
