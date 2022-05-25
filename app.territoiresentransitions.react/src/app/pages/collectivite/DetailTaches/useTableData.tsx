import {useCallback, useMemo, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {TableOptions} from 'react-table';
import {useCollectiviteId, useReferentielId} from 'core-logic/hooks/params';
import {
  fetchActionStatutsList,
  getTotalTachesCount,
  TacheDetail,
  updateTacheStatut,
} from './queries';

export type UseTableData = () => TableData;

export type TableData = {
  /** données à passer à useTable */
  table: Pick<
    TableOptions<TacheDetail>,
    'data' | 'getRowId' | 'getSubRows' | 'autoResetExpanded'
  >;
  /** Indique que le chargement des données est en cours */
  isLoading: boolean;
  /** Indique que le changement de statut est en cours */
  isSaving: boolean;
  /** filtres actifs */
  filters: string[];
  /** Nombre de lignes après filtrage */
  count: number;
  /** Nombre total de lignes */
  total: number;
  /** pour remettre à jour les filtres */
  setFilters: (filters: string[]) => void;
  /** pour changer le statut d'une tâche */
  updateStatut: (action_id: string, value: string) => void;
};

/**
 * Memoïze et renvoi les données et paramètres de la table
 */
export const useTableData: UseTableData = () => {
  const collectivite_id = useCollectiviteId();
  const referentiel = useReferentielId();
  const queryClient = useQueryClient();

  // filtre initial
  const [filters, setFilters] = useState(['non_renseigne']);

  // chargement des données
  const {data, isLoading} = useQuery(
    ['action_statuts', collectivite_id, referentiel, ...filters],
    () => fetchActionStatutsList(collectivite_id, referentiel, filters)
  );
  const {rows, count} = data || {};

  // charge le nombre total de tâches du référentiel
  const {data: total} = useQuery(['action_statuts', referentiel], () =>
    getTotalTachesCount(referentiel)
  );

  // met à jour un statut
  const {mutate, isLoading: isSaving} = useMutation(updateTacheStatut);
  const updateStatut = (action_id: string, avancement: string) => {
    if (collectivite_id && !isSaving) {
      mutate(
        {collectivite_id, action_id, avancement},
        {
          onSuccess: () => {
            queryClient.invalidateQueries('action_statuts');
          },
        }
      );
    }
  };

  // extrait les lignes de 1er niveau
  const firstLevel = useMemo(
    () => rows?.filter(({depth}) => depth === 1) || [],
    [rows]
  );

  // renvoi l'id d'une ligne
  const getRowId = useCallback((row: TacheDetail) => row.identifiant, []);

  // renvoi les sous-lignes d'une ligne
  const getSubRows = useCallback(
    (parentRow: TacheDetail) =>
      rows && parentRow.have_children
        ? rows?.filter(
            ({identifiant, depth}) =>
              depth === parentRow.depth + 1 &&
              identifiant.startsWith(parentRow.identifiant)
          )
        : [],
    [rows]
  );

  return {
    table: {
      data: firstLevel,
      getRowId,
      getSubRows,
    },
    filters,
    setFilters,
    isLoading,
    isSaving,
    count: count || 0,
    total: total || 0,
    updateStatut,
  };
};