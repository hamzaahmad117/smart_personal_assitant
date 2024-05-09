import { Typography, CircularProgress, Box } from "@mui/material";

const SuspenseLoader = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <CircularProgress />
            <Typography>Loading...</Typography>
        </Box>
    );
};

export default SuspenseLoader;
