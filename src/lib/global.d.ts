import "@league-of-foundry-developers/foundry-vtt-types"

declare global {
    interface LenientGlobalVariableTypes {
        game: never;
        canvas: never;
        ui: never;
    }
}