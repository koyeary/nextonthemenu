/* eslint-disable */
import { PrinterResponse, TraderConfig } from "@/types/printer";

export interface SendMessageParams {
  request: string;
}

export type OnReceiveCallback = (response: PrinterResponse) => void;
export type OnErrorCallback = (response: PrinterResponse) => void;

export class StarWebPrintTrader {
  private trader: any;
  public onReceive?: OnReceiveCallback;
  public onError?: OnErrorCallback;

  constructor(config: TraderConfig) {
    if (typeof window === "undefined" || !window.StarWebPrintTrader) {
      throw new Error(
        "StarWebPrintTrader not loaded. Ensure the library is included."
      );
    }

    this.trader = new window.StarWebPrintTrader({
      url: config.url,
      papertype: config.papertype || "",
    });

    // Set up callbacks
    this.trader.onReceive = (response: PrinterResponse) => {
      if (this.onReceive) {
        this.onReceive(response);
      }
    };

    this.trader.onError = (response: PrinterResponse) => {
      if (this.onError) {
        this.onError(response);
      }
    };
  }

  /**
   * Sends a print request to the printer
   */
  sendMessage(params: SendMessageParams): void {
    this.trader.sendMessage({ request: params.request });
  }

  /**
   * Checks various printer status conditions
   */
  isCoverOpen(status: string): boolean {
    return this.trader.isCoverOpen({ traderStatus: status });
  }

  isOffLine(status: string): boolean {
    return this.trader.isOffLine({ traderStatus: status });
  }

  isCompulsionSwitchClose(status: string): boolean {
    return this.trader.isCompulsionSwitchClose({ traderStatus: status });
  }

  isEtbCommandExecute(status: string): boolean {
    return this.trader.isEtbCommandExecute({ traderStatus: status });
  }

  isHighTemperatureStop(status: string): boolean {
    return this.trader.isHighTemperatureStop({ traderStatus: status });
  }

  isNonRecoverableError(status: string): boolean {
    return this.trader.isNonRecoverableError({ traderStatus: status });
  }

  isAutoCutterError(status: string): boolean {
    return this.trader.isAutoCutterError({ traderStatus: status });
  }

  isBlackMarkError(status: string): boolean {
    return this.trader.isBlackMarkError({ traderStatus: status });
  }

  isPaperEnd(status: string): boolean {
    return this.trader.isPaperEnd({ traderStatus: status });
  }

  isPaperNearEnd(status: string): boolean {
    return this.trader.isPaperNearEnd({ traderStatus: status });
  }

  isPaperPresent(status: string): boolean {
    return this.trader.isPaperPresent({ traderStatus: status });
  }

  isRollPositionError(status: string): boolean {
    return this.trader.isRollPositionError({ traderStatus: status });
  }

  extractionEtbCounter(status: string): number {
    return this.trader.extractionEtbCounter({ traderStatus: status });
  }
}
