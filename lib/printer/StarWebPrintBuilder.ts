/* eslint-disable */
export interface BitImageParams {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CutPaperParams {
  feed?: boolean;
  type?: "full" | "partial";
}

export interface TextParams {
  text: string;
  emphasis?: boolean;
  invert?: boolean;
  underline?: boolean;
  width?: number;
  height?: number;
}

export class StarWebPrintBuilder {
  private builder: any;

  constructor() {
    if (typeof window === "undefined" || !window.StarWebPrintBuilder) {
      throw new Error(
        "StarWebPrintBuilder not loaded. Ensure the library is included."
      );
    }
    this.builder = new window.StarWebPrintBuilder();
  }

  /**
   * Creates initialization element to reset printer settings
   */
  createInitializationElement(): string {
    return this.builder.createInitializationElement();
  }

  /**
   * Creates a bitmap image element from canvas context
   */
  createBitImageElement(params: BitImageParams): string {
    return this.builder.createBitImageElement({
      context: params.context,
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height,
    });
  }

  /**
   * Creates a cut paper element
   */
  createCutPaperElement(params: CutPaperParams = {}): string {
    return this.builder.createCutPaperElement({
      feed: params.feed ?? true,
      type: params.type,
    });
  }

  /**
   * Creates a text element
   */
  createTextElement(params: TextParams): string {
    return this.builder.createTextElement(params);
  }

  /**
   * Creates a feed element to advance paper
   */
  createFeedElement(line: number): string {
    return this.builder.createFeedElement({ line });
  }

  /**
   * Creates an alignment element
   */
  createAlignmentElement(position: "left" | "center" | "right"): string {
    return this.builder.createAlignmentElement({ position });
  }
}
