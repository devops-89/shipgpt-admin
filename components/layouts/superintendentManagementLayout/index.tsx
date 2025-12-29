"use client";
import { useState } from "react";
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
    Switch
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { COLORS } from "@/utils/enum";

// Types
interface Superintendent {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
}

const MOCK_SUPERINTENDENTS: Superintendent[] = [
    { id: 1, firstName: "Robert", lastName: "Wilson", email: "robert.w@shippgpt.com", role: "Senior Superintendent", status: "Active" },
    { id: 2, firstName: "Alice", lastName: "Brown", email: "alice.b@shippgpt.com", role: "Superintendent", status: "Active" },
    { id: 3, firstName: "David", lastName: "Lee", email: "david.l@shippgpt.com", role: "Junior Superintendent", status: "Inactive" },
];

export default function SuperintendentManagementLayout() {
    const [superintendents, setSuperintendents] = useState<Superintendent[]>(MOCK_SUPERINTENDENTS);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedSuperintendent, setSelectedSuperintendent] = useState<Superintendent | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const resetForm = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        });
    };

    const handleOpenAdd = () => {
        resetForm();
        setOpenAddModal(true);
    };

    const handleOpenView = (member: Superintendent) => {
        setSelectedSuperintendent(member);
        setFormData({
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            password: "" // Don't show password
        });
        setIsEditing(false);
        setOpenViewModal(true);
    };

    const handleCloseView = () => {
        setSelectedSuperintendent(null);
        setOpenViewModal(false);
        setIsEditing(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSuperintendent = () => {
        // Just mock adding for now
        const newMember: Superintendent = {
            id: superintendents.length + 1,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            role: "Superintendent", // Default
            status: "Active"
        };
        setSuperintendents([...superintendents, newMember]);
        setOpenAddModal(false);
        resetForm();
    };

    const handleUpdateSuperintendent = () => {
        if (!selectedSuperintendent) return;
        const updatedMember: Superintendent = {
            ...selectedSuperintendent,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email
        };
        setSuperintendents(superintendents.map(c => c.id === selectedSuperintendent.id ? updatedMember : c));
        setSelectedSuperintendent(updatedMember);
        setIsEditing(false);
    };

    const handleToggleStatusClick = (member: Superintendent) => {
        setSelectedSuperintendent(member);
        setOpenConfirmModal(true);
    };

    const confirmStatusChange = () => {
        if (selectedSuperintendent) {
            const newStatus = selectedSuperintendent.status === "Active" ? "Inactive" : "Active";
            setSuperintendents(superintendents.map(c => c.id === selectedSuperintendent.id ? { ...c, status: newStatus } : c));
            setOpenConfirmModal(false);
            setSelectedSuperintendent(null);
        }
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
        width: { xs: '90%', sm: 500 },
        bgcolor: 'var(--card-bg)',
        boxShadow: 24,
        border: '1px solid var(--border)',
        p: 4,
        outline: 'none',
        ...commonStyles
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
        },
        '& .MuiInputLabel-root': { color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important' },
        '& .MuiInputLabel-root.Mui-focused': { color: COLORS.WHITE },
        '& .MuiInputBase-input': { fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE },
    };

    const confirmModalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'var(--card-bg)',
        color: 'var(--foreground)',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        outline: 'none',
        border: '1px solid var(--border)',
        textAlign: 'center'
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            {/* Sidebar – Fixed */}
            <Box sx={{ width: "20%", height: "100%", overflowY: "auto", borderRight: "1px solid var(--border)" }}>
                <Sidebar />
            </Box>

            {/* Main Content */}
            <Box sx={{ width: "80%", height: "100%", display: "flex", flexDirection: "column" }}>
                <Navbar />
                <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
                    <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: 'column', sm: 'row' }, justifyContent: "space-between", alignItems: { xs: 'start', sm: 'center' }, gap: 2 }}>
                        <Typography variant="h4" fontWeight={700} sx={commonStyles}>
                            Superintendent Management
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
                            Add Superintendent
                        </Button>
                    </Box>

                    {/* Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: 0, bgcolor: "var(--card-bg)" }}>
                        <Table sx={{ minWidth: 650 }} aria-label="superintendent table">
                            <TableHead sx={{ bgcolor: "var(--card-bg)" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, ...commonStyles }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600, ...commonStyles }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600, ...commonStyles }}>Role</TableCell>
                                    <TableCell sx={{ fontWeight: 600, ...commonStyles }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600, textAlign: 'right', ...commonStyles }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {superintendents.map((row) => (
                                    <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 500, ...commonStyles }}>
                                            {row.firstName} {row.lastName}
                                        </TableCell>
                                        <TableCell sx={commonStyles}>{row.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.role}
                                                size="small"
                                                sx={{
                                                    borderRadius: 0,
                                                    bgcolor: 'rgba(255,255,255,0.05)',
                                                    color: "var(--foreground)",
                                                    fontWeight: 500,
                                                    fontFamily: 'var(--font-primary) !important'
                                                }}
                                            />
                                        </TableCell>
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

                    {/* Add/View/Edit Modal */}
                    <Modal open={openAddModal || openViewModal} onClose={openAddModal ? () => setOpenAddModal(false) : handleCloseView}>
                        <Box sx={modalStyle}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight={600} sx={commonStyles}>
                                    {openAddModal ? "Add New Superintendent" : (isEditing ? "Edit Superintendent Details" : "Superintendent Details")}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {!openAddModal && !isEditing && (
                                        <>
                                            <IconButton onClick={() => setIsEditing(true)} sx={{ color: "var(--foreground)", mr: 1 }}>
                                                <EditIcon />
                                            </IconButton>
                                        </>
                                    )}
                                    <IconButton onClick={openAddModal ? () => setOpenAddModal(false) : handleCloseView} sx={{ color: "var(--text-secondary)" }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Stack spacing={2}>
                                {(!openAddModal && !isEditing) ? (
                                    // View Mode
                                    <>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Name</Typography>
                                            <Typography variant="body1" fontWeight={500} sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedSuperintendent?.firstName} {selectedSuperintendent?.lastName}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Email</Typography>
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedSuperintendent?.email}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Role</Typography>
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedSuperintendent?.role}</Typography>
                                        </Box>
                                    </>
                                ) : (
                                    // Edit/Add Mode
                                    <>
                                        <Stack direction="row" spacing={2}>
                                            <TextField
                                                label="First Name"
                                                name="firstName"
                                                fullWidth
                                                autoComplete="off"
                                                variant="outlined"
                                                sx={textFieldStyle}
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                            />
                                            <TextField
                                                label="Last Name"
                                                name="lastName"
                                                fullWidth
                                                autoComplete="off"
                                                variant="outlined"
                                                sx={textFieldStyle}
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                            />
                                        </Stack>
                                        <TextField
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            fullWidth
                                            autoComplete="off"
                                            variant="outlined"
                                            sx={textFieldStyle}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        {openAddModal && (
                                            <TextField
                                                label="Password"
                                                name="password"
                                                type="password"
                                                fullWidth
                                                autoComplete="new-password"
                                                variant="outlined"
                                                sx={textFieldStyle}
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                        )}
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            onClick={openAddModal ? handleAddSuperintendent : handleUpdateSuperintendent}
                                            sx={{
                                                mt: 2,
                                                bgcolor: COLORS.GREEN,
                                                color: COLORS.WHITE,
                                                borderRadius: 0,
                                                fontFamily: 'var(--font-primary) !important',
                                                "&:hover": { bgcolor: COLORS.GREEN_DARK },
                                            }}
                                        >
                                            {openAddModal ? "Add Superintendent" : "Save Changes"}
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Box>
                    </Modal>

                    {/* Confirmation Pop-up */}
                    <Modal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
                        <Box sx={confirmModalStyle}>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>
                                {selectedSuperintendent?.status === "Active" ? "Disable Superintendent" : "Enable Superintendent"}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3, color: "var(--text-secondary)", fontFamily: 'var(--font-primary) !important' }}>
                                Are you sure you want to {selectedSuperintendent?.status === "Active" ? "disable" : "enable"} this superintendent's account?
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
