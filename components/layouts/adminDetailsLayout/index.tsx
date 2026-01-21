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
import { fetchAdminDetails } from "@/redux/slices/adminSlice";

export default function AdminDetailsLayout() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { detailsLoading, selectedAdminDetails, error } = useSelector(
        (state: RootState) => state.admin
    );

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchAdminDetails({ id: id as string, role: "ADMIN" }));
        }
    }, [id, dispatch]);

    const commonStyles = {
        fontFamily: "var(--font-primary) !important",
        color: COLORS.TEXT_PRIMARY,
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: COLORS.FOREGROUND }}>
            {/* Desktop Sidebar */}
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

            {/* Mobile Sidebar */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
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
                                Admin Information
                            </Typography>
                            <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: 'var(--font-primary)' }}>
                                View and manage administrator profile and assigned crew
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
                    ) : selectedAdminDetails ? (
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '350px 1fr' }, gap: 3 }}>
                            {/* Left Column - Admin Profile Card */}
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
                                        height: '80px',
                                        background: `linear-gradient(45deg, ${COLORS.ACCENT}, #64b5f6)`,
                                        opacity: 0.1
                                    }} />

                                    <Stack alignItems="center" spacing={2} sx={{ pt: 2 }}>
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                bgcolor: COLORS.ACCENT,
                                                borderRadius: '24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: `0 8px 16px rgba(22, 93, 255, 0.2)`,
                                                color: COLORS.WHITE,
                                                fontSize: '2rem',
                                                fontWeight: 700
                                            }}
                                        >
                                            {(selectedAdminDetails.firstName?.[0] || selectedAdminDetails.name?.[0] || 'A').toUpperCase()}
                                        </Box>
                                        <Box textAlign="center">
                                            <Typography variant="h5" fontWeight={700} sx={commonStyles}>
                                                {selectedAdminDetails.name || `${selectedAdminDetails.firstName} ${selectedAdminDetails.lastName}`}
                                            </Typography>
                                            <Chip
                                                label={selectedAdminDetails.role}
                                                size="small"
                                                sx={{
                                                    mt: 1,
                                                    bgcolor: 'rgba(22, 93, 255, 0.1)',
                                                    color: COLORS.ACCENT,
                                                    fontWeight: 600,
                                                    borderRadius: '8px',
                                                    fontFamily: "var(--font-primary) !important",
                                                }}
                                            />
                                        </Box>
                                    </Stack>

                                    <Stack spacing={2.5} sx={{ mt: 4 }}>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Email Address
                                            </Typography>
                                            <Typography variant="body1" sx={{ ...commonStyles, fontWeight: 500, mt: 0.5 }}>
                                                {selectedAdminDetails.email}
                                            </Typography>
                                        </Box>

                                        {selectedAdminDetails.phone && (
                                            <Box>
                                                <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    Phone Number
                                                </Typography>
                                                <Typography variant="body1" sx={{ ...commonStyles, fontWeight: 500, mt: 0.5 }}>
                                                    {selectedAdminDetails.phone}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ pt: 2.5, borderTop: `1px solid ${COLORS.FOREGROUND}` }}>
                                            <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, display: 'block' }}>
                                                Registered On
                                            </Typography>
                                            <Typography variant="body2" sx={{ ...commonStyles, fontWeight: 500 }}>
                                                {selectedAdminDetails.createdAt ? new Date(selectedAdminDetails.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Stack>

                            {/* Right Column - Assigned Crew Members */}
                            <Box>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        bgcolor: COLORS.WHITE,
                                        border: `1px solid ${COLORS.FOREGROUND}`,
                                        borderRadius: "20px",
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                        height: '100%'
                                    }}
                                >
                                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" fontWeight={700} sx={commonStyles}>
                                            Assigned Crew Members
                                        </Typography>
                                        <Chip
                                            label={`${selectedAdminDetails.crewMembers?.length || 0} Members`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 600 }}
                                        />
                                    </Box>

                                    {selectedAdminDetails.crewMembers && selectedAdminDetails.crewMembers.length > 0 ? (
                                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                            {selectedAdminDetails.crewMembers.map((crew: any) => (
                                                <Box
                                                    key={crew.id}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '16px',
                                                        border: `1px solid ${COLORS.FOREGROUND}`,
                                                        bgcolor: 'rgba(0,0,0,0.01)',
                                                        '&:hover': {
                                                            borderColor: COLORS.ACCENT,
                                                            bgcolor: COLORS.WHITE,
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                            transform: 'translateY(-2px)'
                                                        },
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Box
                                                            sx={{
                                                                width: 44,
                                                                height: 44,
                                                                bgcolor: 'white',
                                                                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                                                borderRadius: '12px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: COLORS.ACCENT,
                                                                fontWeight: 700
                                                            }}
                                                        >
                                                            {crew.firstName?.[0]?.toUpperCase()}{crew.lastName?.[0]?.toUpperCase()}
                                                        </Box>
                                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                            <Typography variant="body1" fontWeight={600} noWrap sx={commonStyles}>
                                                                {crew.firstName} {crew.lastName}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, display: 'block' }} noWrap>
                                                                {crew.email}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    {crew.ship && (
                                                        <Box sx={{
                                                            mt: 2,
                                                            p: 1.5,
                                                            bgcolor: COLORS.FOREGROUND,
                                                            borderRadius: '12px',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Box>
                                                                <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, display: 'block', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>
                                                                    Assigned Ship
                                                                </Typography>
                                                                <Typography variant="body2" fontWeight={600} sx={{ color: COLORS.TEXT_PRIMARY }}>
                                                                    {crew.ship.name}
                                                                </Typography>
                                                            </Box>
                                                            <Box textAlign="right">
                                                                <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, display: 'block', fontSize: '0.65rem' }}>
                                                                    IMO
                                                                </Typography>
                                                                <Typography variant="caption" fontWeight={700} sx={{ color: COLORS.ACCENT }}>
                                                                    {crew.ship.IMO}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box sx={{
                                            py: 8,
                                            textAlign: 'center',
                                            bgcolor: 'rgba(0,0,0,0.01)',
                                            borderRadius: '16px',
                                            border: `1px dashed ${COLORS.TEXT_SECONDARY}44`
                                        }}>
                                            <Typography variant="body1" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: 'var(--font-primary)' }}>
                                                No crew members assigned to this administrator.
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Box>
                        </Box>
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '15px' }}>
                            <Typography sx={commonStyles}>No admin details found.</Typography>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
