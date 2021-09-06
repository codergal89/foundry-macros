/**
 * Fixup broken token-to-actor links
 * 
 * This fixes broken links between the tokens in the currently active scene and their actors.
 * 
 * @author Sophia Pearson
 * @since 1.0.0
 */

/// ICON: icons/tools/fasteners/chain-steel-blue.webp

(async () => {
    let tokens = cg89.getTokens({ preferControlled: true, fallbackToAll: true });
    if (!tokens.length) {
        ui.notifications?.error('No tokens selected or available in scene!');
        return;
    }

    let expectedActors = new Set(tokens.map(token => token.name));

    ui.notifications?.info('Starting actor link fixup');

    let issues = 0;
    expectedActors.forEach(async expected => {
        const actor = game.actors?.find(candidate => candidate.name === expected);

        if (!actor) {
            ui.notifications?.warn(`No actor found for '${expected}`)
            issues++;
            return;
        }

        let affectedTokens = tokens.filter(token => token.name === expected)
            .filter(token => token.data.actorId != actor.id);

        if (!affectedTokens.length) {
            ui.notifications?.info(`All occurrences of '${expected}' are linked up correctly!`);
            return;
        }

        ui.notifications?.info(`Fixing up '${expected}'`);
        let updates = affectedTokens.map(token => ({ _id: token.id, actorId: actor.id }));

        await canvas.scene?.updateEmbeddedDocuments("Token", updates);
    });

    ui.notifications?.info(`Actor link fixup completed. There where ${issues} issues.`);
})();