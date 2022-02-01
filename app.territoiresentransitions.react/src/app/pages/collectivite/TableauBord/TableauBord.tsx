import {makeCollectiviteReferentielUrl} from 'app/paths';
import {actionAvancementColors} from 'app/theme';
import {indicateurResultatRepository} from 'core-logic/api/repositories/AnyIndicateurRepository';
import {useAllIndicateurDefinitionsForGroup} from 'core-logic/hooks/indicateur_definition';
import {useCollectiviteId} from 'core-logic/hooks/params';
import {scoreBloc, ScoreBloc} from 'core-logic/observables/scoreBloc';
import {actions} from 'generated/data/referentiels';
import {observer} from 'mobx-react-lite';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ActionScore} from 'types/ClientScore';
import {AxisAvancementSample} from 'ui/charts/chartTypes';
import {DoughnutWithNumber} from 'ui/charts/DoughnutWithNumber';
import {ReferentielAxisAvancementStackedBar} from 'ui/charts/ReferentielAxisAvancementStackedBar';
import {ReferentielAxisScoresPolarArea} from 'ui/charts/ReferentielAxisScoresPolarArea';
import {Spacer} from 'ui/shared/Spacer';
import {refToEmoji} from 'utils/refToEmoji';
import {toFixed} from 'utils/toFixed';

const remplissageColor = '#2F4077';

const axisLabels: Record<string, string[][]> = {
  eci_1: [['1. Stratégie globale']],
  eci_2: [
    ['2. Services de'],
    ['réduction, collecte et'],
    ['valorisation des déchets'],
  ],
  eci_3: [['3. Autres piliers'], ["de l'économie circulaire"]],
  eci_4: [['4. Outils financiers'], ['du changement'], ['de comportement']],
  eci_5: [['5. Coopération'], ['et engagement']],
  cae_1: [['1. Plannification'], ['territoriale']],
  cae_2: [['2. Patrimoine de la'], ['collectivité']],
  cae_3: [['3. Approvisionnement, '], ['énergie, eau, '], ['assainissement']],
  cae_4: [['4. Mobilité']],
  cae_5: [['5. Organisation'], ['interne']],
  cae_6: [['6. Coopération, '], ['communication']],
};

const useIndicateurCounts = (
  indicateurGroup: 'eci' | 'cae',
  collectiviteId: number
) => {
  const [countIndicateurWithValue, setCountIndicateurWithValue] = useState(0);
  useEffect(() => {});
  const indicateurs = useAllIndicateurDefinitionsForGroup(indicateurGroup);

  useEffect(() => {
    Promise.all(
      indicateurs.map(indicateur =>
        indicateurResultatRepository.fetchIndicateurValuesForId({
          collectiviteId,
          indicateurId: indicateur.id,
        })
      )
    ).then(indicateursValues => {
      const countIndicateurWithValue = indicateursValues.filter(
        indicateurValues => {
          return indicateurValues.length > 0;
        }
      );
      setCountIndicateurWithValue(countIndicateurWithValue.length);
    });
  }, [indicateurs.length]);
  return {
    nbOfIndicateurswithValue: countIndicateurWithValue,
    nbOfIndicateurs: indicateurs.length,
  };
};

const ChiffreCles = ({
  rootScore,
  referentiel,
}: {
  rootScore: ActionScore;
  referentiel: 'eci' | 'cae';
}) => {
  const bigFontSizePx = 30;
  const smallFontSizePx = 10;
  const widthPx = 120;
  // Action key numbers
  const realisePoints = toFixed(rootScore.point_fait, 1);
  const realisePercentage = realisePoints * 100;

  const previsionnelPoints = toFixed(
    rootScore.point_fait + rootScore.point_programme,
    1
  );
  const previsionnelPercentage =
    (previsionnelPoints / rootScore.point_potentiel) * 100;

  // Indicateurs key numbers
  const collectiviteId = useCollectiviteId()!;
  const {nbOfIndicateurswithValue, nbOfIndicateurs} = useIndicateurCounts(
    referentiel,
    collectiviteId
  );

  return (
    <div>
      <div className="font-semibold text-center mb-4  text-xl">
        Chiffres clés
      </div>
      <div className="flex flex-row justify-between items-center">
        <div>
          <div className="font-light text-center mb-4">Taux de remplissage</div>
          <div className="flex flex-row">
            <DoughnutWithNumber
              bigFontSizePx={bigFontSizePx}
              smallFontSizePx={smallFontSizePx}
              bigText={rootScore.completed_taches_count.toString()}
              smallText="actions renseignées"
              tooltipText={`${rootScore.completed_taches_count} actions renseignées sur ${rootScore.total_taches_count}.`}
              hexColor={remplissageColor}
              doughnutFillPercentage={
                (rootScore.completed_taches_count /
                  rootScore.total_taches_count) *
                100
              }
              widthPx={widthPx}
            />
            <DoughnutWithNumber
              bigFontSizePx={bigFontSizePx}
              smallFontSizePx={smallFontSizePx}
              bigText={nbOfIndicateurswithValue.toString()}
              smallText="indicateurs renseignés"
              tooltipText={`${nbOfIndicateurswithValue} indicateurs renseignés sur ${nbOfIndicateurs}.`}
              hexColor={remplissageColor}
              doughnutFillPercentage={
                (nbOfIndicateurswithValue / nbOfIndicateurs) * 100
              }
              widthPx={widthPx}
            />
          </div>
        </div>
        <div>
          <div className="font-light text-center mb-4">
            Scores réalisé et programmé
          </div>
          <div className="flex flex-row">
            <DoughnutWithNumber
              bigFontSizePx={bigFontSizePx}
              smallFontSizePx={smallFontSizePx}
              bigText={`${toFixed(realisePercentage, 1).toString()}%`}
              tooltipText={`${realisePoints} points réalisés sur ${rootScore.point_potentiel} potentiels.`}
              smallText="réalisé"
              hexColor={actionAvancementColors.fait}
              doughnutFillPercentage={realisePercentage}
              widthPx={widthPx}
            />
            <DoughnutWithNumber
              bigFontSizePx={bigFontSizePx}
              smallFontSizePx={smallFontSizePx}
              bigText={`${toFixed(previsionnelPercentage, 1).toString()}%`}
              tooltipText={`${previsionnelPoints} points programmés sur ${rootScore.point_potentiel} potentiels.`}
              smallText="programmé"
              hexColor={actionAvancementColors.programme}
              doughnutFillPercentage={previsionnelPercentage}
              widthPx={widthPx}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// const ObjectifLabelisation = () => (
//   <div
//     style={{
//       height: '200px',
//       backgroundColor: 'rgb(0, 0, 145, .05)',
//       borderLeft: '1px solid rgb(0, 0, 145)',
//       padding: '8px',
//     }}
//   >
//     <div className="font-semibold mb-4 ">Mon parcours de labelisation</div>
//     Eventuellement une section sur la labelisation.
//     <Spacer />
//     <button className="fr-btn fr-btn--secondary">
//       Demander la première étoile
//     </button>
//   </div>
// );

const ReferentielSection = observer(
  ({
    referentiel: referentielId,
    scoreBloc,
  }: {
    referentiel: 'cae' | 'eci';
    scoreBloc: ScoreBloc;
  }) => {
    const collectiviteId = useCollectiviteId()!;
    const referentielRoot = actions.find(
      action => action.id === referentielId
    )!;
    const rootScore = scoreBloc.getScore(
      referentielRoot.id,
      referentielRoot.referentiel
    );
    if (!rootScore) {
      return (
        <div>
          <div
            style={{padding: '10px', height: '150px'}}
            className="flex items-center justify-center font-light"
          >
            Ce référentiel n’est pas encore renseigné pour votre collectivité.
            Pour commencer à visualiser votre progression, mettez à jour les
            statuts des actions.
          </div>
          <div className="flex justify-center">
            <Link
              className="fr-btn fr-btn--secondary "
              to={makeCollectiviteReferentielUrl({
                collectiviteId,
                referentielId,
              })}
            >
              Mettre à jour le référentiel
            </Link>
          </div>
        </div>
      );
    }

    const referentielAxes = referentielRoot ? referentielRoot.actions : [];

    const axisAvancementSamples: AxisAvancementSample[] = referentielAxes
      .map(axe => {
        const axisScore = scoreBloc.getScore(axe.id, axe.referentiel);
        if (!axisScore) return null;
        const sample: AxisAvancementSample = {
          label: axisLabels[axe.id],
          potentielPoints: axisScore?.point_potentiel,
          percentages: {
            fait: (axisScore.point_fait / axisScore.point_potentiel) * 100,
            programme:
              (axisScore.point_programme / axisScore.point_potentiel) * 100,
            pas_fait:
              (axisScore.point_pas_fait / axisScore.point_potentiel) * 100,
            non_renseigne:
              (axisScore.point_non_renseigne / axisScore.point_potentiel) * 100,
          },
        };
        return sample;
      })
      .filter((sample): sample is AxisAvancementSample => sample !== null);
    return (
      <div className="p-4">
        {/* <ObjectifLabelisation /> */}
        {rootScore && (
          <ChiffreCles rootScore={rootScore} referentiel={referentielId} />
        )}
        <Spacer />
        <div className="flex justify-center">
          <ReferentielAxisScoresPolarArea
            data={axisAvancementSamples}
            widthPx={550}
          />
        </div>
        <Spacer />
        <ReferentielAxisAvancementStackedBar data={axisAvancementSamples} />
      </div>
    );
  }
);

const TableauBord = () => (
  <main className="fr-container mt-9 mb-16 flex flex-row gap-4">
    <section style={{width: '600px'}} className="bg-beige p-4">
      <div className="flex gap-4 justify-center font-bold text-center text-2xl text-gray">
        <div>{refToEmoji.cae}</div>
        <div>Référentiel Climat Air Énergie</div>
      </div>
      <ReferentielSection scoreBloc={scoreBloc} referentiel="cae" />
    </section>

    <section style={{width: '600px'}} className="bg-beige p-4">
      <div className="flex gap-4 justify-center font-bold text-center text-2xl text-gray">
        <div>{refToEmoji.eci}</div>
        <div>Référentiel Économie Circulaire</div>
      </div>
      <ReferentielSection scoreBloc={scoreBloc} referentiel="eci" />
    </section>
  </main>
);

export default TableauBord;