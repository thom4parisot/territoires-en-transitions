export const LocalSelectors = {
  'filtre par région': {
    selector: '[data-test=Région]',
    options: {
      Auvergne: '.MuiPopover-root [role=option][data-value=84]',
      Bretagne: '.MuiPopover-root [role=option][data-value=53]',
    },
  },
  'filtre par niveau de labellisation': {
    selector: '[data-test=nx]',
    options: {
      'non labellisé': 'label[for=nx0]',
      '1ère étoile': 'label[for=nx1]',
    },
  },
  'bouton Désactiver tous les filtres': {
    selector: '[data-test=clear-filters]',
  },
};
