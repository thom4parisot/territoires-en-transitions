import {RealtimeClient} from '@supabase/realtime-js';
import {ScoreSocket} from 'core-logic/api/sockets/ScoreSocket';
import {SupabaseScoreController} from 'core-logic/api/sockets/SupabaseScoreController';
import {supabase} from 'core-logic/api/supabase';
import {ScoreRead} from 'generated/dataLayer/score_read';
import {Server as WebSocketServer} from 'mock-socket';
import {takeUntil, timer} from 'rxjs';

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

describe('Supabase Score Controller ', () => {
  const schema = 'public';
  const readTableName = 'client_scores';
  const epciId = 1;

  it('[TEMPORARY TEST] should publish a score in socket when score is written directly in client score table ', async () => {
    const controller = new SupabaseScoreController({
      supabaseClient: supabase,
    });
    const socket = new ScoreSocket({controller, epciId});

    // Mimic server
    const writeScore = {
      action_id: 'cae_1.2.3',
      completed_taches_count: 1,
      concernee: true,
      epci_id: 1,
      points: 100,
      potentiel: 100,
      previsionnel: 100,
      referentiel_points: 100,
      total_taches_count: 100,
    };

    const expectedScoreRead: ScoreRead = {
      id: 1,
      created_at: '2021-01-01',
      ...writeScore,
    };

    let actual: ScoreRead[] = [];
    socket.scoreObservable.subscribe(actualScoreReads => {
      actual = actualScoreReads;
      console.log('actualScoreReads -> -> ', actualScoreReads);
    });

    controller.listen();

    const writeTableName = 'score';
    const insertResponse = await supabase
      .from(writeTableName)
      .upsert(writeScore);

    console.log('insertResponse : ', insertResponse);

    socket.scoreObservable.subscribe(e => console.log('obs', e));
    socket._scores.subscribe(e => console.log('subj', e));

    await sleep(3000);

    expect(actual).toHaveLength(1);
    expect(actual[0]).toStrictEqual(expectedScoreRead);
  });

  it.skip('Should ', async () => {
    // TODO : fix me !
    const topic = `realtime:${schema}:${readTableName}:epci_id=${epciId}`;
    // const server = new WS('ws://localhost:1234/');
    const server = new WebSocketServer('ws://localhost:1234');
    // const client = new WebSocket('ws://localhost:1234');
    const localSupabaseClient = new RealtimeClient(
      'ws://localhost:1234/socket'
    );

    localSupabaseClient.connect();
    // console.log(localSupabaseClient);
    // console.log('before await ');
    // await server.;
    // console.log('after await');

    localSupabaseClient.push({
      topic,
      event: 'INSERT',
      payload: {},
      ref: '',
    });

    const controller = new SupabaseScoreController({
      supabaseClient: supabase,
      // todo options: { realtime: {}}
    });
    const socket = new ScoreSocket({controller, epciId});

    // localSupabaseClient.onConnMessage;

    // server.emit({
    //   event: 'INSERT',
    //   data: {
    //     topic: 'lala',
    //     type: 'INSERT',
    //     payload: 'hello',
    //   },
    // });

    // WS.clean();
  });
});