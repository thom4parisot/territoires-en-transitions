import {IndicateurReferentiel} from "generated/models/indicateur_referentiel";
import React from "react";
import {IndicateurValueStorable} from "storables/IndicateurValueStorable";
import {indicateurReferentielCommentaireStore, indicateurValueStore} from "../../../core-logic/api/hybridStores";
import {IndicateurReferentielCommentaireStorable} from "../../../storables/IndicateurReferentielCommentaireStorable";
import {ActionReferentiel} from "../../../generated/models/action_referentiel";
import {actions} from "../../../generated/data/referentiels";


const ExpandPanel = (props: { content: string, title: string }) => (
    <details>
        <summary>
            {props.title}
        </summary>
        <div>
            {props.content}
        </div>
    </details>
);

const DescriptionPanel = (props: { description: string }) => (
    <ExpandPanel title={'description'} content={props.description}/>
);

const years: number[] = Array.from({length: (2022 - 2010)}, (v, k) => k + 2010);


class IndicateurReferentielValueInput extends React.Component<{ year: number, indicateur: IndicateurReferentiel }, { value: IndicateurValueStorable | null }> {
    constructor(props: Readonly<{ year: number; indicateur: IndicateurReferentiel }> | { year: number; indicateur: IndicateurReferentiel }) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {value: null}
    }


    componentDidMount() {
        const id = IndicateurValueStorable.buildId('test', this.props.indicateur.id, this.props.year)
        indicateurValueStore
            .retrieveById(id)
            .then((storable) => this.setState({value: storable}))
    }

    render() {
        return (
            <label>
                {this.props.year}
                <input className="fr-input" defaultValue={this.state.value?.value} onChange={this.handleChange}/>
            </label>
        );
    }

    handleChange(event: React.FormEvent<HTMLInputElement>) {
        const inputValue = event.currentTarget.value;
        indicateurValueStore.store(
            new IndicateurValueStorable(
                {
                    epci_id: 'test',
                    indicateur_id: this.props.indicateur.id,
                    year: this.props.year,
                    value: inputValue
                }
            )).then((storable) => this.setState({value: storable}));
    }
}


const IndicateurReferentielValues = (props: { indicateur: IndicateurReferentiel }) => (
    <ul className="bg-grey">
        {years.map((year) =>
            <IndicateurReferentielValueInput
                year={year}
                indicateur={props.indicateur}
                key={`${props.indicateur.id}-${year}`}/>)}
    </ul>
);

class IndicateurReferentielCommentaire extends React.Component<{ indicateur: IndicateurReferentiel }, { commentaire: IndicateurReferentielCommentaireStorable | null }> {

    constructor(props: Readonly<{ indicateur: IndicateurReferentiel }> | { indicateur: IndicateurReferentiel }) {
        super(props);
        this.state = {commentaire: null};
    }

    // todo on update.

    componentDidMount() {
        const id = IndicateurReferentielCommentaireStorable.buildId('test', this.props.indicateur.id);
        indicateurReferentielCommentaireStore
            .retrieveById(id)
            .then((storable) => this.setState({commentaire: storable}));
    }

    render() {
        return (
            <details>
                <summary>
                    Commentaire
                </summary>
                <div>
                    <textarea defaultValue={this.state.commentaire?.value ?? ''}/>
                </div>
            </details>
        );
    }
}


export const IndicateurReferentielCard = (props: { indicateur: IndicateurReferentiel }) => {
    // todo lookup related actions

    return (

        <div className="flex flex-col items-center pt-8 pr-6 pb-6">
            <h3 className="fr-h3 mb-6">{props.indicateur.nom}</h3>
            <IndicateurReferentielValues indicateur={props.indicateur}/>
            <DescriptionPanel description={props.indicateur.description}/>
            <IndicateurReferentielCommentaire indicateur={props.indicateur}/>
        </div>
    );
};
