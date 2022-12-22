# Actor Pipe

The purpose of this actor is to serve as webhook-powered pipe between 2 actors.

## Usage

 - Pick an actor you want to trigger after run finishes, put it's id as `targetActorId`.
 - If you want to use other than default options, use `targetActorOptions` field to override them.
 - Provide `transformFunction` which takes `payload` (standard webhook payload), `apifyClient` and `log`, and generates input for the target actor.

## The Idea

The idea is to have new type of webhook - "Apify", that would
 - have `transformFunction`, `actorId` and `options` inputs, linked to the platform (so the actor select would be actual select, options proper, transformFunction would be code)
 - it would call this actor to get the webhook payload and url
 - it would construct the webhook from this

 - in the mvp it should also be possible to call some task in the same way

## Mode

The actor can work in two modes.

### Output Payload

In this mode, actor generates webhook payload, that should be used in order to trigger run of an actor with the output of `transformFunction` as it's input.
