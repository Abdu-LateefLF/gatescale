import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import type { ApiKey } from '../types';

interface ApiKeysListProps {
    apiKeys: ApiKey[];
    onClickCreateNewKey: () => void;
}

function ApiKeysList({ apiKeys, onClickCreateNewKey }: ApiKeysListProps) {
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short',
        };
        return new Date(date).toLocaleString('en-US', options);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography>Your API Keys:</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClickCreateNewKey}
                >
                    Create New Key
                </Button>
            </Box>
            <TableContainer
                sx={{ marginTop: 2, width: '100%', overflowX: 'auto' }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>API Key</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Secret</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Expires At</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiKeys.map((apiKey) => (
                            <TableRow key={apiKey.id}>
                                <TableCell>{apiKey.key}</TableCell>
                                <TableCell>{apiKey.name}</TableCell>
                                <TableCell>{'*'.repeat(12)}</TableCell>
                                <TableCell>
                                    {formatDate(apiKey.createdAt)}
                                </TableCell>
                                <TableCell>
                                    {formatDate(apiKey.expiresAt)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ApiKeysList;
