import { Actor } from 'apify';
import log from '@apify/log';

// The transformation funciton is given as string, we need to evaluate it
const parseTransformFunction = (transformFunctionAsString) => {
    return eval(transformFunctionAsString);
}

// Initialize the Apify SDK
await Actor.init();

// Get input of the actor (here only for demonstration purposes).
const input = await Actor.getInput();

const { 
    payload
} = input;

const targetActorId = "dSCLg0C3YEZ83HzYX";

const transformFunction = async ({ payload, apifyClient, log }) => {
    log.info('Received payload', payload);
    const { items } = await apifyClient.dataset(payload.resource.defaultDatasetId).listItems({
      fields: ['ownerUsername'],
      });
      return { 
        usernames: items.map((item) => item.ownerUsername),
        };
    }

    const targetActorInput = await transformFunction({payload, apifyClient: Actor.apifyClient, log});
    await Actor.call(targetActorId, targetActorInput);

// Exit successfully
await Actor.exit();
