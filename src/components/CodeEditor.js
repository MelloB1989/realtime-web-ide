import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import Editor from "@monaco-editor/react";

import ACTIONS from '../Actions';

const CodeEditor = ({ socketRef, roomId, onCodeChange }) => {

    const [value, setValue] = useState("");

    const handleEditorChange = (value) => {
        setValue(value);
        onCodeChange(value);
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId: roomId,
            code: value,
        });
    };

    const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor; 
  }

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                console.log(code);
                if (code !== null) {
                    setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);


    return <Editor
    height="90vh"
    defaultLanguage="javascript"
    defaultValue="// some comment"
    value={value}
    onMount={handleEditorDidMount}
    onChange={handleEditorChange}
  />;
};

export default CodeEditor;
