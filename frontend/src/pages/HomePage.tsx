import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <Box>
            <Typography variant="h1">Home Page</Typography>
            <Link to="/register">Register</Link>
        </Box>
    )
}

export default HomePage;