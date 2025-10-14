export type PaperWidth = "inch2" | "inch3DotImpact" | "inch4";

export type PaperType =
  | ""
  | "normal"
  | "black_mark"
  | "black_mark_and_detect_at_power_on"
  | "gap"
  | "gap_and_detect_at_power_on";

export interface CanvasConfig {
  fontSize: number;
  lineSpace: number;
  ticketWidth: number;
  logoScale: number;
}

export interface TicketSettings {
  font: string;
  italic: boolean;
  paperWidth: PaperWidth;
  url: string;
  paperType: PaperType;
}

export interface PrinterResponse {
  traderSuccess: boolean;
  traderStatus: string;
  status?: number;
  responseText?: string;
}
