export class PrinterService {
  /**
   * Formats printer status into a readable message
   */
  static formatStatusMessage(
    trader: StarWebPrintTrader,
    response: PrinterResponse
  ): string {
    let msg = "- Print Status -\n\n";
    msg += `Success: ${response.traderSuccess ? "Yes" : "No"}\n\n`;
    msg += `Status Details:\n`;

    const statusChecks = [
      { check: trader.isCoverOpen(response.traderStatus), label: "Cover Open" },
      { check: trader.isOffLine(response.traderStatus), label: "Offline" },
      {
        check: trader.isCompulsionSwitchClose(response.traderStatus),
        label: "Compulsion Switch Close",
      },
      {
        check: trader.isEtbCommandExecute(response.traderStatus),
        label: "ETB Command Execute",
      },
      {
        check: trader.isHighTemperatureStop(response.traderStatus),
        label: "High Temperature Stop",
      },
      {
        check: trader.isNonRecoverableError(response.traderStatus),
        label: "Non-Recoverable Error",
      },
      {
        check: trader.isAutoCutterError(response.traderStatus),
        label: "Auto Cutter Error",
      },
      {
        check: trader.isBlackMarkError(response.traderStatus),
        label: "Black Mark Error",
      },
      { check: trader.isPaperEnd(response.traderStatus), label: "Paper End" },
      {
        check: trader.isPaperNearEnd(response.traderStatus),
        label: "Paper Near End",
      },
      {
        check: trader.isPaperPresent(response.traderStatus),
        label: "Paper Present",
      },
      {
        check: trader.isRollPositionError(response.traderStatus),
        label: "Roll Position Error",
      },
    ];

    statusChecks.forEach(({ check, label }) => {
      if (check) {
        msg += `  • ${label}\n`;
      }
    });

    const etbCounter = trader.extractionEtbCounter(response.traderStatus);
    msg += `\nETB Counter: ${etbCounter}`;

    return msg;
  }

  /**
   * Creates a print request from a canvas
   */
  static createPrintRequest(canvas: HTMLCanvasElement): string {
    /*  const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas context not available");
    }
 */
    const builder = new StarWebPrintBuilder();

    let request = "";
    request += builder.createInitializationElement();
    request += builder.createBitImageElement({
      context: context,
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    });
    request += builder.createCutPaperElement({ feed: true });

    return request;
  }

  /**
   * Sends a print job to the printer
   */
  static async sendPrintJob(
    canvas: HTMLCanvasElement,
    config: TraderConfig,
    onProgress?: (status: string) => void
  ): Promise<PrintJobResult> {
    return new Promise((resolve, reject) => {
      try {
        onProgress?.("Preparing print job...");

        const request = this.createPrintRequest(canvas);
        const trader = new StarWebPrintTrader(config);

        trader.onReceive = (response: PrinterResponse) => {
          const message = this.formatStatusMessage(trader, response);

          if (response.traderSuccess) {
            resolve({
              success: true,
              message,
              response,
            });
          } else {
            resolve({
              success: false,
              message: "Print job completed with warnings:\n\n" + message,
              response,
            });
          }
        };

        trader.onError = (response: PrinterResponse) => {
          const errorMsg = `Print Error:\n\nStatus: ${response.status}\nDetails: ${response.responseText}`;

          reject({
            success: false,
            message: errorMsg,
            response,
          });
        };

        onProgress?.("Sending to printer...");
        trader.sendMessage({ request });
      } catch (error) {
        reject({
          success: false,
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    });
  }
}
