"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TiptapImage from "@tiptap/extension-image";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  content: string;
  onChange: (html: string) => void;
};

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
      <Button
        type="button" size="sm"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </Button>
      <Button
        type="button" size="sm"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </Button>
      <span className="mx-1 w-px self-stretch bg-slate-200" />
      <Button
        type="button" size="sm"
        variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        ≡
      </Button>
      <Button
        type="button" size="sm"
        variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        ≡
      </Button>
      <Button
        type="button" size="sm"
        variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        ≡
      </Button>
      <span className="mx-1 w-px self-stretch bg-slate-200" />
      <Button
        type="button" size="sm" variant="ghost"
        onClick={() => {
          const url = prompt("請輸入圖片 URL:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        🖼 插入圖片
      </Button>
    </div>
  );
}

export function TiptapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TiptapImage,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      {editor && <Toolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-3 [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:outline-none"
      />
    </div>
  );
}
