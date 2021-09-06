namespace cg89 {

    interface GetTokensOptions {
        forceAll?: boolean,
        preferControlled?: boolean,
        fallbackToAll?: boolean,
    }

    export function getTokens(options: GetTokensOptions = {}): Array<Token> {
        const tokenAccessor = canvas.tokens!;

        let {
            forceAll = false,
            preferControlled = true,
            fallbackToAll = true,
        } = options;

        if (forceAll) {
            return tokenAccessor.placeables;
        }

        if (preferControlled && tokenAccessor.controlled.length) {
            return tokenAccessor.controlled;
        }

        if (fallbackToAll && tokenAccessor.placeables.length) {
            return tokenAccessor.placeables;
        }

        return [];
    }

}