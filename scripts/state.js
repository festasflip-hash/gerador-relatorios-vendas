//Modulo de Estado Centralizado
//Todos os componentes exportam daqui

export const estado = {
    modoAtivo = 'parcial',
    listaRepresentantesParcial: [],
    listaRepresentantesFechamento:[],
    htmlRelatorioAtivo: null,
    nomeRelatorioAtivo: null,
    indiceEdicaoAtivo: -1,
    modoEdicaoAtivo: 'parcial',

};

export const PESOS_INDICADORES = {
    nv: 5,
    tm: 10,
    ov: 60,
    pos: 15,
    mix: 10
};