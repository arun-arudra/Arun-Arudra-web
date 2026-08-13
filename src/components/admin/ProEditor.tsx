import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  Bold, Italic, Heading1, Heading2, Heading3, ImageIcon, 
  Table as TableIcon, List, ListOrdered, Quote, Code, 
  Minus, Undo, Redo, Link as LinkIcon, Strikethrough 
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ProEditor({ content, onChange }: any) {
  const [view, setView] = useState<'editor' | 'preview'>('editor');
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);

  const editor = useEditor({
    extensions: [StarterKit, Image, Table.configure({ resizable: true }), TableRow, TableCell, TableHeader],
    content: content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const loadContentfulAssets = async () => {
    const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
    const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
    const res = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setAssets(data.items);
    setIsMediaOpen(true);
  };

  const ToolbarButton = ({ onClick, icon: Icon, label }: any) => (
    <button onClick={onClick} className="p-3 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 rounded-lg text-zinc-300" title={label}>
      <Icon className="w-6 h-6" />
    </button>
  );

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
      <div className="flex border-b border-zinc-800">
        <button onClick={() => setView('editor')} className={`px-6 py-3 ${view === 'editor' ? 'bg-zinc-900 border-b-2 border-white' : ''}`}>Editor</button>
        <button onClick={() => setView('preview')} className={`px-6 py-3 ${view === 'preview' ? 'bg-zinc-900 border-b-2 border-white' : ''}`}>Preview</button>
      </div>

      {view === 'editor' && (
        <div className="flex flex-wrap gap-2 p-3 border-b border-zinc-800">
          <ToolbarButton icon={Heading1} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} label="H1" />
          <ToolbarButton icon={Heading2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="H2" />
          <ToolbarButton icon={Bold} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold" />
          <ToolbarButton icon={Italic} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic" />
          <ToolbarButton icon={Strikethrough} onClick={() => editor.chain().focus().toggleStrike().run()} label="Strike" />
          <ToolbarButton icon={Quote} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="Quote" />
          <ToolbarButton icon={List} onClick={() => editor.chain().focus().toggleBulletList().run()} label="List" />
          <ToolbarButton icon={ListOrdered} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Ordered" />
          <ToolbarButton icon={TableIcon} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()} label="Table" />
          <ToolbarButton icon={Undo} onClick={() => editor.chain().focus().undo().run()} label="Undo" />
          <ToolbarButton icon={Redo} onClick={() => editor.chain().focus().redo().run()} label="Redo" />
          <ToolbarButton icon={ImageIcon} onClick={loadContentfulAssets} label="Insert Media" />
        </div>
      )}

      <div className="p-6 min-h-[500px]">
        {view === 'editor' ? <EditorContent editor={editor} className="prose prose-invert max-w-none" /> : <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />}
      </div>

      {isMediaOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 p-10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold">Select Media from Contentful</h2>
             <Button onClick={() => setIsMediaOpen(false)}>Close</Button>
          </div>
          <div className="grid grid-cols-4 gap-4 overflow-y-auto">
            {assets.map((asset: any) => (
              <img key={asset.sys.id} src={asset.fields.file['en-US'].url} className="cursor-pointer border border-zinc-700 hover:border-white h-40 object-cover" 
                   onClick={() => { editor.chain().focus().setImage({ src: asset.fields.file['en-US'].url }).run(); setIsMediaOpen(false); }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}