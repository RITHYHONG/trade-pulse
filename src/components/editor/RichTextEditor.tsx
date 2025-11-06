'use client';

import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { BarChart3, LayoutGrid } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import 'react-quill-new/dist/quill.snow.css';
import './editor.css';

// Dynamic import to avoid SSR issues - using react-quill-new for React 19 compatibility
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Type for Quill toolbar handler context
interface QuillToolbarHandler {
  quill: {
    getSelection: () => { index: number; length: number } | null;
    insertText: (index: number, text: string, source?: string) => void;
    setSelection: (index: number) => void;
  };
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing your market analysis...',
  className = ''
}: RichTextEditorProps) {

  // Memoize modules to prevent recreation on every render
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
        // Trading-specific buttons
        ['chart', 'widget']
      ],
      handlers: {
        'chart': function(this: QuillToolbarHandler) {
          const quill = this.quill;
          const range = quill.getSelection();
          if (range) {
            // Insert TradingView chart placeholder
            quill.insertText(range.index, '\n[TradingView Chart]\n', 'user');
            quill.setSelection(range.index + 21);
          }
        },
        'widget': function(this: QuillToolbarHandler) {
          const quill = this.quill;
          const range = quill.getSelection();
          if (range) {
            // Insert widget placeholder
            quill.insertText(range.index, '\n[Market Widget]\n', 'user');
            quill.setSelection(range.index + 17);
          }
        }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = useMemo(() => [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    // Quill registers the 'list' format; individual list types (ordered/bullet)
    // are values of the 'list' format. Do not include 'bullet' here or
    // Quill will complain that 'bullet' is not a registered format.
    'list',
    'script',
    'indent',
    'color', 'background',
    'align',
    'link', 'image', 'video'
  ], []);

  // Add custom icons for trading tools
  useEffect(() => {
    if (typeof window !== 'undefined') {
      interface QuillWindow extends Window {
        Quill?: {
          import: (path: string) => Record<string, string>;
        };
      }
      const Quill = (window as QuillWindow).Quill;
      const icons = Quill?.import('ui/icons');
      if (icons) {
        // Convert React Icons to SVG strings for Quill
        icons['chart'] = renderToString(
          <BarChart3 className="ql-stroke" size={18} strokeWidth={2} />
        );
        icons['widget'] = renderToString(
          <LayoutGrid className="ql-stroke" size={18} strokeWidth={2} />
        );
      }
    }
  }, []);

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="quill-editor-dark"
        preserveWhitespace
      />
    </div>
  );
}
