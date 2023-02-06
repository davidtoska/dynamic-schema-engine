import { DStyle } from "../lib/Delement/DStyle";
import { DCss } from "../lib/Delement/css";

export namespace ButtonTheme {
    const GREEN = "#70AD47";
    const YELLOW = "#FFC000";
    const ORANGE = "#F4902C";
    const RED = "#FF0000";
    const LIGHT_BLUE = "#42719C";
    const WHITE = "#ffffff";
    const BLUE = "#2F5597";
    const BTN_WIDTH = 18.5;
    const BTN_BORDER_WIDTH = 3;
    const BTN_BORDER_RADIUS = 10;
    const BTN_BORDER_STYLE: DStyle["borderStyle"] = "solid";
    const BTN_HEIGHT = 9.2;
    const BTN_SHORT_WIDTH = 13.7;
    const FONT_WEIGHT: DStyle["fontWeight"] = 600;
    const FONT_SIZE: DCss.Px["value"] = 35;

    export type ButtonThemeKind = ButtonTheme["name"];
    export interface ButtonTheme {
        readonly name: "normal" | "level1" | "level2" | "level3" | "level4" | "dont-know";
        readonly styles: ButtonStyles;
        readonly disabledCss: Partial<DStyle>;
        readonly enabledCss: Partial<DStyle>;
    }

    type ButtonStyles = Pick<
        DStyle,
        | "backgroundColor"
        | "borderColor"
        | "textColor"
        | "fontSize"
        | "h"
        | "w"
        | "x"
        | "y"
        | "padding"
        | "fontWeight"
        | "borderWidth"
        | "borderStyle"
        | "borderRadius"
    >;
    export interface ButtonBarTheme {
        readonly name: "normal" | "gradient";

        readonly plain: {
            readonly one: [ButtonStyles];
            readonly two: [ButtonStyles, ButtonStyles];
            readonly three: [ButtonStyles, ButtonStyles, ButtonStyles];
            readonly four: [ButtonStyles, ButtonStyles, ButtonStyles, ButtonStyles];
            readonly five: [ButtonStyles, ButtonStyles, ButtonStyles, ButtonStyles, ButtonStyles];
        };
        readonly withDontKnow: {
            readonly two: [ButtonStyles, ButtonStyles];
            readonly three: [ButtonStyles, ButtonStyles, ButtonStyles];
            readonly four: [ButtonStyles, ButtonStyles, ButtonStyles, ButtonStyles];
            readonly five: [ButtonStyles, ButtonStyles, ButtonStyles, ButtonStyles, ButtonStyles];
        };
    }

    export const themes: Record<ButtonThemeKind, ButtonTheme["styles"]> = {
        "dont-know": {
            backgroundColor: WHITE,
            borderColor: LIGHT_BLUE,
            textColor: BLUE,
            fontSize: { _unit: "px", value: FONT_SIZE },
            borderWidth: { _unit: "px", value: BTN_BORDER_WIDTH },
            borderStyle: BTN_BORDER_STYLE,
            borderRadius: { value: BTN_BORDER_RADIUS, _unit: "px" },
            padding: { _unit: "px", value: 40 },
            h: BTN_HEIGHT,
            w: BTN_SHORT_WIDTH,
            fontWeight: FONT_WEIGHT,
            x: 10,
            y: 10,
        },
        level1: {
            backgroundColor: GREEN,
            borderColor: GREEN,
            textColor: WHITE,
            fontSize: { _unit: "px", value: FONT_SIZE },
            borderWidth: { _unit: "px", value: BTN_BORDER_WIDTH },
            borderStyle: BTN_BORDER_STYLE,
            borderRadius: { value: BTN_BORDER_RADIUS, _unit: "px" },
            padding: { _unit: "px", value: 40 },
            h: BTN_HEIGHT,
            w: BTN_WIDTH,
            fontWeight: FONT_WEIGHT,
            x: 10,
            y: 10,
        },
        level2: {
            backgroundColor: YELLOW,
            borderColor: YELLOW,
            textColor: WHITE,
            fontSize: { _unit: "px", value: FONT_SIZE },
            borderWidth: { _unit: "px", value: BTN_BORDER_WIDTH },
            borderStyle: BTN_BORDER_STYLE,
            borderRadius: { value: BTN_BORDER_RADIUS, _unit: "px" },
            padding: { _unit: "px", value: 40 },
            h: BTN_HEIGHT,
            w: BTN_WIDTH,
            fontWeight: FONT_WEIGHT,
            x: 10,
            y: 10,
        },
        level3: {
            backgroundColor: ORANGE,
            borderColor: ORANGE,
            textColor: WHITE,

            fontSize: { _unit: "px", value: FONT_SIZE },
            borderWidth: { _unit: "px", value: BTN_BORDER_WIDTH },
            borderStyle: BTN_BORDER_STYLE,
            borderRadius: { value: BTN_BORDER_RADIUS, _unit: "px" },
            padding: { _unit: "px", value: 40 },
            h: BTN_HEIGHT,
            w: BTN_WIDTH,
            fontWeight: FONT_WEIGHT,
            x: 10,
            y: 10,
        },
        level4: {
            backgroundColor: RED,
            borderColor: RED,
            textColor: WHITE,
            fontSize: { _unit: "px", value: FONT_SIZE },
            borderWidth: { _unit: "px", value: BTN_BORDER_WIDTH },
            borderStyle: BTN_BORDER_STYLE,
            borderRadius: { value: BTN_BORDER_RADIUS, _unit: "px" },
            padding: { _unit: "px", value: 40 },
            h: BTN_HEIGHT,
            w: BTN_WIDTH,
            fontWeight: FONT_WEIGHT,
            x: 10,
            y: 10,
        },
        normal: {
            backgroundColor: BLUE,
            borderColor: BLUE,
            textColor: WHITE,
            fontSize: { _unit: "px", value: FONT_SIZE },
            borderWidth: { _unit: "px", value: BTN_BORDER_WIDTH },
            borderStyle: BTN_BORDER_STYLE,
            borderRadius: { value: BTN_BORDER_RADIUS, _unit: "px" },
            padding: { _unit: "px", value: 40 },
            h: BTN_HEIGHT,
            w: BTN_WIDTH,
            fontWeight: FONT_WEIGHT,
            x: 10,
            y: 10,
        },
    };
    export const normalButtonBarTheme: ButtonBarTheme = {
        name: "normal",
        plain: {
            one: [themes["normal"]],
            two: [themes["normal"], themes["normal"]],
            three: [themes["normal"], themes["normal"], themes["normal"]],
            four: [themes["normal"], themes["normal"], themes["normal"], themes["normal"]],
            five: [themes["normal"], themes["normal"], themes["normal"], themes["normal"], themes["normal"]],
        },
        withDontKnow: {
            two: [themes["normal"], themes["dont-know"]],
            three: [themes["normal"], themes["normal"], themes["dont-know"]],
            four: [themes["normal"], themes["normal"], themes["normal"], themes["dont-know"]],
            five: [themes["normal"], themes["normal"], themes["normal"], themes["normal"], themes["dont-know"]],
        },
    };

    export const gradientButtonBarTheme: ButtonBarTheme = {
        name: "gradient",
        plain: {
            one: [themes["level1"]],
            two: [themes["level1"], themes["level4"]],
            three: [themes["level1"], themes["level2"], themes["level4"]],
            four: [themes["level1"], themes["level2"], themes["level3"], themes["level4"]],
            five: [themes["level1"], themes["level2"], themes["level3"], themes["level4"], themes["dont-know"]],
        },
        withDontKnow: {
            two: [themes["level1"], themes["dont-know"]],
            three: [themes["level1"], themes["level4"], themes["dont-know"]],
            four: [themes["level1"], themes["level2"], themes["level4"], themes["dont-know"]],
            five: [themes["level1"], themes["level2"], themes["level3"], themes["level4"], themes["dont-know"]],
        },
    };
}
