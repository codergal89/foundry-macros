/**
 * Change the scale of a set of tokens
 * 
 * This macro changes the scale of a set of tokens.
 * If one or more tokens are selected, only those tokens will be modified.
 * Otherwise, all tokens in the currently open scene will be modified.
 * 
 * @author Sophia Pearson
 * @since 1.0.0
 */

/// ICON: icons/magic/movement/chevrons-down-yellow.webp

(async () => {
  let tokens = cg89.getTokens({ preferControlled: true, fallbackToAll: true });
  if (!tokens.length) {
    ui.notifications?.error("No tokens selected!");
    return;
  }

  const compiledTemplate = Handlebars.compile(`
    <p>
      Do you want to convert the following tokens to background actors?
      <ul>
          {{#each names}}<li>{{this}}</li>{{/each}}
      </ul>
    </p>
    <form>
      <div class="form-group">
        <div class="form-fields">
          <label>Scale</label>
          <input type="range"
                name="scale" 
                value="1"
                min="0.20"
                max="3"
                step="0.1"/>
          <span id="scale-display" class="range-value">1</span>
        </div>
      </div>
    </form>`
  )

  async function applyTokenScale(tokens: Array<Token>, newScale: number) {
    let updates = tokens.map((t: any) => {
      return {
        _id: t.id,
        scale: newScale
      };
    });

    await canvas.scene?.updateEmbeddedDocuments('Token', updates);
  }

  await cg89.InteractiveDialog.prompt({
    title: 'Enter desired token scale',
    content: compiledTemplate({ names: tokens.map(t => t.name) }),
    label: 'Apply',
    rejectClose: false,
    callback: async (html: JQuery) => {
      let scaleInput = html.find('input[name="scale"]');
      let scale = parseFloat(scaleInput.val() as string)
      if (isNaN(scale)) {
        return;
      }
      await applyTokenScale(tokens, scale);
    }
  });
})();