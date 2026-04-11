import CodeMirror from '@uiw/react-codemirror';
import { Box, Typography } from '@mui/material';
import { finqlCodemirrorExtensions } from '../finql/finqlCodemirror';

interface FinqlQueryEditorProps {
    label?: string;
    value: string;
    onChange: (nextValue: string) => void;
    minHeight?: number;
}

function FinqlQueryEditor({
    label = 'Query',
    value,
    onChange,
    minHeight = 280,
}: FinqlQueryEditorProps) {
    return (
        <Box>
            {label ? (
                <Typography
                    component="label"
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 0.75 }}
                >
                    {label}
                </Typography>
            ) : null}
            <CodeMirror
                value={value}
                height={`${minHeight}px`}
                extensions={finqlCodemirrorExtensions}
                onChange={(documentText) => onChange(documentText)}
                spellCheck={false}
            />
        </Box>
    );
}

export default FinqlQueryEditor;
