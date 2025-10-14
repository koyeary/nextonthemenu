import { FONT_OPTIONS } from "@/lib/utils/constants";
import { PaperWidth } from "@/types/Ticket";

interface TicketOptionsProps {
  font: string;
  italic: boolean;
  paperWidth: PaperWidth;
  onFontChange: (font: string) => void;
  onItalicChange: (italic: boolean) => void;
  onPaperWidthChange: (width: PaperWidth) => void;
}

export default function TicketOptions({
  font,
  italic,
  paperWidth,
  onFontChange,
  onItalicChange,
  onPaperWidthChange,
}: TicketOptionsProps) {
  return (
    <div className="option-block">
      <dl>
        <dt>Font</dt>
        <dd>
          :
          <select value={font} onChange={(e) => onFontChange(e.target.value)}>
            {FONT_OPTIONS.map((fontName) => (
              <option key={fontName} value={fontName}>
                {fontName}
              </option>
            ))}
          </select>
          &nbsp;
          <input
            type="checkbox"
            checked={italic}
            onChange={(e) => onItalicChange(e.target.checked)}
          />
          Italic
        </dd>
      </dl>
      <dl>
        <dt>Paper Width</dt>
        <dd>
          :
          <select
            value={paperWidth}
            onChange={(e) => onPaperWidthChange(e.target.value as PaperWidth)}
          >
            <option value="inch2">2 Inch (203dpi/384dot)</option>
            <option value="inch3DotImpact">
              3 Inch (203dpi/576dot) / 2 Inch (300dpi/576dot)
            </option>
            <option value="inch4">4 Inch (203dpi/832dot)</option>
          </select>
        </dd>
      </dl>
    </div>
  );
}
