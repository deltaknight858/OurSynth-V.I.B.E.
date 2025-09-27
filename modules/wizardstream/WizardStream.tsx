import React, { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./WizardStream.module.css";

export interface WizardStreamProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    type: "svg" | "image" | "custom";
    data: string | React.ReactNode;
  };
  onEdit?: (updated: string | React.ReactNode) => void;
  onRegenerate?: () => void;
  title?: string;
}

export const WizardStream: React.FC<WizardStreamProps> = ({
  isOpen,
  onClose,
  content,
  onEdit,
  onRegenerate,
  title = "Preview",
}) => {
  const [editMode, setEditMode] = useState(false);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.wizardstreamBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className={styles.wizardstreamModal}>
        <header className={styles.wizardstreamHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Close preview">
            ✕
          </button>
        </header>

  <div className={styles.wizardstreamContent}>
          {content.type === "svg" && typeof content.data === "string" && (
            <div
              className={styles.wizardstreamSvg}
              data-testid="wizardstream-preview"
              dangerouslySetInnerHTML={{ __html: content.data }}
            />
          )}

          {content.type === "image" && typeof content.data === "string" && (
            <img src={content.data} alt="Generated preview" className={styles.wizardstreamSvg} />
          )}

          {content.type === "custom" && React.isValidElement(content.data) && (
            <div className={styles.wizardstreamCustom}>{content.data}</div>
          )}
        </div>

  <footer className={styles.wizardstreamFooter}>
          {onEdit && (
            <button onClick={() => setEditMode(!editMode)}>
              {editMode ? "Done Editing" : "Edit"}
            </button>
          )}
          {onRegenerate && (
            <button onClick={onRegenerate}>Regenerate</button>
          )}
        </footer>

        {editMode && onEdit && (
          <div className={styles.wizardstreamEditor}>
            {/* Example: simple textarea for SVG editing */}
            {content.type === "svg" && typeof content.data === "string" && (
              <textarea
                defaultValue={content.data}
                onBlur={(e) => onEdit(e.target.value)}
                placeholder="Edit SVG markup here"
                className={styles.wizardstreamEditorTextarea}
              />
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
