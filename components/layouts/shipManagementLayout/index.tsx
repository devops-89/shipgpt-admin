"use client";
import { useState, useRef } from "react";
import Sidebar from "@/components/widgets/Sidebar";
import Navbar from "@/components/widgets/Navbar";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Modal,
    TextField,
    Stack,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Switch,
    Drawer
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "@/utils/enum";

// Types
interface ShipDocument {
    name: string;
    file?: File; // For new uploads
}

interface Ship {
    id: number;
    name: string;
    imo: string;
    status: string;
    documents: Record<string, ShipDocument[]>; // Category -> Documents
}

const CATEGORIES = ["Compliance", "Crewing", "Mechanical"];

const MOCK_SHIPS: Ship[] = [
    {
        id: 1,
        name: "Poseidon I",
        imo: "9876543",
        status: "Active",
        documents: {
            'Compliance': [{ name: 'safety_cert.pdf' }],
            'Crewing': [],
            'Mechanical': []
        }
    },
    {
        id: 2,
        name: "Sea Breeze",
        imo: "1234567",
        status: "Maintenance",
        documents: {
            'Compliance': [],
            'Crewing': [{ name: 'crew_list.pdf' }],
            'Mechanical': [{ name: 'engine_report.pdf' }]
        }
    },
];

export default function ShipManagementLayout() {
    const [ships, setShips] = useState<Ship[]>(MOCK_SHIPS);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [mobileOpen, setMobileOpen] = useState(false);
    const drawerWidth = 240;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Form states
    const [name, setName] = useState("");
    const [imo, setImo] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [pendingDocuments, setPendingDocuments] = useState<Record<string, ShipDocument[]>>({
        'Compliance': [],
        'Crewing': [],
        'Mechanical': []
    });

    const resetForm = () => {
        setName("");
        setImo("");
        setSelectedCategory("");
        setPendingDocuments({ 'Compliance': [], 'Crewing': [], 'Mechanical': [] });
    };

    const handleOpenAdd = () => {
        resetForm();
        setOpenAddModal(true);
    };

    const handleOpenView = (ship: Ship) => {
        setSelectedShip(ship);
        // Pre-populate form data for editing logic
        setName(ship.name);
        setImo(ship.imo);
        setPendingDocuments(ship.documents); // In a real app, do deep copy
        setIsEditing(false);
        setOpenViewModal(true);
    };

    const handleCloseView = () => {
        setSelectedShip(null);
        setOpenViewModal(false);
        setIsEditing(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && selectedCategory) {
            const newDocs = Array.from(e.target.files).map(file => ({
                name: file.name,
                file: file
            }));

            setPendingDocuments(prev => ({
                ...prev,
                [selectedCategory]: [...(prev[selectedCategory] || []), ...newDocs]
            }));
        }
    };



    const handleToggleStatusClick = (ship: Ship) => {
        setSelectedShip(ship);
        setOpenConfirmModal(true);
    };

    const confirmStatusChange = () => {
        if (selectedShip) {
            const newStatus = selectedShip.status === "Active" ? "Maintenance" : "Active";
            setShips(ships.map(s => s.id === selectedShip.id ? { ...s, status: newStatus } : s));
            setOpenConfirmModal(false);
            setSelectedShip(null);
        }
    };

    const handleAddShip = () => {
        const newShip: Ship = {
            id: ships.length + 1,
            name,
            imo,
            status: "Active",
            documents: pendingDocuments
        };
        setShips([...ships, newShip]);
        setOpenAddModal(false);
        resetForm();
    };

    const handleUpdateShip = () => {
        if (!selectedShip) return;
        const updatedShip: Ship = {
            ...selectedShip,
            name,
            imo,
            documents: pendingDocuments
        };
        setShips(ships.map(s => s.id === selectedShip.id ? updatedShip : s));
        setSelectedShip(updatedShip);
        setIsEditing(false);
    };

    const handleDeleteShip = () => {
        if (!selectedShip) return;
        setShips(ships.filter(s => s.id !== selectedShip.id));
        handleCloseView();
    };

    const removeDocument = (category: string, index: number) => {
        setPendingDocuments(prev => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== index)
        }));
    };

    const commonStyles = {
        fontFamily: 'var(--font-primary) !important',
        color: 'var(--foreground)'
    };

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 600 },
        maxHeight: '90vh',
        overflowY: 'auto',
        bgcolor: 'var(--card-bg)',
        // color: 'var(--foreground)',
        boxShadow: 24,
        border: '1px solid var(--border)',
        p: 4,
        outline: 'none',
        ...commonStyles
    };

    const confirmModalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 400 },
        bgcolor: 'var(--card-bg)',
        color: 'var(--foreground)',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        outline: 'none',
        border: '1px solid var(--border)',
        textAlign: 'center'
    };

    const textFieldStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            color: COLORS.WHITE,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            fontFamily: 'var(--font-primary) !important',
            '& fieldset': { borderColor: COLORS.WHITE },
            '&:hover fieldset': { borderColor: COLORS.WHITE },
            '&.Mui-focused fieldset': { borderColor: COLORS.WHITE },
            '&.Mui-disabled': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '& .MuiInputBase-input': { WebkitTextFillColor: `${COLORS.WHITE} !important`, fill: COLORS.WHITE }
            }
        },
        '& .MuiInputLabel-root': { color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important' }, // White label
        '& .MuiInputLabel-root.Mui-focused': { color: COLORS.WHITE },
        '& .MuiSelect-icon': { color: COLORS.WHITE },
        '& .MuiInputBase-input': { fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE },
        '& .MuiMenuItem-root': { fontFamily: 'var(--font-primary) !important' }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <Sidebar />
                </Drawer>
                {/* Desktop sidebar */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    <Sidebar />
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                <Navbar onMenuClick={handleDrawerToggle} />
                <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: 'column', sm: 'row' }, justifyContent: "space-between", alignItems: { xs: 'start', sm: 'center' }, gap: 2 }}>
                        <Typography variant="h4" fontWeight={700} sx={commonStyles}>
                            Ship Management
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAdd}
                            sx={{
                                width: { xs: '100%', sm: 'auto' },
                                bgcolor: "var(--card-bg)",
                                color: "var(--foreground)",
                                border: "1px solid var(--border)",
                                borderRadius: 0,
                                textTransform: "none",
                                px: 3,
                                py: 1.5,
                                fontFamily: 'var(--font-primary) !important',
                                "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.05)",
                                    border: "1px solid var(--foreground)",
                                },
                            }}
                        >
                            Add Ship
                        </Button>
                    </Box>

                    {/* Ship Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: 0, bgcolor: "var(--card-bg)" }}>
                        <Table sx={{ minWidth: 650 }} aria-label="ship table">
                            <TableHead sx={{ bgcolor: "var(--card-bg)" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, ...commonStyles }}>Ship Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600, ...commonStyles }}>IMO Number</TableCell>
                                    <TableCell sx={{ fontWeight: 600, ...commonStyles }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600, textAlign: 'right', ...commonStyles }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ships.map((row) => (
                                    <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 500, ...commonStyles }}>
                                            {row.name}
                                        </TableCell>
                                        <TableCell sx={commonStyles}>{row.imo}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={row.status === 'Active'}
                                                onChange={() => handleToggleStatusClick(row)}
                                                color="success"
                                                sx={{
                                                    '& .MuiSwitch-track': { bgcolor: 'var(--text-secondary)' }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpenView(row)} sx={{ color: "var(--foreground)" }}>
                                                <RemoveRedEyeIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Add/View/Edit Ship Modal */}
                    <Modal open={openAddModal || openViewModal} onClose={openAddModal ? () => setOpenAddModal(false) : handleCloseView}>
                        <Box sx={modalStyle}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight={600} sx={commonStyles}>
                                    {openAddModal ? "Add New Ship" : (isEditing ? "Edit Ship Details" : "Ship Details")}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {!openAddModal && !isEditing && selectedShip && (
                                        <Chip
                                            label={selectedShip.status}
                                            size="small"
                                            sx={{
                                                borderRadius: 0,
                                                color: COLORS.WHITE,
                                                borderColor: COLORS.WHITE,
                                                fontFamily: 'var(--font-primary) !important'
                                            }}
                                            color={selectedShip.status === 'Active' ? 'success' : 'error'}
                                            variant="outlined"
                                        />
                                    )}
                                    <Box>
                                        {!openAddModal && !isEditing && (
                                            <>
                                                <IconButton onClick={() => setIsEditing(true)} sx={{ color: "var(--foreground)", mr: 1 }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={handleDeleteShip} sx={{ color: COLORS.RED }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        )}
                                        <IconButton onClick={openAddModal ? () => setOpenAddModal(false) : handleCloseView} sx={{ color: "var(--text-secondary)" }}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>

                            <Stack spacing={3}>
                                {/* Basic Details */}
                                <Stack spacing={2}>
                                    {!openAddModal && !isEditing ? (
                                        <>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Ship Name</Typography>
                                                <Typography variant="body1" fontWeight={500} sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{name}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>IMO Number</Typography>
                                                <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{imo}</Typography>
                                            </Box>
                                        </>
                                    ) : (
                                        <>
                                            <TextField
                                                label="Ship Name"
                                                fullWidth
                                                variant="outlined"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                sx={textFieldStyle}
                                            />
                                            <TextField
                                                label="IMO Number"
                                                fullWidth
                                                variant="outlined"
                                                value={imo}
                                                onChange={(e) => setImo(e.target.value)}
                                                sx={textFieldStyle}
                                            />
                                        </>
                                    )}
                                </Stack>

                                <Divider sx={{ borderColor: 'var(--border)' }} />

                                {/* Document Management */}
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, ...commonStyles }}>
                                        Documents
                                    </Typography>

                                    {(openAddModal || isEditing) && (
                                        <Box sx={{ mb: 3, p: 2, border: '1px dashed var(--border)', bgcolor: 'rgba(255,255,255,0.02)' }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <FormControl sx={{ minWidth: 200, ...textFieldStyle }}>
                                                    <InputLabel id="category-select">Category</InputLabel>
                                                    <Select
                                                        labelId="category-select"
                                                        value={selectedCategory}
                                                        label="Category"
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                    >
                                                        {CATEGORIES.map(cat => (
                                                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    startIcon={<CloudUploadIcon />}
                                                    disabled={!selectedCategory}
                                                    sx={{
                                                        height: 56,
                                                        flex: 1,
                                                        borderColor: 'var(--border)',
                                                        color: 'var(--foreground)',
                                                        '&:hover': { borderColor: 'var(--foreground)', bgcolor: 'transparent' }
                                                    }}
                                                >
                                                    Upload PDF
                                                    <input
                                                        type="file"
                                                        hidden
                                                        multiple
                                                        accept=".pdf"
                                                        ref={fileInputRef}
                                                        onChange={handleFileUpload}
                                                    />
                                                </Button>
                                            </Stack>
                                            {!selectedCategory && (
                                                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: COLORS.WHITE }}>
                                                    Please select a category to upload files.
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    {/* Display Documents */}
                                    <Stack spacing={2}>
                                        {CATEGORIES.map(category => (
                                            <Box key={category}>
                                                {pendingDocuments[category]?.length > 0 && (
                                                    <>
                                                        <Typography variant="subtitle2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                                                            {category}
                                                        </Typography>
                                                        <List dense sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 1 }}>
                                                            {pendingDocuments[category].map((doc, idx) => (
                                                                <ListItem key={idx} divider={idx !== pendingDocuments[category].length - 1}>
                                                                    <ListItemText
                                                                        primary={<Box display="flex" alignItems="center" gap={1}>
                                                                            <InsertDriveFileIcon fontSize="small" color="primary" />
                                                                            <Typography variant="body2" sx={commonStyles}>{doc.name}</Typography>
                                                                        </Box>}
                                                                    />
                                                                    {(openAddModal || isEditing) && (
                                                                        <ListItemSecondaryAction>
                                                                            <IconButton edge="end" size="small" onClick={() => removeDocument(category, idx)} sx={{ color: COLORS.RED }}>
                                                                                <CloseIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </ListItemSecondaryAction>
                                                                    )}
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>

                                {/* Action Buttons */}
                                {(openAddModal || isEditing) && (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        onClick={openAddModal ? handleAddShip : handleUpdateShip}
                                        sx={{
                                            mt: 2,
                                            bgcolor: COLORS.GREEN,
                                            color: COLORS.WHITE,
                                            borderRadius: 0,
                                            fontFamily: 'var(--font-primary) !important',
                                            "&:hover": { bgcolor: COLORS.GREEN_DARK },
                                        }}
                                    >
                                        {openAddModal ? "Create Ship" : "Save Changes"}
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    </Modal>

                    {/* Confirmation Pop-up */}
                    <Modal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
                        <Box sx={confirmModalStyle}>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>
                                {selectedShip?.status === "Active" ? "Disable Ship" : "Enable Ship"}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3, color: "var(--text-secondary)", fontFamily: 'var(--font-primary) !important' }}>
                                Are you sure you want to {selectedShip?.status === "Active" ? "disable" : "enable"} this ship&#39;s profile?
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setOpenConfirmModal(false)}
                                    sx={{
                                        borderRadius: 0,
                                        color: 'var(--foreground)',
                                        borderColor: 'var(--foreground)',
                                        minWidth: 100,
                                        fontFamily: 'var(--font-primary) !important',
                                        "&:hover": { borderColor: 'var(--foreground)', bgcolor: 'rgba(255, 255, 255, 0.05)' }
                                    }}
                                >
                                    NO
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={confirmStatusChange}
                                    sx={{
                                        borderRadius: 0,
                                        bgcolor: 'var(--foreground)',
                                        color: 'var(--background)',
                                        minWidth: 100,
                                        fontFamily: 'var(--font-primary) !important',
                                        "&:hover": { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                                    }}
                                >
                                    YES
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </Box>
            </Box>
        </Box>
    );
}
