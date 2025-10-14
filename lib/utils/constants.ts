export const CANVAS_CONFIGS: Record<string, CanvasConfig> = {
  inch2: {
    fontSize: 22,
    lineSpace: 28,
    ticketWidth: 384,
    logoScale: 1,
  },
  inch3DotImpact: {
    fontSize: 22,
    lineSpace: 32,
    ticketWidth: 576,
    logoScale: 1.5,
  },
  inch4: {
    fontSize: 48,
    lineSpace: 48,
    ticketWidth: 832,
    logoScale: 2,
  },
};

export const CANVAS_DIMENSIONS = {
  inch2: { width: 384, height: 555 },
  inch3DotImpact: { width: 576, height: 640 },
  inch4: { width: 832, height: 952 },
};

export const DEFAULT_SETTINGS: TicketSettings = {
  font: "Arial",
  italic: false,
  paperWidth: "inch2",
  url: `http://${process.env.DEV_SERVER}/StarWebPRNT/SendMessage`,
  paperType: "",
};

export const FONT_OPTIONS = [
  "Arial",
  "Cambria",
  "Comic Sans MS",
  "Constantia",
  "Gabriola",
  "Georgia",
  "Segoe UI",
  "Fixedsys",
  "MS Serif",
];
