import { DCss } from "./css";
import { ElementKeyNames } from "./DStyle-utils";
import { DUtil } from "../utils/DUtil";
import { resolveBaseUrl } from "vite";
type DStyle2 = CSSStyleDeclaration;
export interface DStyle {
    opacity: number;
    backgroundColor: string;
    visibility: "visible" | "hidden";
    cursor:
        | "pointer"
        | "help"
        | "copy"
        | "wait"
        | "not-allowed"
        | "context-menu"
        | "move"
        | "grabbing"
        | "grab"
        | "zoom-in"
        | "zoom-out"
        | "none"
        | "auto"
        | "default";

    // POSITION
    h: number;
    w: number;
    x: number;
    y: number;

    // BORDERS
    borderStyle: "solid" | "none" | "dotted" | "dashed";
    borderRadius: DCss.Px | DCss.Percent;
    borderWidth: DCss.Px;
    borderColor: string;

    margin: DCss.Px | DCss.Percent;
    padding: DCss.Px | DCss.Percent;

    // Translate
    transform: string;
    translate: string;

    // TEXT
    fontSize: DCss.Px;
    textColor: string;
    fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    textAlign: "right" | "left" | "center";
}

export namespace DStyle {
    export const normalize = <T extends HTMLElement>(el: T): T => {
        el.style.padding = "0";
        el.style.margin = "0";
        el.style.position = "absolute";
        el.style.boxSizing = "border-box";
        return el;
    };

    export const applyStyles = <T extends HTMLElement>(el: T, style: Partial<DStyle>, scale: number): T => {
        // const scalePx = DCss.toStringCre(this.scale);
        const {
            x,
            y,
            backgroundColor,
            borderColor,
            borderWidth,
            borderRadius,
            borderStyle,
            w,
            opacity,
            cursor,
            fontSize,
            fontWeight,
            textColor,
            textAlign,
            translate,
            margin,
            padding,
            h,
            transform,
            visibility,
        } = style;

        // this.el.style.fontWeight = '900';
        if (backgroundColor) {
            el.style.backgroundColor = backgroundColor;
        }

        if (cursor) {
            el.style.cursor = cursor;
        }

        if (transform) {
            el.style.transform = transform;
        }

        if (textColor) {
            el.style.color = textColor;
        }
        if (textAlign) {
            el.style.textAlign = textAlign;
        }

        if (borderColor) {
            el.style.borderColor = borderColor;
        }

        if (borderWidth) {
            el.style.borderWidth = DCss.toString(borderWidth, scale);
        }
        if (fontWeight) {
            el.style.fontWeight = fontWeight + "";
        }
        if (borderStyle) {
            el.style.borderStyle = borderStyle;
        }
        if (fontSize) {
            el.style.fontSize = DCss.toString(fontSize, scale);
        }

        if (DUtil.isNumber(x)) {
            el.style.left = x + "%";
        }
        if (DUtil.isNumber(y)) {
            el.style.bottom = y + "%";
        }

        if (DUtil.isNumber(h)) {
            el.style.height = h + "%";
        }
        if (DUtil.isNumber(w)) {
            el.style.width = w + "%";
        }

        if (DCss.isLengthUnit(borderRadius)) {
            el.style.borderRadius = DCss.toString(borderRadius, scale);
        }

        if (DUtil.isNumber(opacity)) {
            el.style.opacity = opacity + "";
        }

        if (visibility) {
            el.style.visibility = visibility;
        }

        return el;
    };
    const propNames = new Set(...ElementKeyNames);
    export const validKey = (keyName: string) => propNames.has(keyName);
}
