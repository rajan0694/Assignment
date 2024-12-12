import React, { useState, useEffect } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  
  useEffect(() => {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  
  const saveContent = () => {
    const content = editorState.getCurrentContent();
    const rawContent = convertToRaw(content);
    localStorage.setItem('editorContent', JSON.stringify(rawContent));
    alert('The Text is saved Successfully!!');
  };

  
  const handleBeforeInput = (chars) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const block = currentContent.getBlockForKey(blockKey);
    const blockText = block.getText();

    if (chars === ' ' && blockText === '#') {
      setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'));
      return 'handled';
    } else if (chars === ' ' && blockText === '*') {
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
      return 'handled';
    } else if (chars === ' ' && blockText === '**') {
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'RED_TEXT'));
      return 'handled';
    } else if (chars === ' ' && blockText === '***') {
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
      
      return 'handled';
    }

    return 'not-handled'; 
  };

  const customStyleMap = {
    RED_TEXT: { color: 'red' },
  };

  return (
    <div>
      <h1>My Editor</h1>
      <h2> Plese Enter your text with the following functions : </h2>
      <p1> 1. Heading (# + space) 2.Bold (* + space), 3. Red Text (** + space), 4. Underline (*** + space)</p1> <br></br>
      <p2>To execeute next line reset the editor by running previous command with a space then proceed</p2>
      <div style={{ border: '1px solid black', minHeight: '200px', padding: '10px' }}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={customStyleMap}
        />
      </div>
      <button onClick={saveContent} style={{ marginTop: '10px' }}>
        Save
      </button>
    </div>
  );
};

export default DraftEditor;
