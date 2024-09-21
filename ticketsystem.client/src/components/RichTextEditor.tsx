import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's default styling

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
  styling?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue = "", onChange, styling }) => {
  const [value, setValue] = useState<string>(initialValue);

  const handleChange = (content: string) => {
    setValue(content);
    onChange(content);
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      className={styling}
      modules={{
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image'],
          [{ 'align': [] }]
                ]
      }}
    />
  );
};

export default RichTextEditor;
