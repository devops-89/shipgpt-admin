"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/widgets/Sidebar";
import Navbar from "@/components/widgets/Navbar";
import {
    Box,
    Typography,
    IconButton,
    Stack,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Drawer,
    Button,
    Paper,
    Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { COLORS } from "@/utils/enum";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserDetails } from "@/redux/slices/userSlice";

export default function UserDetailsLayout() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { detailsLoading, selectedUserDetails, error } = useSelector(
        (state: RootState) => state.user
    );

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchUserDetails({ id: id as string, role: 'USER' }));
        }
    }, [id, dispatch]);

    const commonStyles = {
        fontFamily: "var(--font-primary) !important",
        color: COLORS.TEXT_PRIMARY,
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: COLORS.FOREGROUND }}>
            {!isMobile && (
                <Box
                    sx={{
                        width: "260px",
                        height: "100%",
                        overflowY: "auto",
                        borderRight: `1px solid ${COLORS.FOREGROUND}`,
                        bgcolor: COLORS.WHITE,
                    }}
                >
                    <Sidebar />
                </Box>
            )}

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: 260,
                        bgcolor: COLORS.WHITE,
                    },
                }}
            >
                <Sidebar />
            </Drawer>

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: isMobile ? "100%" : "calc(100% - 260px)",
                    height: "100%",
                    overflow: "hidden",
                }}
            >
                <Navbar onMenuClick={handleDrawerToggle} />

                <Box
                    sx={{
                        p: { xs: 2, md: 4 },
                        flexGrow: 1,
                        overflowY: "auto",
                        bgcolor: COLORS.FOREGROUND,
                    }}
                >
                    <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton
                            onClick={() => router.back()}
                            sx={{
                                color: COLORS.ACCENT,
                                bgcolor: COLORS.WHITE,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                '&:hover': { bgcolor: COLORS.WHITE, transform: 'translateX(-2px)' },
                                transition: 'all 0.2s'
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" fontWeight={800} sx={{ ...commonStyles, letterSpacing: '-0.5px' }}>
                                User Profile
                            </Typography>
                            <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: 'var(--font-primary)' }}>
                                Detailed view of the user account and associated information
                            </Typography>
                        </Box>
                    </Box>

                    {detailsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                            <CircularProgress size={60} thickness={4} sx={{ color: COLORS.ACCENT }} />
                        </Box>
                    ) : error ? (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '15px' }}>
                            <Typography color="error" variant="h6" sx={commonStyles}>{error}</Typography>
                            <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2, bgcolor: COLORS.ACCENT }}>Retry</Button>
                        </Paper>
                    ) : selectedUserDetails ? (
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '400px 1fr' }, gap: 3 }}>
                            {/* Left Column - User Info */}
                            <Stack spacing={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        bgcolor: COLORS.WHITE,
                                        border: `1px solid ${COLORS.FOREGROUND}`,
                                        borderRadius: "20px",
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100px',
                                        background: `linear-gradient(45deg, #FF6B6B, #FFB84D)`,
                                        opacity: 0.1
                                    }} />

                                    <Stack alignItems="center" spacing={2} sx={{ pt: 3 }}>
                                        <Box
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                bgcolor: '#FF6B6B',
                                                borderRadius: '30px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: `0 10px 20px rgba(255, 107, 107, 0.2)`,
                                                color: COLORS.WHITE,
                                                fontSize: '2.5rem',
                                                fontWeight: 800
                                            }}
                                        >
                                            {(selectedUserDetails.firstName?.[0] || selectedUserDetails.name?.[0] || 'U').toUpperCase()}
                                        </Box>
                                        <Box textAlign="center">
                                            <Typography variant="h5" fontWeight={700} sx={commonStyles}>
                                                {selectedUserDetails.name || `${selectedUserDetails.firstName} ${selectedUserDetails.lastName}`}
                                            </Typography>
                                            <Chip
                                                label={selectedUserDetails.role}
                                                size="small"
                                                sx={{
                                                    mt: 1,
                                                    bgcolor: 'rgba(255, 107, 107, 0.1)',
                                                    color: '#FF6B6B',
                                                    fontWeight: 600,
                                                    borderRadius: '8px',
                                                    fontFamily: "var(--font-primary) !important",
                                                }}
                                            />
                                        </Box>
                                    </Stack>

                                    <Stack spacing={3} sx={{ mt: 5 }}>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>
                                                Email Address
                                            </Typography>
                                            <Typography variant="body1" sx={{ ...commonStyles, fontWeight: 500, mt: 0.5 }}>
                                                {selectedUserDetails.email}
                                            </Typography>
                                        </Box>

                                        {selectedUserDetails.phone && (
                                            <Box>
                                                <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>
                                                    Phone Number
                                                </Typography>
                                                <Typography variant="body1" sx={{ ...commonStyles, fontWeight: 500, mt: 0.5 }}>
                                                    {selectedUserDetails.phone}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ pt: 3, borderTop: `1px solid ${COLORS.FOREGROUND}` }}>
                                            <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, display: 'block', mb: 0.5 }}>
                                                Account Status
                                            </Typography>
                                            <Chip
                                                label={selectedUserDetails.isActive ? "Active" : "Inactive"}
                                                size="small"
                                                sx={{
                                                    bgcolor: selectedUserDetails.isActive ? '#e8f5e9' : '#ffebee',
                                                    color: selectedUserDetails.isActive ? '#2e7d32' : '#c62828',
                                                    fontWeight: 700,
                                                    borderRadius: '6px'
                                                }}
                                            />
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Stack>

                            {/* Right Column - Additional Details */}
                            <Stack spacing={3}>
                                {selectedUserDetails.ship && (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 4,
                                            bgcolor: COLORS.WHITE,
                                            border: `1px solid ${COLORS.FOREGROUND}`,
                                            borderRadius: "20px",
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight={700} sx={{ ...commonStyles, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 4, height: 24, bgcolor: COLORS.ACCENT, borderRadius: 2 }} />
                                            Assigned Ship Details
                                        </Typography>

                                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                                            <Box sx={{ p: 2.5, bgcolor: COLORS.FOREGROUND, borderRadius: '16px' }}>
                                                <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    Ship Name
                                                </Typography>
                                                <Typography variant="h6" fontWeight={700} sx={{ ...commonStyles, mt: 1 }}>
                                                    {selectedUserDetails.ship.name}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 2.5, bgcolor: COLORS.FOREGROUND, borderRadius: '16px' }}>
                                                <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    IMO Number
                                                </Typography>
                                                <Typography variant="h6" fontWeight={700} sx={{ ...commonStyles, mt: 1, color: COLORS.ACCENT }}>
                                                    {selectedUserDetails.ship.IMO}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {selectedUserDetails.ship.logo && (
                                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                                <img
                                                    src={selectedUserDetails.ship.logo}
                                                    alt="Ship Logo"
                                                    style={{ maxHeight: '60px', borderRadius: '8px' }}
                                                />
                                            </Box>
                                        )}
                                    </Paper>
                                )}

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        bgcolor: COLORS.WHITE,
                                        border: `1px solid ${COLORS.FOREGROUND}`,
                                        borderRadius: "20px",
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={700} sx={{ ...commonStyles, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ width: 4, height: 24, bgcolor: '#9c27b0', borderRadius: 2 }} />
                                        System Metadata
                                    </Typography>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 600 }}>
                                                Created At
                                            </Typography>
                                            <Typography variant="body1" sx={{ ...commonStyles, fontWeight: 500, mt: 0.5 }}>
                                                {selectedUserDetails.createdAt ? new Date(selectedUserDetails.createdAt).toLocaleString() : 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 600 }}>
                                                Last Updated
                                            </Typography>
                                            <Typography variant="body1" sx={{ ...commonStyles, fontWeight: 500, mt: 0.5 }}>
                                                {selectedUserDetails.updatedAt ? new Date(selectedUserDetails.updatedAt).toLocaleString() : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Stack>
                        </Box>
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '15px' }}>
                            <Typography sx={commonStyles}>No user details found.</Typography>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
