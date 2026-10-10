import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import EntryEditorModal, { type EditorInitial } from "../components/EntryEditorModal";
import EntryViewModal, { type ViewableEntry } from "../components/EntryViewModal";
import ToastStack from "../components/Toast";
import { useEntryStore } from "../store/entry.store";
import type { Entry, EntryInput } from "../types/entry";

export interface NewEntryOptions extends EditorInitial {
  /** Placeholder text for the editor body, e.g. a writing prompt. */
  placeholder?: string;
  onSaved?: (entry: Entry) => void;
}

interface EntryUI {
  openNew: (opts?: NewEntryOptions) => void;
  openView: (entry: ViewableEntry) => void;
  toggleFavorite: (entry: Entry) => void;
  toast: (message: string) => void;
}

const Ctx = createContext<EntryUI | null>(null);

const isFullEntry = (e: ViewableEntry): e is Entry => "tags" in e && "status" in e;

/** Owns the editor, view and delete-confirm modals plus toasts, so any page can open them. */
export function EntryUIProvider({ children }: { children: ReactNode }) {
  const { createEntry, updateEntry, deleteEntry, loading, error, clearError } = useEntryStore();
  const [editor, setEditor] = useState<{ entry?: Entry; opts?: NewEntryOptions } | null>(null);
  const [viewing, setViewing] = useState<ViewableEntry | null>(null);
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const [toasts, setToasts] = useState<{ id: number; m: string }[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((m: string) => {
    const id = ++nextId.current;
    setToasts((t) => [...t, { id, m }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const closeEditor = () => {
    setEditor(null);
    clearError();
  };

  const openNew = (opts?: NewEntryOptions) => {
    clearError();
    setEditor({ opts });
  };

  const toggleFavorite = async (entry: Entry) => {
    if (await updateEntry(entry._id, { isFavorite: !entry.isFavorite })) {
      toast(entry.isFavorite ? "Removed from favorites" : "Added to favorites");
    } else {
      toast("Couldn't update favorite. Try again.");
    }
  };

  const handleSave = async (data: EntryInput) => {
    if (!editor) return;
    const draft = data.status === "draft";
    if (editor.entry) {
      if (await updateEntry(editor.entry._id, data)) {
        toast(draft ? "Draft saved" : "Entry updated");
        closeEditor();
      }
    } else {
      const created = await createEntry(data);
      if (created) {
        toast(draft ? "Draft saved" : "Entry saved");
        editor.opts?.onSaved?.(created);
        closeEditor();
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const ok = await deleteEntry(deleting._id);
    toast(ok ? "Entry deleted" : "Couldn't delete the entry. Try again.");
    setDeleting(null);
    if (ok) setViewing(null);
  };

  const full = viewing && isFullEntry(viewing) ? viewing : null;

  return (
    <Ctx.Provider value={{ openNew, openView: setViewing, toggleFavorite, toast }}>
      {children}

      {viewing && (
        <EntryViewModal
          entry={viewing}
          onClose={() => setViewing(null)}
          onEdit={full ? () => { setViewing(null); clearError(); setEditor({ entry: full }); } : undefined}
          onDelete={full ? () => setDeleting(full) : undefined}
        />
      )}

      {editor && (
        <EntryEditorModal
          key={editor.entry?._id ?? "new"}
          entry={editor.entry}
          initial={editor.opts}
          placeholder={editor.opts?.placeholder}
          saving={loading}
          error={error}
          onSave={handleSave}
          onCancel={closeEditor}
        />
      )}

      {deleting && (
        <ConfirmDialog title="Delete this entry?" message="This can't be undone." confirmLabel="Delete"
          onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
      )}

      <ToastStack messages={toasts.map((t) => t.m)} />
    </Ctx.Provider>
  );
}

export function useEntryUI(): EntryUI {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEntryUI must be used inside <EntryUIProvider>");
  return ctx;
}