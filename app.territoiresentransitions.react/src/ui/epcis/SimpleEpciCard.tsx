import {EpciRead} from 'generated/dataLayer/epci_read';
import {Link} from 'react-router-dom';

const SimpleEpciCardLink = (props: {label: string; linkTo: string}) => (
  <Link
    className="fr-btn fr-btn--secondary fr-btn--sm fr-fi-arrow-right-line fr-btn--icon-right w-full"
    to={props.linkTo}
  >
    {props.label}
  </Link>
);

type SimpleEpciCardProps = {epci: EpciRead};
export const SimpleEpciCard = ({epci}: SimpleEpciCardProps) => (
  <div className="flex flex-col items-center justify-between p-8 bg-beige">
    <h3 className="fr-h3 p-2 text-center ">{epci.nom}</h3>
    <div>
      <SimpleEpciCardLink
        label="Plan d'actions"
        linkTo={`/collectivite/${epci.siren}/plan_actions`}
      />
      <div className="pb-3" />
      <SimpleEpciCardLink
        label="Référentiels"
        linkTo={`/collectivite/${epci.siren}/referentiels`}
      />
      <div className="pb-3" />
      <SimpleEpciCardLink
        label="Indicateurs"
        linkTo={`/collectivite/${epci.siren}/indicateurs`}
      />
    </div>
  </div>
);