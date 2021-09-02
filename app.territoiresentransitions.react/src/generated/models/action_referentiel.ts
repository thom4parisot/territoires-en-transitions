export interface ActionReferentielInterface {
  id: string;
  id_nomenclature: string;
  nom: string;
  thematique_id: string;
  description: string | undefined;
  contexte: string | undefined;
  exemples: string | undefined;
  ressources: string | undefined;
  points: number;
  actions: ActionReferentiel[];
}

export class ActionReferentiel {
  public static pathname = 'action_referentiel';
  get pathname(): string {
    return ActionReferentiel.pathname;
  }
  id: string;
  id_nomenclature: string;
  nom: string;
  thematique_id: string;
  description: string | undefined;
  contexte: string | undefined;
  exemples: string | undefined;
  ressources: string | undefined;
  points: number;
  actions: ActionReferentiel[];

  /**
   * Creates a ActionReferentiel instance.
   */
  constructor({
    id,
    id_nomenclature,
    nom,
    thematique_id,
    description,
    contexte,
    exemples,
    ressources,
    points,
    actions,
  }: {
    id: string;
    id_nomenclature: string;
    nom: string;
    thematique_id: string;
    description: string | undefined;
    contexte: string | undefined;
    exemples: string | undefined;
    ressources: string | undefined;
    points: number;
    actions: ActionReferentiel[];
  }) {
    this.id = id;
    this.id_nomenclature = id_nomenclature;
    this.nom = nom;
    this.thematique_id = thematique_id;
    this.description = description;
    this.contexte = contexte;
    this.exemples = exemples;
    this.ressources = ressources;
    this.points = points;
    this.actions = actions;
  }
}
