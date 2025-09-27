import React, { useState } from "react";

interface RichTextNodeEditorProps {
  initialValue?: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export default function RichTextNodeEditor({ initialValue = "", onSave, onCancel }: RichTextNodeEditorProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="bg-background p-4 rounded shadow-lg max-w-lg mx-auto">
      <textarea
        className="border w-full h-40 p-2 rounded mb-2"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Type your note here..."
      />
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-1 rounded bg-muted">Cancel</button>
        <button onClick={() => onSave(value)} className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
      </div>
    </div>
  );
}