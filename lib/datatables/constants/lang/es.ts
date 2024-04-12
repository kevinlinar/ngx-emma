import { DTLanguage } from '../../types/dt-language';

export const DTLangEs: DTLanguage = {
  processing: 'Procesando...',
  search: '',
  searchPlaceholder: 'Buscar',
  lengthMenu: '_MENU_ ',
  info: 'Mostrando desde _START_ al _END_ de _TOTAL_ elementos',
  infoEmpty: 'Mostrando ningún elemento.',
  infoFiltered: '(filtrado _MAX_ elementos total)',
  infoPostFix: '',
  loadingRecords: 'Cargando registros...',
  zeroRecords: 'No se encontraron registros',
  emptyTable: 'No hay datos disponibles en la tabla',
  paginate: {
    first: 'Primero',
    previous: '<i class="fa-solid fa-chevron-left"></i>',
    next: '<i class="fa-solid fa-chevron-right"></i>',
    last: 'Último',
  },
  aria: {
    sortAscending: ': Activar para ordenar la tabla en orden ascendente',
    sortDescending: ': Activar para ordenar la tabla en orden descendente',
  },
  select: {
    rows: {
      _: ' %d filas seleccionadas',
      0: '',
      1: ' %d fila seleccionada',
    },
  },
};
