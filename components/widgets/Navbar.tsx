import { Box, Typography, Avatar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface NavbarProps {
    onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <Box
            sx={{
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                borderBottom: "1px solid var(--border)",
                bgcolor: "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {onMenuClick && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onMenuClick}
                        sx={{ display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography fontWeight={600}>ShipGPT</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2">ADMIN</Typography>
                <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
            </Box>
        </Box>
    );
}
