'use client'

/**
 * CODE EDITOR COMPONENT
 *
 * A syntax-highlighted code editor using CodeMirror
 * Supports multiple languages with auto-detection
 */

import { useCallback, useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { json } from '@codemirror/lang-json'
import {LanguageSupport} from "@codemirror/language";

interface CodeEditorProps {
    value: string
    onChange: (value: string) => void
    language?: string
    readOnly?: boolean
    height?: string
}

export function CodeEditor({
                               value,
                               onChange,
                               language = 'javascript',
                               readOnly = false,
                               height = '300px',
                           }: CodeEditorProps) {
    // Map language names to CodeMirror extensions
    const extensions = useMemo(() => {
        const langMap: Record<string, LanguageSupport> = {
            javascript: javascript({ jsx: true }),
            typescript: javascript({ typescript: true }),
            jsx: javascript({ jsx: true }),
            tsx: javascript({ typescript: true, jsx: true }),
            python: python(),
            html: html(),
            css: css(),
            json: json(),
        }

        return [langMap[language.toLowerCase()] || javascript()]
    }, [language])

    const handleChange = useCallback(
        (val: string) => {
            onChange(val)
        },
        [onChange]
    )

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            <CodeMirror
                value={value}
                height={height}
                extensions={extensions}
                onChange={handleChange}
                editable={!readOnly}
                basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightActiveLine: true,
                    foldGutter: true,
                }}
                theme="light"
                className="text-sm"
            />
        </div>
    )
}
