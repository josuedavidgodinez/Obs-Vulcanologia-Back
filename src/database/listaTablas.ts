const lista: { [id: string] : string; } = {};
lista['e1ms1'] = 'polls_e1ms1';
lista['ise1'] = 'polls_ise1_infra';
lista['ise2'] = 'polls_ise2_infra';
lista['imagenes'] = 'imagenes_obspy2';
lista['seeds'] = 'archivos_seed2'
export const listaTablas = lista;

const estaciones: { [id: string] : number; } = {};
estaciones['e1ms1'] = 3;
estaciones['ise1'] = 1;
estaciones['ise2'] = 2;
export const listaEstaciones = estaciones;

const lista_imagenes: { [id: string] : string; } = {};
lista_imagenes['e1ms1'] = 'e1ms1';
lista_imagenes['ise1'] = 'ise1';
lista_imagenes['ise2'] = 'ise2';
export const listaImagenes = lista_imagenes;