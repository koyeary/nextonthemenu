"use client";
import { PaperType } from "@/types/ticket";

interface PrintControlsProps {
  url: string;
  paperType: PaperType;
  onUrlChange: (url: string) => void;
  onPaperTypeChange: (type: PaperType) => void;
  onSend: () => void;
}

export default function PrintControls({
  url,
  paperType,
  onUrlChange,
  onPaperTypeChange,
  onSend,
}: PrintControlsProps) {
  return (
    <footer className="print-controls">
      <dl>
        <dt>URL</dt>
        <dd>
          :
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
          />
        </dd>
      </dl>
      <dl>
        <dt>Paper Type</dt>
        <dd>
          :
          <select
            value={paperType}
            onChange={(e) => onPaperTypeChange(e.target.value as PaperType)}
          >
            <option value="">-</option>
            <option value="normal">Normal</option>
            <option value="black_mark">Black Mark</option>
            <option value="black_mark_and_detect_at_power_on">
              Black Mark and Detect at Power On
            </option>
            <option value="gap">Gap</option>
            <option value="gap_and_detect_at_power_on">
              Gap and Detect at Power On
            </option>
          </select>
        </dd>
      </dl>
      <input id="sendBtn" type="button" value="Send" onClick={onSend} />
    </footer>
  );
}
