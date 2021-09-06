/**
 * Convert the selected tokens into background actors.
 * 
 * This macro converts the set of selected tokens into background actors.
 * A background actor does not display any bars or its name.
 * Additionally, this macros allows the selection of the background actor's disposition.
 * 
 * @author Sophia Pearson
 * @since 1.0.0
 */

/// ICON: icons/environment/people/commoner.webp

(async () => {
    let tokens = cg89.getTokens({ fallbackToAll: false });
    if (!tokens.length) {
        ui.notifications?.error("No tokens selected!");
        return;
    }

    let compiledTemplate = Handlebars.compile(`
        <p>
        Do you want to convert the following tokens to background actors?
        </p>
        <form>
            <fieldset>
                <legend>Dispositions:</legend>
                    {{#each tokens}}
                    <div class="form-group">
                        <label>{{name}}</label>
                        <select id="disposition-{{id}}" name="disposition">
                            <option value="${CONST.TOKEN_DISPOSITIONS.FRIENDLY}" {{#if (eq data.disposition ${CONST.TOKEN_DISPOSITIONS.FRIENDLY})}}selected{{/if}}>friendly</option>
                            <option value="${CONST.TOKEN_DISPOSITIONS.NEUTRAL}" {{#if (eq data.disposition ${CONST.TOKEN_DISPOSITIONS.NEUTRAL})}}selected{{/if}}>neutral</option>
                            <option value="${CONST.TOKEN_DISPOSITIONS.HOSTILE}" {{#if (eq data.disposition ${CONST.TOKEN_DISPOSITIONS.HOSTILE})}}selected{{/if}}>hostile</option>
                        </select>
                    </div>
                    {{/each}}
                </fieldset>
            </div>
        </form>`);

    await cg89.InteractiveDialog.prompt({
        title: 'Convert to Background Actors',
        content: compiledTemplate({ tokens: tokens }, {
            allowedProtoProperties: {
                id: true,
                name: true,
                'data.disposition': true,
            }
        }),
        label: 'Convert',
        callback: async (html: JQuery) => {
            let updates = tokens.map(token => {
                let dispositionInput = html.find(`select[id="disposition-${token.id}"]`);
                let disposition = parseInt(dispositionInput.val() as string)
                return {
                    _id: token.id,
                    displayBars: CONST.TOKEN_DISPLAY_MODES.NONE,
                    displayName: CONST.TOKEN_DISPLAY_MODES.NONE,
                    disposition: disposition,
                }
            });

            await canvas.scene?.updateEmbeddedDocuments('Token', updates);
        },
        rejectClose: false,
    });

})();