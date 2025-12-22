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
    Switch,
    Divider,
    FormControl,
    Drawer,
    useMediaQuery,
    useTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "@/utils/enum";

// Mock Data
const INITIAL_USERS = [
    { id: 1, name: "Amit Kumar", email: "amit@example.com", company: "Logistics One", status: "Active", joined: "2024-01-15" },
    { id: 2, name: "Sarah Jenkins", email: "sarah@shipping.co", company: "FastTrack", status: "Blocked", joined: "2024-02-20" },
    { id: 3, name: "Mike Ross", email: "mike@transporter.net", company: "Global Moves", status: "Active", joined: "2024-03-10" },
];

export default function UserManagementLayout() {
    const [users, setUsers] = useState(INITIAL_USERS);
    // Modal States
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    // Responsive State
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Selection State
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Handlers
    const handleView = (user: any) => {
        setSelectedUser(user);
        setOpenViewModal(true);
    };

    const handleEditFromView = () => {
        setOpenViewModal(false);
        setOpenEditModal(true);
    };

    const handleDeleteFromView = () => {
        setOpenViewModal(false);
        setOpenConfirmModal(true);
    };

    const handleToggleStatusClick = (user: any) => {
        setSelectedUser(user);
        setOpenConfirmModal(true);
    };

    const confirmStatusChange = () => {
        if (selectedUser) {
            const newStatus = selectedUser.status === "Active" ? "Blocked" : "Active";
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
            setOpenConfirmModal(false);
            setSelectedUser(null);
        }
    };

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 500 },
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
                '& .MuiInputBase-input': { WebkitTextFillColor: `${COLORS.WHITE} !important`, fill: COLORS.WHITE }
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

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Mobile Sidebar Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                <Sidebar />
            </Drawer>

            {/* Desktop Sidebar – 20% */}
            <Box sx={{ width: "20%", display: { xs: 'none', md: 'block' } }}>
                <Sidebar />
            </Box>

            {/* Main – Responsive Width */}
            <Box sx={{ width: { xs: "100%", md: "80%" }, flexGrow: 1 }}>
                <Navbar onMenuClick={handleDrawerToggle} />
                <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE }}>
                            User Management
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
                            Add User
                        </Button>
                    </Box>

                    {/* User Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: 0, bgcolor: "var(--card-bg)", overflowX: 'auto' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="user table">
                            <TableHead sx={{ bgcolor: "var(--card-bg)" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>Company</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>Joined Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "var(--foreground)", textAlign: 'right', fontFamily: 'var(--font-primary) !important' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 500, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>
                                            {row.name}
                                        </TableCell>
                                        <TableCell sx={{ color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>{row.email}</TableCell>
                                        <TableCell sx={{ color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>{row.company}</TableCell>
                                        <TableCell sx={{ color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>{row.joined}</TableCell>
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
                                            <IconButton
                                                onClick={() => handleView(row)}
                                                sx={{ color: "var(--foreground)" }}
                                            >
                                                <RemoveRedEyeIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>



                    {/* Add User Modal */}
                    <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
                        <Box sx={modalStyle}>
                            <Typography variant="h6" component="h2" mb={3} fontWeight={600} sx={{ fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE }}>
                                Add New User
                            </Typography>
                            <Stack spacing={2}>
                                <TextField label="Full Name" fullWidth variant="outlined" sx={textFieldStyle} />
                                <TextField label="Email Address" type="email" fullWidth variant="outlined" sx={textFieldStyle} />
                                <TextField label="Company Name" fullWidth variant="outlined" sx={textFieldStyle} />
                                <TextField label="Phone Number" fullWidth variant="outlined" sx={textFieldStyle} />
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
                                    Create User
                                </Button>
                            </Stack>
                        </Box>
                    </Modal>

                    {/* Edit User Modal */}
                    <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                        <Box sx={modalStyle}>
                            <Typography variant="h6" component="h2" mb={3} fontWeight={600} sx={{ fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE }}>
                                Edit User
                            </Typography>
                            <Stack spacing={2}>
                                <TextField label="Full Name" defaultValue={selectedUser?.name} fullWidth variant="outlined" sx={textFieldStyle} />
                                <TextField label="Email Address" defaultValue={selectedUser?.email} type="email" fullWidth variant="outlined" sx={textFieldStyle} />
                                <TextField label="Company Name" defaultValue={selectedUser?.company} fullWidth variant="outlined" sx={textFieldStyle} />
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
                                    onClick={() => setOpenEditModal(false)}
                                >
                                    Save Changes
                                </Button>
                            </Stack>
                        </Box>
                    </Modal>

                    {/* View Details Modal */}
                    <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
                        <Box sx={modalStyle}>
                            {selectedUser && (
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE }}>
                                                User Profile
                                            </Typography>
                                            <Chip
                                                label={selectedUser.status}
                                                size="small"
                                                sx={{
                                                    borderRadius: 0,
                                                    color: COLORS.WHITE,
                                                    borderColor: COLORS.WHITE,
                                                    fontFamily: 'var(--font-primary) !important'
                                                }}
                                                color={selectedUser.status === 'Active' ? 'success' : 'error'}
                                                variant="outlined"
                                            />
                                        </Box>
                                        <Box>
                                            <IconButton onClick={handleEditFromView} sx={{ color: "var(--foreground)", mr: 1 }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={handleDeleteFromView} sx={{ color: COLORS.RED }}>
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton onClick={() => setOpenViewModal(false)} sx={{ color: "var(--text-secondary)" }}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Full Name</Typography>
                                            <Typography variant="body1" fontWeight={500} sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedUser.name}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Email Address</Typography>
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedUser.email}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Company</Typography>
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedUser.company}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Date Joined</Typography>
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedUser.joined}</Typography>
                                        </Box>
                                    </Stack>
                                </>
                            )}
                        </Box>
                    </Modal>

                    {/* Confirmation Pop-up */}
                    <Modal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
                        <Box sx={confirmModalStyle}>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>
                                {selectedUser?.status === "Active" ? "Disable Profile" : "Enable Profile"}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3, color: "var(--text-secondary)", fontFamily: 'var(--font-primary) !important' }}>
                                Are you sure you want to {selectedUser?.status === "Active" ? "disable" : "enable"} this user&#39;s profile?
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
