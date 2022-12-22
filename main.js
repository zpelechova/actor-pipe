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
    targetActorId,
    targetActorOptions,
    transformFunction,
    mode,
    apiBaseUrl,
    payload
} = input;

if (mode === "outputPayload") {
    // Parse transform function to see that it's valid
    parseTransformFunction(input.transformFunction);

    // Generate the desired output
    const output = JSON.stringify({
        targetActorId,
        targetActorOptions,
        transformFunction,
        mode: "handleWebhook",
        PAYLOAD_PLACEHOLDER: 0,
    })

    // Replace the payload placeholder with actual output (this is needed for the webhook)
    .replace('"PAYLOAD_PLACEHOLDER":0', '"payload":{"userId":{{userId}},"createdAt":{{createdAt}},"eventType":{{eventType}},"eventData":{{eventData}},"resource":{{resource}}}');
    await Actor.setValue('OUTPUT_PAYLOAD', output, {contentType: 'text/plain'});
    // TODO: This should also work on staging - maybe we could get this info from client?
    await Actor.setValue('OUTPUT_URL', `${apiBaseUrl}/v2/acts/${process.env.APIFY_ACTOR_ID}/runs`, {contentType: 'text/plain'});

} else {
    const transformFunction = parseTransformFunction(input.transformFunction);
    const targetActorInput = await transformFunction({payload, apifyClient: Actor.apifyClient, log});
    await Actor.call(targetActorId, targetActorInput, targetActorOptions);
}

// Exit successfully
await Actor.exit();
