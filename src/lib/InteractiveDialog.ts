namespace cg89 {

    export class InteractiveDialog extends Dialog {
        override activateListeners(html: JQuery) {
            super.activateListeners(html);

            html.on('input', 'input[type="range"]', (event: JQuery.TriggeredEvent) => {
                let eventSource = event.target;
                let display = html.find(`#${eventSource.name}-display`);
                if (display.length) {
                    display.text(eventSource.value);
                }
            });
        }
    }

}