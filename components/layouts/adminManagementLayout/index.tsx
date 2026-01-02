"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
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

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAdmins, createAdmin, clearError } from "@/redux/slices/adminSlice";

export default function AdminManagementLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const { admins, loading, error, createLoading } = useSelector((state: RootState) => state.admin);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
    const [userRole, setUserRole] = useState<string>("");

    // Fetch user role on client side
    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    // Fetch admins on mount
    useEffect(() => {
        dispatch(fetchAdmins());
    }, [dispatch]);

    // Handle errors globally for this component
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

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
            // Dispatch update action if we had one implemented in redux
            // For now we mock it locally or we can add updateAdmin thunk later
            toast.info("Status update logic needs API integration via Redux");
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
        '& .MuiMenuItem-root': { fontFamily: 'var(--font-primary) !important' },
        '& .MuiFormHelperText-root': { fontFamily: 'var(--font-primary) !important' }
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

    const validationSchema = Yup.object({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const resultAction = await dispatch(createAdmin(values));
            if (createAdmin.fulfilled.match(resultAction)) {
                toast.success("Admin created successfully!");
                setOpenAddModal(false);
                formik.resetForm();
                dispatch(fetchAdmins()); // Refresh list
            }
            setSubmitting(false);
        },
    });

    const handleOpenAdd = () => {
        formik.resetForm();
        setOpenAddModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
        formik.resetForm();
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            {/* Sidebar – 20% */}
            <Box sx={{ width: "20%", height: "100%", overflowY: "auto", borderRight: "1px solid var(--border)" }}>
                <Sidebar />
            </Box>

            {/* Main – 80% */}
            <Box sx={{ width: "80%", height: "100%", display: "flex", flexDirection: "column" }}>
                <Navbar />
                <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
                    <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: 'column', sm: 'row' }, justifyContent: "space-between", alignItems: { xs: 'start', sm: 'center' }, gap: 2 }}>
                        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE }}>
                            Admin Management
                        </Typography>
                        {userRole === 'SUPERADMIN' && (
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
                                Add Admin
                            </Button>
                        )}
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ color: "var(--foreground)", py: 4 }}>Loading...</TableCell>
                                    </TableRow>
                                ) : (
                                    Array.isArray(admins) && admins.map((row) => (
                                        <TableRow
                                            key={row.id || row._id || Math.random()}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 500, color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>
                                                {row.name || `${row.firstName} ${row.lastName}`}
                                            </TableCell>
                                            <TableCell sx={{ color: "var(--foreground)", fontFamily: 'var(--font-primary) !important' }}>{row.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.role || row.user_role || "Admin"}
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

                    {/* Add Admin Modal */}
                    <Modal open={openAddModal} onClose={handleCloseAddModal}>
                        <Box sx={modalStyle}>
                            <Typography variant="h6" component="h2" mb={3} fontWeight={600} sx={{ fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE }}>
                                Add New Admin
                            </Typography>
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
                                            border: "1px solid var(--border)",
                                            borderRadius: 0,
                                            fontFamily: 'var(--font-primary) !important',
                                            "&:hover": { bgcolor: COLORS.GREEN_DARK, border: `1px solid ${COLORS.GREEN_DARK}` },
                                        }}
                                    >
                                        {createLoading ? "Creating..." : "Create Admin"}
                                    </Button>
                                </Stack>
                            </form>
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
