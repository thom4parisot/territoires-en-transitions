import {
  claimCollectivite,
  referentContact,
  userList,
} from 'core-logic/api/procedures/collectiviteProcedures';
import {supabaseClient} from 'core-logic/api/supabase';
import {yiliCredentials, yoloCredentials} from 'test_utils/collectivites';

describe('Claim and remove collectivite Remote Procedure Call ', () => {
  it('should return true when user is first to claim this collectivite', async () => {
    // TODO : test me in the data-layer. The following test CANNOT be run more than once ...
    // await supabaseClient.auth.signIn(yiliCredentials);
    // const procedureResponse = await claimCollectivite(20);
    // expect(procedureResponse).toBe(true);
  });
  it('should return false when user is not first to claim this collectivite ', async () => {});
  it('should be able to remove its own rights from an collectivite ', async () => {});
});

describe('Request referent_contact', () => {
  it('should return referent contact of owned collectivite if exists', async () => {
    const procedureResponse = await referentContact(1);
    expect(procedureResponse).not.toBeNull();
    expect(procedureResponse).toEqual({
      prenom: 'Yolo',
      nom: 'Dodo',
      email: 'yolo@dodo.com',
    });
  });
  it('should return null if no referent yet', async () => {
    const procedureResponse = await referentContact(40);
    expect(procedureResponse).toBeDefined();
    expect(procedureResponse).toBeNull();
  });
});

describe('Request collectivité user list', () => {
  it('should return a user list containing referent and auditeur', async () => {
    await supabaseClient.auth.signIn(yoloCredentials);
    const procedureResponse = await userList(1);
    expect(procedureResponse).not.toBeNull();
    const referents = procedureResponse!.filter(
      l => l.role_name === 'referent'
    );
    expect(referents.length).toEqual(1);

    const partialReferent = {
      prenom: 'Yolo',
      nom: 'Dodo',
      email: 'yolo@dodo.com',
    };
    expect(referents[0].personnes).toEqual(
      expect.arrayContaining([expect.objectContaining(partialReferent)])
    );

    const auditeurs = procedureResponse!.filter(
      l => l.role_name === 'auditeur'
    );
    expect(auditeurs.length).toEqual(1);

    const partialAuditeur = {
      prenom: 'Yala',
      nom: 'Dada',
      email: 'yala@dada.com',
    };
    expect(auditeurs[0].personnes).toEqual(
      expect.arrayContaining([expect.objectContaining(partialAuditeur)])
    );
  });
});
