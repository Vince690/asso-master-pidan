"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link2, ImageIcon, Minus, Undo2, Redo2, Code } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { uploadImage } from "@/app/admin/actions";
import { compressImage, IMAGE_ACCEPT, isImageFile } from "@/lib/image-client";
import { cn } from "@/lib/utils";

/**
 * Éditeur d'article façon Notion : on écrit, on met en forme avec la barre, le HTML est
 * stocké dans un champ caché du formulaire (`name`).
 */
function Tool({ onClick, active, label, children }: { onClick: () => void; active?: boolean; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-white/10 hover:text-fg",
        active && "bg-white/15 text-fg",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Éditeur d'article façon Notion.
 */
export default function Editor({
  name,
  initialHtml,
  placeholder,
  onTextChange,
}: {
  name: string;
  initialHtml: string;
  placeholder?: string;
  onTextChange?: (text: string) => void;
}) {
  const [html, setHtml] = useState(initialHtml);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  // L'éditeur est créé avant addImage : les gestionnaires de dépôt passent par cette référence
  const addImageRef = useRef<(file: File) => void>(() => {});
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Commencez à écrire votre article…" }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: { class: "prose-pidan tiptap max-w-none" },
      // Une image déposée ou collée dans le texte est envoyée comme avec le bouton Image
      handleDrop: (_view, event) => {
        const file = Array.from(event.dataTransfer?.files ?? []).find(isImageFile);
        if (!file) return false;
        event.preventDefault();
        addImageRef.current(file);
        return true;
      },
      handlePaste: (_view, event) => {
        const file = Array.from(event.clipboardData?.files ?? []).find(isImageFile);
        if (!file) return false;
        event.preventDefault();
        addImageRef.current(file);
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
      onTextChange?.(editor.getText());
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Adresse du lien", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  /** Image : choisie sur l'appareil, compressée dans le navigateur, stockée avec le site, insérée à la position du curseur. */
  const addImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      setUploading("Envoi de l'image…");
      try {
        const body = new FormData();
        body.append("file", await compressImage(file, "illustration"));
        const res = await uploadImage(body);
        if ("error" in res) throw new Error(res.error);
        editor.chain().focus().setImage({ src: res.url }).run();
        setUploading(null);
      } catch (e) {
        setUploading(e instanceof Error ? e.message : "Envoi impossible.");
        setTimeout(() => setUploading(null), 4000);
      } finally {
        if (fileInput.current) fileInput.current.value = "";
      }
    },
    [editor],
  );

  useEffect(() => {
    addImageRef.current = addImage;
  }, [addImage]);

  if (!editor) {
    return <div className="glass min-h-96 animate-pulse rounded-2xl" />;
  }

  return (
    <div className="glass rounded-2xl">
      <input type="hidden" name={name} value={html} />
      <div className="sticky top-2 z-10 m-2 flex flex-wrap items-center gap-0.5 rounded-xl bg-ink-1/90 p-1 backdrop-blur-md">
        <Tool label="Gras" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={15} />
        </Tool>
        <Tool label="Italique" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={15} />
        </Tool>
        <span className="mx-1 h-5 w-px bg-line" />
        <Tool
          label="Titre"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </Tool>
        <Tool
          label="Sous-titre"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={15} />
        </Tool>
        <span className="mx-1 h-5 w-px bg-line" />
        <Tool label="Liste" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={15} />
        </Tool>
        <Tool
          label="Liste numérotée"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </Tool>
        <Tool label="Citation" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={15} />
        </Tool>
        <Tool label="Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code size={15} />
        </Tool>
        <span className="mx-1 h-5 w-px bg-line" />
        <Tool label="Lien" active={editor.isActive("link")} onClick={setLink}>
          <Link2 size={15} />
        </Tool>
        <Tool label="Image" onClick={() => fileInput.current?.click()}>
          <ImageIcon size={15} />
        </Tool>
        <input
          ref={fileInput}
          type="file"
          accept={IMAGE_ACCEPT}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && addImage(e.target.files[0])}
        />
        <Tool label="Séparateur" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={15} />
        </Tool>
        <span className="mx-1 h-5 w-px bg-line" />
        <Tool label="Annuler" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={15} />
        </Tool>
        <Tool label="Rétablir" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={15} />
        </Tool>
        {uploading && <span className="ml-2 text-xs text-fg-muted">{uploading}</span>}
      </div>
      <div className="px-6 pb-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
