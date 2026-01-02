"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/widgets/Sidebar";
import Navbar from "@/components/widgets/Navbar";
import { toast } from "react-toastify";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Modal,
    Stack,
    Chip,
    Switch,
    Button,
    TextField
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { COLORS } from "@/utils/enum";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers, updateUser, clearError } from "@/redux/slices/userSlice";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
}

export default function UserManagementLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const { users, loading, error } = useSelector((state: RootState) => state.user);

    const [openViewModal, setOpenViewModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleOpenView = (user: any) => {
        setSelectedUser(user);
        setIsEditing(false);
        setOpenViewModal(true);
    };

    const handleCloseView = () => {
        setSelectedUser(null);
        setOpenViewModal(false);
        setIsEditing(false);
    };

    const handleToggleStatusClick = (user: any) => {
        setSelectedUser(user);
        setOpenConfirmModal(true);
    };

    const confirmStatusChange = async () => {
        if (selectedUser) {
            try {
                const isActive = selectedUser.status === 'Active' || selectedUser.isActive === true;
                await dispatch(updateUser({
                    id: selectedUser.id || selectedUser._id,
                    data: { isActive: !isActive }
                })).unwrap();

                toast.success(`User ${!isActive ? 'enabled' : 'disabled'} successfully`);
                setOpenConfirmModal(false);
                setSelectedUser(null);
            } catch (err: any) {
                toast.error(err || "Failed to update status");
            }
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
                <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight={700} sx={commonStyles}>
                            User Management
                        </Typography>
                    </Box>

                    {/* Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: 0, bgcolor: "var(--card-bg)" }}>
                        <Table sx={{ minWidth: 650 }} aria-label="user table">
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ ...commonStyles, py: 4 }}>Loading...</TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((row) => (
                                        <TableRow key={row.id || row._id || Math.random()} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 500, ...commonStyles }}>
                                                {row.firstName} {row.lastName}
                                            </TableCell>
                                            <TableCell sx={commonStyles}>{row.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.role || "User"}
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
                                                    checked={row.status === 'Active' || row.isActive === true}
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* View/Edit Modal (Basic) */}
                    <Modal open={openViewModal} onClose={handleCloseView}>
                        <Box sx={modalStyle}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight={600} sx={commonStyles}>
                                    {isEditing ? "Edit User Details" : "User Details"}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {!isEditing && (
                                        <IconButton onClick={() => setIsEditing(true)} sx={{ color: "var(--foreground)", mr: 1 }}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    <IconButton onClick={handleCloseView} sx={{ color: "var(--text-secondary)" }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Stack spacing={2}>
                                {isEditing ? (
                                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField
                                            label="First Name"
                                            fullWidth
                                            variant="outlined"
                                            value={selectedUser?.firstName || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: COLORS.WHITE,
                                                    '& fieldset': { borderColor: COLORS.WHITE },
                                                    '&:hover fieldset': { borderColor: COLORS.WHITE },
                                                    '&.Mui-focused fieldset': { borderColor: COLORS.WHITE },
                                                },
                                                '& .MuiInputLabel-root': { color: COLORS.WHITE },
                                                '& .MuiInputBase-input': { color: COLORS.WHITE },
                                            }}
                                        />
                                        <TextField
                                            label="Last Name"
                                            fullWidth
                                            variant="outlined"
                                            value={selectedUser?.lastName || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: COLORS.WHITE,
                                                    '& fieldset': { borderColor: COLORS.WHITE },
                                                    '&:hover fieldset': { borderColor: COLORS.WHITE },
                                                    '&.Mui-focused fieldset': { borderColor: COLORS.WHITE },
                                                },
                                                '& .MuiInputLabel-root': { color: COLORS.WHITE },
                                                '& .MuiInputBase-input': { color: COLORS.WHITE },
                                            }}
                                        />
                                        <TextField
                                            label="Role"
                                            fullWidth // You might want a Select here ideally, but keeping it text for flexibility as per screenshot "role": "CREW"
                                            variant="outlined"
                                            value={selectedUser?.role || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: COLORS.WHITE,
                                                    '& fieldset': { borderColor: COLORS.WHITE },
                                                    '&:hover fieldset': { borderColor: COLORS.WHITE },
                                                    '&.Mui-focused fieldset': { borderColor: COLORS.WHITE },
                                                },
                                                '& .MuiInputLabel-root': { color: COLORS.WHITE },
                                                '& .MuiInputBase-input': { color: COLORS.WHITE },
                                            }}
                                        />
                                        <Button
                                            onClick={async () => {
                                                try {
                                                    await dispatch(updateUser({
                                                        id: selectedUser.id || selectedUser._id,
                                                        data: {
                                                            firstName: selectedUser.firstName,
                                                            lastName: selectedUser.lastName,
                                                            role: selectedUser.role
                                                        }
                                                    })).unwrap();
                                                    toast.success("User details updated successfully");
                                                    setIsEditing(false);
                                                } catch (err: any) {
                                                    toast.error(err || "Failed to update user");
                                                }
                                            }}
                                            variant="contained"
                                            sx={{
                                                bgcolor: COLORS.GREEN,
                                                color: COLORS.WHITE,
                                                '&:hover': { bgcolor: COLORS.GREEN_DARK }
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </Box>
                                ) : (
                                    <>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Name</Typography>
                                            <Typography variant="body1" fontWeight={500} sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedUser?.firstName} {selectedUser?.lastName}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Email</Typography>
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedUser?.email}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Role</Typography>
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedUser?.role || "User"}</Typography>
                                        </Box>
                                    </>
                                )}
                            </Stack>
                        </Box>
                    </Modal>

                    {/* Confirmation Pop-up */}
                    <Modal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
                        <Box sx={confirmModalStyle}>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>
                                {selectedUser?.status === "Active" ? "Disable User" : "Enable User"}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3, color: "var(--text-secondary)", fontFamily: 'var(--font-primary) !important' }}>
                                Are you sure you want to {selectedUser?.status === "Active" ? "disable" : "enable"} this user's account?
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
