export class ScaleService {
    private readonly baseHeight;
    private readonly baseWidth;
    private containerHeight = 1300;
    private containerWidth = 1300;

    get scale() {
        return this._scale;
    }

    get pageHeight() {
        return this.baseHeight * this.scale;
    }
    get pageWidth() {
        return this.baseWidth * this._scale;
    }

    private _scale = 1;

    private readonly subscribers = new Set<(scale: number) => void>();

    constructor(config: { baseHeight: number; baseWidth: number; containerHeight: number; containerWidth: number }) {
        this.baseHeight = config.baseHeight;
        this.baseWidth = config.baseWidth;
        this.containerHeight = config.containerHeight;
        this.containerWidth = config.containerWidth;
        this.updateScale();
    }

    setContainerBounds(bounds: { height: number; width: number }) {
        this.containerWidth = bounds.width;
        this.containerHeight = bounds.height;
        this.updateScale();
    }
    private updateScale() {
        const scaleFn = Scale.calc(this.baseHeight, this.baseWidth);
        const scale = scaleFn({ height: this.containerHeight, width: this.containerWidth });
        const hasChanged = this.scale !== scale;
        this._scale = scale;
        if (hasChanged) {
            this.subscribers.forEach((fn) => {
                fn(this._scale);
            });
        }
    }

    onChange(scaleChangeHandler: (scale: number) => void) {
        this.subscribers.add(scaleChangeHandler);
        scaleChangeHandler(this._scale);
        return () => {
            this.subscribers.delete(scaleChangeHandler);
        };
    }
}
export namespace Scale {
    export const calc = (baseHeight: number, baseWidth: number) => {
        return (container: { height: number; width: number }) => {
            const heightRatio = container.height / baseHeight;
            const widthRatio = container.width / baseWidth;
            return Math.min(heightRatio, widthRatio);
        };
    };

    type ScalePosInput = { x: number; y: number; h: number; w: number };

    export const scaleFunctionCreator = (scale: number) => {
        return (value: number) => value * scale;
    };
}
