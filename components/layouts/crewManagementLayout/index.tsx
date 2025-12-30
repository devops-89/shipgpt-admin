"use client";
import { useState,useEffect } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "@/utils/enum";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authControllers } from "@/api/auth";


interface CrewMember {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
}

const MOCK_CREW: CrewMember[] = [
    { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@shippgpt.com", role: "Captain", status: "Active" },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane.smith@shippgpt.com", role: "Engineer", status: "Active" },
    { id: 3, firstName: "Mike", lastName: "Johnson", email: "mike.j@shippgpt.com", role: "Deck Hand", status: "Inactive" },
];

export default function CrewManagementLayout() {
    const [crew, setCrew] = useState<CrewMember[]>(MOCK_CREW);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Formik for Add Crew
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
            try {
                await authControllers.createCrew(values);
                setOpenAddModal(false);
                alert("Crew member created successfully!");
                formik.resetForm();
                // Optionally refetch crew list here if we had a getCrew API setup
            } catch (error: any) {
                console.error("Error creating crew:", error);
                if (error.response && error.response.data && error.response.data.errors) {
                    const apiErrors = error.response.data.errors;
                    alert(apiErrors.join("\n"));
                } else {
                    alert(error.response?.data?.message || "Failed to create crew member");
                }
            } finally {
                setSubmitting(false);
            }
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

    // ... (Existing View/Edit handlers - simplified for this step as they are mock-based)
    const handleOpenView = (member: CrewMember) => {
        setSelectedCrew(member);
        setIsEditing(false);
        setOpenViewModal(true);
    };

    const handleCloseView = () => {
        setSelectedCrew(null);
        setOpenViewModal(false);
        setIsEditing(false);
    };

    // Placeholder for Edit - purely visual for now since we focus on Create API
    const handleUpdateCrew = () => {
        alert("Update functionality coming soon");
        setOpenViewModal(false);
    };

    const handleToggleStatusClick = (member: CrewMember) => {
        setSelectedCrew(member);
        setOpenConfirmModal(true);
    };

    const confirmStatusChange = () => {
        if (selectedCrew) {
            // Mock status change
            setCrew(crew.map(c => c.id === selectedCrew.id ? { ...c, status: selectedCrew.status === "Active" ? "Inactive" : "Active" } : c));
            setOpenConfirmModal(false);
            setSelectedCrew(null);
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
    const fetchCrew=async()=>{
        try{
            const response= await authControllers.getUsers({user_role:'CREW'});
            console.log("crew fetched raw:", response.data);
            let data : any[]=[];
            if(response.data?.data?.docs && Array.isArray(response.data.data.docs))
            {
                data=response.data.data.docs;

            }
            else{
                console.warn("crew fetched raw:", response.data);
                data=[];
            }
            setCrew(data);
            
        }
        catch(error)
        {
            console.error("Error fetching crew:", error);
            setCrew([]);
            
        }
    };
    useEffect(()=>{
        fetchCrew();
    },[]);


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
                            Crew Management
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
                            Add Crew
                        </Button>
                    </Box>

                    {/* Crew Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid var(--border)", borderRadius: 0, bgcolor: "var(--card-bg)" }}>
                        <Table sx={{ minWidth: 650 }} aria-label="crew table">
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
                                {crew.map((row) => (
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

                    {/* Add Modal */}
                    <Modal open={openAddModal} onClose={handleCloseAddModal}>
                        <Box sx={modalStyle}>
                            <Typography variant="h6" component="h2" mb={3} fontWeight={600} sx={{ fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE }}>
                                Add New Crew Member
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
                                        disabled={formik.isSubmitting}
                                        sx={{
                                            mt: 2,
                                            bgcolor: COLORS.GREEN,
                                            color: COLORS.WHITE,
                                            borderRadius: 0,
                                            fontFamily: 'var(--font-primary) !important',
                                            "&:hover": { bgcolor: COLORS.GREEN_DARK },
                                        }}
                                    >
                                        {formik.isSubmitting ? "Adding..." : "Add Crew"}
                                    </Button>
                                </Stack>
                            </form>
                        </Box>
                    </Modal>

                    {/* View/Edit Modal (Basic) */}
                    <Modal open={openViewModal} onClose={handleCloseView}>
                        <Box sx={modalStyle}>
                            {/* Simplified View/Edit - reusing existing structure manually since focus is on Add API */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight={600} sx={commonStyles}>
                                    {isEditing ? "Edit Crew Details" : "Crew Details"}
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
                                    <Box>
                                        <Typography sx={{ color: 'var(--text-secondary)' }}>Edit functionality pending implementation of specific API.</Typography>
                                    </Box>
                                ) : (
                                    <>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Name</Typography>
                                            <Typography variant="body1" fontWeight={500} sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedCrew?.firstName} {selectedCrew?.lastName}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Email</Typography>
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedCrew?.email}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: COLORS.WHITE, opacity: 0.7, fontFamily: 'var(--font-primary) !important' }}>Role</Typography>
                                            <Typography variant="body1" sx={{ color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important', fontSize: '1.1rem' }}>{selectedCrew?.role}</Typography>
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
                                {selectedCrew?.status === "Active" ? "Disable Crew Member" : "Enable Crew Member"}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3, color: "var(--text-secondary)", fontFamily: 'var(--font-primary) !important' }}>
                                Are you sure you want to {selectedCrew?.status === "Active" ? "disable" : "enable"} this crew member's account?
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
