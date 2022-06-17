import {ITEM_ALL, MultiSelectFilter} from 'ui/shared/MultiSelectFilter';
import {TFilters, TFiltreProps, TValueToBoundary} from './filters';

export const SCORE_REALISE = 'score_realise';

export const percentItems = [
  {value: ITEM_ALL, label: 'Tous'},
  {value: '0', label: '0 à 34 %'},
  {value: '35', label: '35 à 49 %'},
  {value: '50', label: '50 à 64 %'},
  {value: '65', label: '65 à 74 %'},
  {value: '75', label: '75 à 100 %'},
];
export const percentBoundaries: TValueToBoundary = {
  '0': {lower: 0, upper: 0.35, include: 'lower'},
  '35': {lower: 0.35, upper: 0.5, include: 'lower'},
  '50': {lower: 0.5, upper: 0.65, include: 'lower'},
  '65': {lower: 0.65, upper: 0.75, include: 'lower'},
  '75': {lower: 0.75, upper: 1, include: 'both'},
};

export const makeFiltrePourcentage =
  (filterKey: string, label: string) => (props: TFiltreProps) => {
    const {className, filters, setFilters} = props;

    return (
      <MultiSelectFilter
        className={`${filterKey} ${className || ''}`}
        label={label}
        values={filters[filterKey as keyof TFilters]}
        items={percentItems}
        onChange={newValues => setFilters({...filters, [filterKey]: newValues})}
      />
    );
  };