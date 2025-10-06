// starwebprint.d.ts
// Basic type declarations for StarWebPrintTrader and StarWebPrintBuilder.
// These are simplified, but they’ll give you full IntelliSense and prevent TS errors.

declare global {
  interface Window {
    StarWebPrintTrader: typeof StarWebPrintTrader;
    StarWebPrintBuilder: typeof StarWebPrintBuilder;
  }

  interface StarWebPrintTraderOptions {
    url: string;
  }

  interface TraderStatus {
    traderStatus?: any;
  }

  interface TraderResponse {
    traderSuccess?: string;
    traderStatus?: any;
    status?: number;
    responseText?: string;
  }

  class StarWebPrintTrader {
    url: string;
    onReceive: (response: TraderResponse) => void;
    onError: (response: TraderResponse) => void;

    constructor(options: StarWebPrintTraderOptions);

    // Message API
    sendMessage(payload: { request: string }): void;

    // Status helpers (optional)
    isCoverOpen(status: TraderStatus): boolean;
    isOffLine(status: TraderStatus): boolean;
    isHighTemperatureStop(status: TraderStatus): boolean;
    isNonRecoverableError(status: TraderStatus): boolean;
    isAutoCutterError(status: TraderStatus): boolean;
    isPaperEnd(status: TraderStatus): boolean;
    isRollPositionError(status: TraderStatus): boolean;
  }

  class StarWebPrintBuilder {
    createInitializationElement(): string;
    createBitImageElement(options: {
      context: CanvasRenderingContext2D | null;
      x: number;
      y: number;
      width: number;
      height: number;
    }): string;
    createTextElement(options: {
      data?: string;
      characterspace?: number;
      international?: string;
    }): string;
    createCutPaperElement(options: { feed?: boolean }): string;
  }
}

export {};
