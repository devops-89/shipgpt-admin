"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/widgets/Sidebar";
import Navbar from "@/components/widgets/Navbar";
import { scienceGothic } from "@/utils/fonts";
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
    Divider,
    Snackbar,
    Alert,
    AlertColor,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { COLORS } from "@/utils/enum";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCrewDetails, clearError } from "@/redux/slices/crewSlice";

export default function CrewDetailsLayout() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { detailsLoading, selectedCrewDetails, error } = useSelector(
        (state: RootState) => state.crew
    );

    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchCrewDetails({ id: id as string, role: 'CREW' }));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (error) {
            setSnackbar({ open: true, message: error, severity: "error" });
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const commonStyles = {
        fontFamily: "var(--font-primary) !important",
        color: COLORS.TEXT_PRIMARY,
    };

    return (
        <Box className={scienceGothic.className} sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: COLORS.FOREGROUND }}>
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
                                Crew Profile
                            </Typography>
                            <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: 'var(--font-primary)' }}>
                                View detailed information about the crew member and their assignment
                            </Typography>
                        </Box>
                    </Box>

                    {detailsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                            <CircularProgress size={60} thickness={4} sx={{ color: COLORS.ACCENT }} />
                        </Box>
                    ) : selectedCrewDetails ? (
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
                                        background: `linear-gradient(45deg, #4facfe, #00f2fe)`,
                                        opacity: 0.1
                                    }} />

                                    <Stack alignItems="center" spacing={2} sx={{ pt: 3 }}>
                                        <Box
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                bgcolor: '#4facfe',
                                                borderRadius: '30px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: `0 10px 20px rgba(79, 172, 254, 0.2)`,
                                                color: COLORS.WHITE,
                                                fontSize: '2.5rem',
                                                fontWeight: 800
                                            }}
                                        >
                                            {(selectedCrewDetails.firstName?.[0] || selectedCrewDetails.name?.[0] || 'C').toUpperCase()}
                                        </Box>
                                        <Box textAlign="center">
                                            <Typography variant="h5" fontWeight={700} sx={commonStyles}>
                                                {selectedCrewDetails.name || `${selectedCrewDetails.firstName} ${selectedCrewDetails.lastName}`}
                                            </Typography>
                                            <Chip
                                                label={selectedCrewDetails.role}
                                                size="small"
                                                sx={{
                                                    mt: 1,
                                                    bgcolor: 'rgba(79, 172, 254, 0.1)',
                                                    color: '#4facfe',
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
                                                {selectedCrewDetails.email}
                                            </Typography>
                                        </Box>

                                        {selectedCrewDetails.phone && (
                                            <Box>
                                                <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>
                                                    Phone Number
                                                </Typography>
                                                <Typography variant="body1" sx={{ ...commonStyles, fontWeight: 500, mt: 0.5 }}>
                                                    {selectedCrewDetails.phone}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ pt: 3, borderTop: `1px solid ${COLORS.FOREGROUND}` }}>
                                            <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, display: 'block', mb: 0.5 }}>
                                                Account Status
                                            </Typography>
                                            <Chip
                                                label={selectedCrewDetails.isActive ? "Active" : "Inactive"}
                                                size="small"
                                                sx={{
                                                    bgcolor: selectedCrewDetails.isActive ? '#e8f5e9' : '#ffebee',
                                                    color: selectedCrewDetails.isActive ? '#2e7d32' : '#c62828',
                                                    fontWeight: 700,
                                                    borderRadius: '6px'
                                                }}
                                            />
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Stack>

                            {/* Right Column - Assignment Details */}
                            <Stack spacing={3}>
                                {selectedCrewDetails.ship && (
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
                                                    {selectedCrewDetails.ship.name}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 2.5, bgcolor: COLORS.FOREGROUND, borderRadius: '16px' }}>
                                                <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    IMO Number
                                                </Typography>
                                                <Typography variant="h6" fontWeight={700} sx={{ ...commonStyles, mt: 1, color: COLORS.ACCENT }}>
                                                    {selectedCrewDetails.ship.IMO || selectedCrewDetails.ship.imo}
                                                </Typography>
                                            </Box>
                                        </Box>
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
                                                {selectedCrewDetails.createdAt ? new Date(selectedCrewDetails.createdAt).toLocaleString() : 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 600 }}>
                                                Last Updated
                                            </Typography>
                                            <Typography variant="body1" sx={{ ...commonStyles, fontWeight: 500, mt: 0.5 }}>
                                                {selectedCrewDetails.updatedAt ? new Date(selectedCrewDetails.updatedAt).toLocaleString() : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Stack>
                        </Box>
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '15px' }}>
                            <Typography sx={commonStyles}>No crew details found.</Typography>
                        </Paper>
                    )}
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%", ...commonStyles, fontWeight: 500 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
