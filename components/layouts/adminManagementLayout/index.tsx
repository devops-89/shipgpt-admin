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
import { COLORS } from "@/utils/enum";
const MOCK_ADMINS = [
    { id: 1, name: "Yash Sharma", email: "yash@shippgpt.com", role: "Super Admin", status: "Active" },
    { id: 2, name: "Rahul Verma", email: "rahul@shippgpt.com", role: "Admin", status: "Active" },
    { id: 3, name: "Priya Singh", email: "priya@shippgpt.com", role: "Editor", status: "Inactive" },
];

export default function AdminManagementLayout() {
    const [admins, setAdmins] = useState(MOCK_ADMINS);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
    const handleOpenView = (admin: any) => {
        setSelectedAdmin(admin);
        setOpenViewModal(true);
    };
    const handleCloseView = () => {
        setSelectedAdmin(null);
        setOpenViewModal(false);
    };

    const handleToggleStatusClick = (admin: any) => {
        setSelectedAdmin(admin);
        setOpenConfirmModal(true);
    };

    const confirmStatusChange = () => {
        if (selectedAdmin) {
            const newStatus = selectedAdmin.status === "Active" ? "Inactive" : "Active";
            setAdmins(admins.map(a => a.id === selectedAdmin.id ? { ...a, status: newStatus } : a));
            setOpenConfirmModal(false);
            setSelectedAdmin(null);
        }
    };

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'var(--card-bg)',
        color: 'var(--foreground)',
        boxShadow: 24,
        border: '1px solid var(--border)',
        p: 4,
        outline: 'none',
        fontFamily: 'var(--font-primary) !important'
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
                '& .MuiInputBase-input': { WebkitTextFillColor: 'rgba(255, 255, 255, 0.5) !important' }
            }
        },
        '& .MuiInputLabel-root': { color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important' },
        '& .MuiInputLabel-root.Mui-focused': { color: COLORS.WHITE },
        '& .MuiSelect-icon': { color: COLORS.WHITE },
        '& .MuiInputBase-input': { fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE },
        '& .MuiMenuItem-root': { fontFamily: 'var(--font-primary) !important' }
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
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar – 20% */}
            <Box sx={{ width: "20%" }}>
                <Sidebar />
            </Box>

            {/* Main – 80% */}
            <Box sx={{ width: "80%" }}>
                <Navbar />
                <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE }}>
                            Admin Management
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenAddModal(true)}
                            sx={{
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
                            Add Admin
                        </Button>
                    </Box>

                    {/* Admin Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: 0, bgcolor: "var(--card-bg)" }}>
                        <Table sx={{ minWidth: 650 }} aria-label="admin table">
                            <TableHead sx={{ bgcolor: "var(--card-bg)" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>Role</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "var(--foreground)", textAlign: 'right', fontFamily: 'var(--font-primary) !important' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {admins.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 500, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>
                                            {row.name}
                                        </TableCell>
                                        <TableCell sx={{ color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>{row.email}</TableCell>
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

                    {/* Add Admin Modal */}
                    <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
                        <Box sx={modalStyle}>
                            <Typography variant="h6" component="h2" mb={3} fontWeight={600} sx={{ fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE }}>
                                Add New Admin
                            </Typography>
                            <Stack spacing={2}>
                                <TextField label="Full Name" fullWidth variant="outlined" sx={textFieldStyle} />
                                <TextField label="Email Address" type="email" fullWidth variant="outlined" sx={textFieldStyle} />
                                <TextField label="Role" fullWidth variant="outlined" sx={textFieldStyle} />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    sx={{
                                        mt: 2,
                                        bgcolor: COLORS.GREEN,
                                        color: COLORS.WHITE,
                                        border: "1px solid var(--border)",
                                        borderRadius: 0,
                                        fontFamily: 'var(--font-primary) !important',
                                        "&:hover": { bgcolor: COLORS.GREEN_DARK, border: `1px solid ${COLORS.GREEN_DARK}` },
                                    }}
                                    onClick={() => setOpenAddModal(false)}
                                >
                                    Create Admin
                                </Button>
                            </Stack>
                        </Box>
                    </Modal>

                    {/* View Details Modal */}
                    <Modal open={openViewModal} onClose={handleCloseView}>
                        <Box sx={modalStyle}>
                            {selectedAdmin && (
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE }}>
                                            Admin Details
                                        </Typography>
                                        <Chip label={selectedAdmin.status} size="small" sx={{ borderRadius: 0, color: COLORS.WHITE, borderColor: COLORS.WHITE }} variant="outlined" />
                                    </Box>

                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Name</Typography>
                                            <Typography variant="body1" fontWeight={500} sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedAdmin.name}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Email</Typography>
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedAdmin.email}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Role</Typography>
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedAdmin.role}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Permissions</Typography>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                <Chip label="User Mgmt" size="small" variant="outlined" sx={{ borderRadius: 0, color: COLORS.WHITE, borderColor: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-primary) !important' }} />
                                                <Chip label="PDF Mgmt" size="small" variant="outlined" sx={{ borderRadius: 0, color: COLORS.WHITE, borderColor: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-primary) !important' }} />
                                                <Chip label="Settings" size="small" variant="outlined" sx={{ borderRadius: 0, color: COLORS.WHITE, borderColor: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-primary) !important' }} />
                                            </Box>
                                        </Box>
                                    </Stack>

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            mt: 4,
                                            borderColor: "rgba(255,255,255,0.3)",
                                            color: COLORS.WHITE,
                                            borderRadius: 0,
                                            fontFamily: 'var(--font-primary) !important',
                                            "&:hover": { borderColor: COLORS.WHITE, bgcolor: 'rgba(255,255,255,0.05)' },
                                        }}
                                        onClick={handleCloseView}
                                    >
                                        Close
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Modal>

                    {/* Confirmation Pop-up */}
                    <Modal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
                        <Box sx={confirmModalStyle}>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>
                                {selectedAdmin?.status === "Active" ? "Disable Profile" : "Enable Profile"}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3, color: "var(--text-secondary)", fontFamily: 'var(--font-primary) !important' }}>
                                Are you sure you want to {selectedAdmin?.status === "Active" ? "disable" : "enable"} this admin&#39;s profile?
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
