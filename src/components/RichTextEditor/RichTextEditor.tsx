import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Divider, styled, Tooltip, IconButton } from '@mui/material';
import { 
  FormatBoldRounded, 
  FormatItalicRounded, 
  FormatUnderlinedRounded, 
  FormatListBulletedRounded, 
  FormatListNumberedRounded, 
  FormatQuoteRounded, 
  CodeRounded, 
  LooksOneRounded, 
  LooksTwoRounded, 
  LinkRounded, 
  UndoRounded, 
  RedoRounded 
} from '@mui/icons-material';

const EditorWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.light}20`,
  },
  '& .ProseMirror': {
    padding: theme.spacing(2),
    minHeight: '200px',
    outline: 'none',
    fontSize: '0.875rem',
    '& p.is-editor-empty:first-of-type::before': {
      content: 'attr(data-placeholder)',
      float: 'left',
      color: theme.palette.text.disabled,
      pointerEvents: 'none',
      height: 0,
    },
    '& pre': {
      background: '#0f172a',
      color: '#f8fafc',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      fontFamily: theme.typography.fontFamily,
    },
    '& code': {
      backgroundColor: theme.palette.action.hover,
      padding: '0.2em 0.4em',
      borderRadius: '3px',
      fontSize: '85%',
    }
  }
}));

const ToolbarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  backgroundColor: '#f8fafc',
}));

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  sx?: any;
  minHeight?: string | number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder,
  sx,
  minHeight = '200px'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <EditorWrapper sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      ...sx,
      '& .ProseMirror': {
        ...sx?.['& .ProseMirror'],
        minHeight: minHeight,
        flexGrow: 1
      }
    }}>
      <ToolbarContainer>
        <ToggleButtonGroup size="small">
          <Tooltip title="Bold">
            <ToggleButton 
              value="bold" 
              selected={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <FormatBoldRounded sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Italic">
            <ToggleButton 
              value="italic" 
              selected={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <FormatItalicRounded sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Underline">
            <ToggleButton 
              value="underline" 
              selected={editor.isActive('underline')}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <FormatUnderlinedRounded sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        <ToggleButtonGroup size="small">
          <Tooltip title="Heading 1">
            <ToggleButton 
              value="h1" 
              selected={editor.isActive('heading', { level: 1 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <LooksOneRounded sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Heading 2">
            <ToggleButton 
              value="h2" 
              selected={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <LooksTwoRounded sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        <ToggleButtonGroup size="small">
          <Tooltip title="Bullet List">
            <ToggleButton 
              value="bullet" 
              selected={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <FormatListBulletedRounded sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Ordered List">
            <ToggleButton 
              value="ordered" 
              selected={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <FormatListNumberedRounded sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        <ToggleButtonGroup size="small">
          <Tooltip title="Quote">
            <ToggleButton 
              value="quote" 
              selected={editor.isActive('blockquote')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <FormatQuoteRounded sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Code Block">
            <ToggleButton 
              value="code" 
              selected={editor.isActive('codeBlock')}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <CodeRounded sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <UndoRounded sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <RedoRounded sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </ToolbarContainer>
      <EditorContent editor={editor} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }} />
    </EditorWrapper>
  );
};
