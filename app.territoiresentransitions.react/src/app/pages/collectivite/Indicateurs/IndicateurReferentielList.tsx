import React, {useState} from 'react';
import {indicateurs} from 'generated/data/indicateurs_referentiels';
import {IndicateurReferentielCard} from 'app/pages/collectivite/Indicateurs/IndicateurReferentielCard';
import {IndicateurReferentiel} from 'generated/models/indicateur_referentiel';
import {Thematique, thematiques} from 'generated/data/thematiques';

function LazyDetails(props: {
  summary: React.ReactNode;
  children: React.ReactNode;
  startOpen: boolean;
}) {
  const [open, setOpen] = useState(props.startOpen);
  return (
    <details open={open} className="flex items-center">
      <summary
        onClick={e => {
          e.preventDefault();
          setOpen(open => !open);
        }}
      >
        {props.summary}
      </summary>
      {open && props.children}
    </details>
  );
}

/**
 * Display the list of indicateur referentiel.
 */
export const IndicateurReferentielList = () => {
  const byThematique = new Map<Thematique, IndicateurReferentiel[]>();
  for (const thematique of thematiques) {
    const filtered = indicateurs.filter(
      action => action.thematique_id === thematique.id
    );
    if (filtered.length) byThematique.set(thematique, filtered);
  }

  return (
    <div className="app mx-5 mt-5">
      <section className="flex flex-col">
        {[...byThematique.keys()].map(thematique => {
          return (
            <LazyDetails summary={<h2>{thematique.name}</h2>} startOpen={false}>
              {byThematique.get(thematique)!.map(indicateur => {
                return (
                  <IndicateurReferentielCard
                    indicateur={indicateur}
                    key={indicateur.id}
                  />
                );
              })}
            </LazyDetails>
          );
        })}
      </section>
    </div>
  );
};
