"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/widgets/Sidebar";
import Navbar from "@/components/widgets/Navbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
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

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchSuperintendents, createSuperintendent, clearError } from "@/redux/slices/superintendentSlice";

interface Superintendent {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
}

export default function SuperintendentManagementLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const { superintendents, loading, error, createLoading } = useSelector((state: RootState) => state.superintendent);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedSuperintendent, setSelectedSuperintendent] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userRole, setUserRole] = useState<string>("");

    // Fetch user role
    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) setUserRole(storedRole);
    }, []);

    // Fetch on mount
    useEffect(() => {
        dispatch(fetchSuperintendents());
    }, [dispatch]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const validationSchema = Yup.object({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").when('isEditing', {
            is: true,
            then: (schema) => schema.optional(),
            otherwise: (schema) => schema.required("Password is required"),
        }),
    });

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            if (isEditing && selectedSuperintendent) {
                // Update logic - pending API
                toast.info("Update functionality pending API");
                setIsEditing(false);
                setSubmitting(false);
            } else {
                const resultAction = await dispatch(createSuperintendent(values));
                if (createSuperintendent.fulfilled.match(resultAction)) {
                    toast.success("Superintendent created successfully!");
                    setOpenAddModal(false);
                    resetForm();
                    dispatch(fetchSuperintendents());
                }
                setSubmitting(false);
            }
        },
    });

    const handleOpenAdd = () => {
        formik.resetForm();
        setIsEditing(false);
        setOpenAddModal(true);
    };

    const handleOpenView = (member: Superintendent) => {
        setSelectedSuperintendent(member);
        setIsEditing(false);
        setOpenViewModal(true);
    };

    const handleEditClick = () => {
        if (selectedSuperintendent) {
            formik.setValues({
                firstName: selectedSuperintendent.firstName,
                lastName: selectedSuperintendent.lastName,
                email: selectedSuperintendent.email,
                password: ""
            });
            setIsEditing(true);
        }
    };

    const handleCloseView = () => {
        setSelectedSuperintendent(null);
        setOpenViewModal(false);
        setIsEditing(false);
        formik.resetForm();
    };

    const handleToggleStatusClick = (member: Superintendent) => {
        setSelectedSuperintendent(member);
        setOpenConfirmModal(true);
    };

    const confirmStatusChange = () => {
        if (selectedSuperintendent) {
            toast.info("Status update pending API integration");
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
                <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
                    <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: 'column', sm: 'row' }, justifyContent: "space-between", alignItems: { xs: 'start', sm: 'center' }, gap: 2 }}>
                        <Typography variant="h4" fontWeight={700} sx={commonStyles}>
                            Superintendent Management
                        </Typography>
                        {(userRole === 'ADMIN') && (
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
                        )}
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ ...commonStyles, py: 4 }}>Loading...</TableCell>
                                    </TableRow>
                                ) : (
                                    superintendents.map((row) => (
                                        <TableRow key={row.id || row._id || Math.random()} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 500, ...commonStyles }}>
                                                {row.firstName} {row.lastName}
                                            </TableCell>
                                            <TableCell sx={commonStyles}>{row.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.role || "Superintendent"}
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
                                            <IconButton onClick={handleEditClick} sx={{ color: "var(--foreground)", mr: 1 }}>
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
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedSuperintendent?.role || "Superintendent"}</Typography>
                                        </Box>
                                    </>
                                ) : (
                                    // Edit/Add Mode
                                    <form onSubmit={formik.handleSubmit}>
                                        <Stack spacing={2}>
                                            <Stack direction="row" spacing={2}>
                                                <TextField
                                                    label="First Name"
                                                    name="firstName"
                                                    fullWidth
                                                    autoComplete="off"
                                                    variant="outlined"
                                                    sx={textFieldStyle}
                                                    value={formik.values.firstName}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                                />
                                                <TextField
                                                    label="Last Name"
                                                    name="lastName"
                                                    fullWidth
                                                    autoComplete="off"
                                                    variant="outlined"
                                                    sx={textFieldStyle}
                                                    value={formik.values.lastName}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                                    helperText={formik.touched.lastName && formik.errors.lastName}
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
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                            />
                                            {(openAddModal) && (
                                                <TextField
                                                    label="Password"
                                                    name="password"
                                                    type="password"
                                                    fullWidth
                                                    autoComplete="new-password"
                                                    variant="outlined"
                                                    sx={textFieldStyle}
                                                    value={formik.values.password}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                                    helperText={formik.touched.password && formik.errors.password}
                                                />
                                            )}
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                disabled={createLoading || formik.isSubmitting}
                                                sx={{
                                                    mt: 2,
                                                    bgcolor: COLORS.GREEN,
                                                    color: COLORS.WHITE,
                                                    borderRadius: 0,
                                                    fontFamily: 'var(--font-primary) !important',
                                                    "&:hover": { bgcolor: COLORS.GREEN_DARK },
                                                }}
                                            >
                                                {openAddModal ? (createLoading ? "Adding..." : "Add Superintendent") : "Save Changes"}
                                            </Button>
                                        </Stack>
                                    </form>
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
