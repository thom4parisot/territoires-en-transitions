import {supabase} from 'core-logic/api/supabase';

export const claimCollectivite = async (id: number): Promise<boolean> => {
  const {data, error} = await supabase.rpc('claim_collectivite', {
    id,
  });

  if (error) {
    console.error(error);
    return false;
  }
  return !!data;
};

export type ReferentContactResponse = {
  email: string;
  nom: string;
  prenom: string;
}; // TODO : shuold be generated

export const referentContact = async (
  collectivite_id: number
): Promise<any | null> => {
  // Promise<ReferentContactResponse | null> TODO : type me !
  const {data, error} = await supabase.rpc('referent_contact', {
    collectivite_id,
  });

  if (error || !data) {
    console.error('referentContact error', error);
    return null;
  }
  console.log('referentContact data : ', data);
  return data;
};