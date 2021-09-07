/**
 * Randomize the image of multisided tokens
 * 
 * This macro randomizes the image of multisided tokens.
 * If one or more tokens are selected, only those tokens will be modified.
 * Otherwise, all tokens in the currently open scene will be modified.
 * 
 * @author Sophia Pearson
 * @since 1.1.0
 */

/// ICON: icons/magic/time/arrows-circling-green.webp

(async () => {
    let tokens = cg89.getTokens({ fallbackToAll: true, preferControlled: true });
    if (!tokens.length) {
        ui.notifications?.error('No tokens selected or placed on the canvas!');
        return;
    }

    let updates = await Promise.all(tokens.filter(token => token.actor?.data.token.randomImg)
        .map(token => ({
            token: token,
            actor: game.actors!.get(token.actor?.id || "")
        }))
        .filter(descriptor => descriptor.actor !== undefined)
        .map(async descriptor => {
            let {token, actor} = descriptor;
            let images = await actor!.getTokenImages();
            let choice = Math.floor(Math.random() * images.length);

            return {
                _id: token.id,
                img: images[choice]
            }
        }));

        let updated = await canvas.scene!.updateEmbeddedDocuments('Token', updates);

        ui.notifications?.info(`Randomized ${updated.length} tokens.`);
})();
