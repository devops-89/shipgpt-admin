"use client";
import React, { useEffect, useState, useRef } from "react";
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
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    List,
    ListItem,
    ListItemSecondaryAction,
    Snackbar,
    Alert,
    AlertColor,
    Modal,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import PeopleIcon from "@mui/icons-material/People";
import { COLORS } from "@/utils/enum";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
    fetchShipDetails,
    assignCrewToShip,
    assignSuperintendentsToShip,
    clearError,
    fetchShips
} from "@/redux/slices/shipSlice";
import { fetchCrew } from "@/redux/slices/crewSlice";
import { fetchSuperintendents } from "@/redux/slices/superintendentSlice";
import { shipControllers } from "@/api/ship";

const CATEGORIES = ["Compliance", "Crewing", "Mechanical"];

export default function ShipDetailsLayout() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, selectedShip, error } = useSelector((state: RootState) => state.ship);
    const { crew } = useSelector((state: RootState) => state.crew);
    const { superintendents } = useSelector((state: RootState) => state.superintendent);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [imo, setImo] = useState("");
    const [selectedCrewIds, setSelectedCrewIds] = useState<(string | number)[]>([]);
    const [selectedSuperintendentIds, setSelectedSuperintendentIds] = useState<(string | number)[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [pendingDocuments, setPendingDocuments] = useState<Record<string, any[]>>({
        Compliance: [],
        Crewing: [],
        Mechanical: [],
    });

    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
        open: false,
        message: "",
        severity: "success",
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const showMessage = (message: string, severity: AlertColor = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchShipDetails(id as string));
            dispatch(fetchCrew());
            dispatch(fetchSuperintendents());
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (selectedShip) {
            setName(selectedShip.name || "");
            setImo(selectedShip.IMO || selectedShip.imo || "");
            const crews = selectedShip.crewMembers || selectedShip.crews || [];
            setSelectedCrewIds(crews.map((c: any) => c._id || c.id));
            const supts = selectedShip.superintendents || [];
            setSelectedSuperintendentIds(supts.map((s: any) => s._id || s.id));
        }
    }, [selectedShip]);

    const handleUpdateShip = async () => {
        if (!id) return;
        try {
            const payload = { name, IMO: imo };
            await shipControllers.updateShip(id as string, payload);

            // Upload pending docs
            for (const [category, docs] of Object.entries(pendingDocuments)) {
                for (const doc of docs) {
                    const formData = new FormData();
                    formData.append("file", doc.file);
                    formData.append("shipId", id as string);
                    formData.append("type", category.toUpperCase());
                    await shipControllers.uploadPdf(formData);
                }
            }

            // Assign crew & supts
            await dispatch(assignCrewToShip({ shipId: id as string, crewIds: selectedCrewIds }));
            await dispatch(assignSuperintendentsToShip({ shipId: id as string, superintendentIds: selectedSuperintendentIds }));

            showMessage("Ship details updated successfully!");
            setIsEditing(false);
            setPendingDocuments({ Compliance: [], Crewing: [], Mechanical: [] });
            dispatch(fetchShipDetails(id as string));
        } catch (err: any) {
            showMessage(err.response?.data?.message || "Failed to update ship", "error");
        }
    };

    const handleDeleteShip = async () => {
        if (!id) return;
        try {
            await shipControllers.deleteShip(id as string);
            showMessage("Ship deleted successfully!");
            router.push("/ship-management");
            dispatch(fetchShips());
        } catch (err: any) {
            showMessage(err.response?.data?.message || "Failed to delete ship", "error");
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && selectedCategory) {
            const files = Array.from(e.target.files);
            const newDocs = files.map(file => ({ name: file.name, file }));
            setPendingDocuments(prev => ({
                ...prev,
                [selectedCategory]: [...(prev[selectedCategory] || []), ...newDocs]
            }));
            showMessage(`Added ${files.length} documents to ${selectedCategory}`);
        }
    };

    const commonStyles = {
        fontFamily: "var(--font-primary) !important",
        color: COLORS.TEXT_PRIMARY,
    };

    const textFieldStyle = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            color: COLORS.TEXT_PRIMARY,
            backgroundColor: COLORS.WHITE,
            fontFamily: "var(--font-primary) !important",
            "& fieldset": { borderColor: COLORS.FOREGROUND },
            "&:hover fieldset": { borderColor: COLORS.ACCENT },
            "&.Mui-focused fieldset": { borderColor: COLORS.ACCENT },
        },
        "& .MuiInputLabel-root": {
            color: COLORS.TEXT_SECONDARY,
            fontFamily: "var(--font-primary) !important",
        },
        "& .MuiInputLabel-root.Mui-focused": { color: COLORS.ACCENT },
    };

    const getDocumentsByCategory = () => {
        const docs: Record<string, any[]> = { Compliance: [], Crewing: [], Mechanical: [] };
        const raw = selectedShip?.pdfs || selectedShip?.documents || [];
        if (Array.isArray(raw)) {
            raw.forEach((doc: any) => {
                if (doc.type) {
                    const type = doc.type.charAt(0).toUpperCase() + doc.type.slice(1).toLowerCase();
                    if (docs[type]) docs[type].push(doc);
                }
            });
        }
        return docs;
    };

    const categorizedDocs = getDocumentsByCategory();

    return (
        <Box className={scienceGothic.className} sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: COLORS.FOREGROUND }}>
            {!isMobile && (
                <Box sx={{ width: "260px", height: "100%", overflowY: "auto", borderRight: `1px solid ${COLORS.FOREGROUND}`, bgcolor: COLORS.WHITE }}>
                    <Sidebar />
                </Box>
            )}

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: 260, bgcolor: COLORS.WHITE } }}
            >
                <Sidebar />
            </Drawer>

            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", width: isMobile ? "100%" : "calc(100% - 260px)", height: "100%", overflow: "hidden" }}>
                <Navbar onMenuClick={handleDrawerToggle} />

                <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1, overflowY: "auto", bgcolor: COLORS.FOREGROUND }}>
                    <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <IconButton onClick={() => router.back()} sx={{ bgcolor: COLORS.WHITE, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Box>
                                <Typography variant="h4" fontWeight={800} sx={{ ...commonStyles, letterSpacing: '-0.5px' }}>
                                    Ship Details
                                </Typography>
                                <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: 'var(--font-primary)' }}>
                                    Manage ship information, documents, and personnel
                                </Typography>
                            </Box>
                        </Stack>

                        {!isEditing && (
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    onClick={() => setIsEditing(true)}
                                    sx={{ bgcolor: COLORS.ACCENT, borderRadius: '10px', textTransform: 'none' }}
                                >
                                    Edit Details
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => setOpenDeleteModal(true)}
                                    sx={{ borderRadius: '10px', textTransform: 'none' }}
                                >
                                    Delete Ship
                                </Button>
                            </Stack>
                        )}
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                            <CircularProgress size={60} thickness={4} sx={{ color: COLORS.ACCENT }} />
                        </Box>
                    ) : selectedShip ? (
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' }, gap: 3 }}>
                            <Stack spacing={3}>
                                {/* Basic Info Card */}
                                <Paper elevation={0} sx={{ p: 4, borderRadius: "20px", border: `1px solid ${COLORS.FOREGROUND}` }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ ...commonStyles, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ width: 4, height: 24, bgcolor: COLORS.ACCENT, borderRadius: 2 }} />
                                        Information
                                    </Typography>

                                    {isEditing ? (
                                        <Stack spacing={3}>
                                            <TextField fullWidth label="Ship Name" value={name} onChange={(e) => setName(e.target.value)} sx={textFieldStyle} />
                                            <TextField fullWidth label="IMO Number" value={imo} onChange={(e) => setImo(e.target.value)} sx={textFieldStyle} />
                                        </Stack>
                                    ) : (
                                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 700, textTransform: 'uppercase' }}>Ship Name</Typography>
                                                <Typography variant="h6" fontWeight={700} sx={commonStyles}>{selectedShip.name}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: 700, textTransform: 'uppercase' }}>IMO Number</Typography>
                                                <Typography variant="h6" fontWeight={700} sx={{ ...commonStyles, color: COLORS.ACCENT }}>{selectedShip.IMO || selectedShip.imo}</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Paper>

                                {/* Documents Card */}
                                <Paper elevation={0} sx={{ p: 4, borderRadius: "20px", border: `1px solid ${COLORS.FOREGROUND}` }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="h6" fontWeight={700} sx={{ ...commonStyles, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 4, height: 24, bgcolor: '#9c27b0', borderRadius: 2 }} />
                                            Documents
                                        </Typography>
                                    </Box>

                                    {isEditing && (
                                        <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '15px', border: `1px dashed ${COLORS.FOREGROUND}` }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <FormControl sx={{ minWidth: 200, ...textFieldStyle }}>
                                                    <InputLabel>Category</InputLabel>
                                                    <Select value={selectedCategory} label="Category" onChange={(e) => setSelectedCategory(e.target.value)}>
                                                        {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                                <Button
                                                    component="label"
                                                    variant="contained"
                                                    startIcon={<CloudUploadIcon />}
                                                    disabled={!selectedCategory}
                                                    sx={{ bgcolor: COLORS.ACCENT, flexGrow: 1, borderRadius: '10px', py: 1.5 }}
                                                >
                                                    Add Documents
                                                    <input type="file" hidden multiple accept=".pdf" onChange={handleFileUpload} />
                                                </Button>
                                            </Stack>
                                        </Box>
                                    )}

                                    <Stack spacing={3}>
                                        {CATEGORIES.map(category => {
                                            const existing = categorizedDocs[category] || [];
                                            const pending = pendingDocuments[category] || [];
                                            if (existing.length === 0 && pending.length === 0) return null;

                                            return (
                                                <Box key={category}>
                                                    <Typography variant="subtitle2" sx={{ color: COLORS.TEXT_SECONDARY, mb: 1.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                        {category}
                                                    </Typography>
                                                    <List sx={{ bgcolor: COLORS.FOREGROUND, borderRadius: '15px', p: 1 }}>
                                                        {[...existing, ...pending].map((doc: any, idx) => (
                                                            <ListItem key={idx} sx={{ borderBottom: idx < (existing.length + pending.length - 1) ? `1px solid rgba(0,0,0,0.05)` : 'none' }}>
                                                                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                                                                    <InsertDriveFileIcon sx={{ color: COLORS.ACCENT }} />
                                                                    <Box sx={{ flexGrow: 1 }}>
                                                                        <Typography variant="body2" fontWeight={600} sx={commonStyles}>{doc.originalFileName || doc.name}</Typography>
                                                                        <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY }}>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'New Upload'}</Typography>
                                                                    </Box>
                                                                    {doc.downloadUrl && (
                                                                        <IconButton component="a" href={doc.downloadUrl} target="_blank" sx={{ color: COLORS.ACCENT }}>
                                                                            <DownloadIcon />
                                                                        </IconButton>
                                                                    )}
                                                                </Stack>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            )
                                        })}
                                    </Stack>
                                </Paper>
                            </Stack>

                            {/* Personnel Sidebar */}
                            <Stack spacing={3}>
                                <Paper elevation={0} sx={{ p: 4, borderRadius: "20px", border: `1px solid ${COLORS.FOREGROUND}` }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ ...commonStyles, mb: 3 }}>Assigned Personnel</Typography>

                                    {isEditing ? (
                                        <Stack spacing={4}>
                                            <FormControl fullWidth sx={textFieldStyle}>
                                                <InputLabel>Crew Members</InputLabel>
                                                <Select multiple value={selectedCrewIds} label="Crew Members" onChange={(e) => setSelectedCrewIds(e.target.value as any[])}
                                                    renderValue={(selected) => (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {(selected as any[]).map((v) => {
                                                                const m = crew.find(c => (c._id || c.id) === v);
                                                                return <Chip key={v} label={m ? `${m.firstName} ${m.lastName}` : v} size="small" />;
                                                            })}
                                                        </Box>
                                                    )}
                                                >
                                                    {crew.map(m => (
                                                        <MenuItem key={m._id || m.id} value={m._id || m.id}>
                                                            <Checkbox checked={selectedCrewIds.includes(m._id || m.id)} />
                                                            <ListItemText primary={`${m.firstName} ${m.lastName}`} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl fullWidth sx={textFieldStyle}>
                                                <InputLabel>Superintendents</InputLabel>
                                                <Select multiple value={selectedSuperintendentIds} label="Superintendents" onChange={(e) => setSelectedSuperintendentIds(e.target.value as any[])}
                                                    renderValue={(selected) => (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {(selected as any[]).map((v) => {
                                                                const s = superintendents.find(i => (i._id || i.id) === v);
                                                                return <Chip key={v} label={s ? `${s.firstName} ${s.lastName}` : v} size="small" />;
                                                            })}
                                                        </Box>
                                                    )}
                                                >
                                                    {superintendents.map(s => (
                                                        <MenuItem key={s._id || s.id} value={s._id || s.id}>
                                                            <Checkbox checked={selectedSuperintendentIds.includes(s._id || s.id)} />
                                                            <ListItemText primary={`${s.firstName} ${s.lastName}`} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <Stack spacing={2}>
                                                <Button variant="contained" fullWidth onClick={handleUpdateShip} sx={{ bgcolor: COLORS.ACCENT, py: 1.5, borderRadius: '10px' }}>Save Changes</Button>
                                                <Button variant="outlined" fullWidth onClick={() => setIsEditing(false)} sx={{ py: 1.5, borderRadius: '10px' }}>Cancel</Button>
                                            </Stack>
                                        </Stack>
                                    ) : (
                                        <Stack spacing={4}>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ color: COLORS.TEXT_SECONDARY, mb: 2, fontWeight: 700 }}>CREW MEMBERS ({selectedShip.crewMembers?.length || 0})</Typography>
                                                <Stack spacing={1}>
                                                    {selectedShip.crewMembers?.map((m: any) => (
                                                        <Paper key={m._id || m.id} sx={{ p: 2, bgcolor: COLORS.FOREGROUND, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                            <Typography variant="body2" fontWeight={600} sx={commonStyles}>{m.firstName} {m.lastName}</Typography>
                                                            <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY }}>{m.email}</Typography>
                                                        </Paper>
                                                    ))}
                                                </Stack>
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ color: COLORS.TEXT_SECONDARY, mb: 2, fontWeight: 700 }}>SUPERINTENDENTS ({selectedShip.superintendents?.length || 0})</Typography>
                                                <Stack spacing={1}>
                                                    {selectedShip.superintendents?.map((s: any) => (
                                                        <Paper key={s._id || s.id} sx={{ p: 2, bgcolor: COLORS.FOREGROUND, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                            <Typography variant="body2" fontWeight={600} sx={commonStyles}>{s.firstName} {s.lastName}</Typography>
                                                            <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY }}>{s.email}</Typography>
                                                        </Paper>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    )}
                                </Paper>
                            </Stack>
                        </Box>
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>No ship data found</Paper>
                    )}
                </Box>
            </Box>

            {/* Delete Confirmation Modal */}
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: '20px', p: 4, boxShadow: 24, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ ...commonStyles, mb: 2 }}>Delete Ship?</Typography>
                    <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, mb: 4 }}>Are you sure you want to delete this ship? This action cannot be undone.</Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button variant="contained" color="error" onClick={handleDeleteShip} sx={{ px: 4, borderRadius: '10px' }}>Delete</Button>
                        <Button variant="outlined" onClick={() => setOpenDeleteModal(false)} sx={{ px: 4, borderRadius: '10px' }}>Cancel</Button>
                    </Stack>
                </Box>
            </Modal>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} sx={{ width: '100%', fontWeight: 600 }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
