/**
 * importSession.ts — reads a user-supplied File, parses it as JSON, and validates
 * it against the BugHuntSession schema.
 *
 * Returns a ValidationResult so callers can display precise error messages without
 * catching exceptions themselves.
 *
 * Security notes:
 *   - The file content is parsed with JSON.parse (safe — no eval)
 *   - The parsed value is passed to validateSession which checks every field
 *     before the result is used as application state
 *   - Only .json files / application/json MIME types are accepted
 */
import { validateSession, type ValidationResult } from "./validateSession";

export function parseAndValidateFile(file: File): Promise<ValidationResult> {
  return new Promise((resolve) => {
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      resolve({ ok: false, error: "Only .json files are supported." });
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") {
        resolve({ ok: false, error: "Failed to read file contents." });
        return;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        resolve({ ok: false, error: "Invalid JSON: the file could not be parsed." });
        return;
      }

      resolve(validateSession(parsed));
    };

    reader.onerror = () => {
      resolve({ ok: false, error: "Failed to read the file. Please try again." });
    };

    reader.readAsText(file);
  });
}
