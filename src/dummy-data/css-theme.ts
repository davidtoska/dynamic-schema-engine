import { DStyle } from "../lib/Delement/DStyle";

export interface CssTheme<S extends Partial<DStyle> = Partial<DStyle>> {
    css: S;
    cssEnabled: Partial<DStyle>;
    cssDisabled: Partial<DStyle>;
}
