"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  TablePagination,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "@/utils/enum";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchAdmins,
  createAdmin,
  clearError,
  updateAdminStatus,
} from "@/redux/slices/adminSlice";

export default function AdminManagementLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const { admins, loading, error, createLoading } = useSelector(
    (state: RootState) => state.admin
  );

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showMessage = (message: string, severity: AlertColor = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setUserRole(storedRole);
  }, []);

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showMessage(error, "error");
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

  const confirmStatusChange = async () => {
    if (selectedAdmin) {
      const newStatus = !(
        selectedAdmin.status === "Active" || selectedAdmin.isActive === true
      );
      const resultAction = await dispatch(
        updateAdminStatus({
          id: selectedAdmin.id || selectedAdmin._id,
          status: newStatus,
        })
      );
      if (updateAdminStatus.fulfilled.match(resultAction)) {
        showMessage(
          `Admin ${newStatus ? "enabled" : "disabled"} successfully`
        );
        setOpenConfirmModal(false);
        setSelectedAdmin(null);
      }
    }
  };

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: COLORS.WHITE,
    color: COLORS.TEXT_PRIMARY,
    boxShadow: 24,
    border: `1px solid ${COLORS.ACCENT}`,
    borderRadius: "10px",
    p: 4,
    outline: "none",
    fontFamily: "var(--font-primary) !important",
  };

  const confirmModalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: COLORS.WHITE,
    color: COLORS.TEXT_PRIMARY,
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
    outline: "none",
    border: `1px solid ${COLORS.ACCENT}`,
    textAlign: "center",
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
    "& .MuiInputBase-input": {
      fontFamily: "var(--font-primary) !important",
      color: COLORS.TEXT_PRIMARY,
    },
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().min(6).required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await dispatch(createAdmin(values));
      if (createAdmin.fulfilled.match(res)) {
        showMessage("Admin created successfully!");
        setOpenAddModal(false);
        formik.resetForm();
        dispatch(fetchAdmins());
      }
      setSubmitting(false);
    },
  });

  const handleOpenAdd = () => {
    formik.resetForm();
    setOpenAddModal(true);
  };

  const commonStyles = {
    fontFamily: "var(--font-primary) !important",
    color: COLORS.TEXT_PRIMARY,
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Box
        sx={{
          width: "20%",
          height: "100%",
          overflowY: "auto",
          borderRight: `1px solid ${COLORS.FOREGROUND}`,
        }}
      >
        <Sidebar />
      </Box>

      <Box sx={{ width: "80%", display: "flex", flexDirection: "column" }}>
        <Navbar />

        <Box
          sx={{
            p: 3,
            flexGrow: 1,
            overflowY: "auto",
            bgcolor: COLORS.FOREGROUND,
          }}
        >
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              sx={commonStyles}
            >
              Admin Management
            </Typography>

            {userRole === "SUPERADMIN" && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAdd}
                sx={{
                  bgcolor: COLORS.ACCENT,
                  color: COLORS.WHITE,
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  fontFamily: "var(--font-primary) !important",
                  "&:hover": {
                    bgcolor: "#0052E0",
                  },
                }}
              >
                Add Admin
              </Button>
            )}
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              bgcolor: COLORS.WHITE,
              border: `1px solid ${COLORS.FOREGROUND}`,
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.WHITE }}>
                  <TableCell
                    sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 600, fontFamily: "var(--font-primary) !important" }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 600, fontFamily: "var(--font-primary) !important" }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 600, fontFamily: "var(--font-primary) !important" }}
                  >
                    Role
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 600, fontFamily: "var(--font-primary) !important" }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 600, fontFamily: "var(--font-primary) !important" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow key="loading-row">
                    <TableCell colSpan={5} align="center" sx={commonStyles}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  (rowsPerPage > 0
                    ? admins?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : admins
                  )?.map((row: any, index: number) => (
                    <TableRow
                      key={row._id || row.id || `admin-${index}`}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        opacity:
                          row.status === "Active" || row.isActive === true
                            ? 1
                            : 0.6,
                        bgcolor:
                          row.status === "Active" || row.isActive === true
                            ? "transparent"
                            : "rgba(0,0,0,0.02)",
                      }}
                    >
                      <TableCell sx={commonStyles}>
                        {row.name || `${row.firstName} ${row.lastName}`}
                      </TableCell>
                      <TableCell sx={commonStyles}>
                        {row.email}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.role || "Admin"}
                          size="small"
                          sx={{
                            bgcolor: COLORS.ACCENT,
                            color: COLORS.WHITE,
                            borderRadius: "10px",
                            fontFamily: "var(--font-primary) !important",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={
                            row.status === "Active" || row.isActive === true
                          }
                          onChange={() => handleToggleStatusClick(row)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          sx={{ color: COLORS.ACCENT }}
                          onClick={() => handleOpenView(row)}
                        >
                          <RemoveRedEyeIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={admins?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              sx={{
                color: COLORS.TEXT_PRIMARY,
                "& .MuiTablePagination-selectIcon": {
                  color: COLORS.TEXT_PRIMARY,
                },
                "& .MuiTablePagination-actions": {
                  color: COLORS.TEXT_PRIMARY,
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  fontFamily: "var(--font-primary) !important"
                }
              }}
            />
          </TableContainer>

          {/* ADD MODAL */}
          <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
            <Box sx={modalStyle}>
              <Typography variant="h6" mb={3} sx={commonStyles} fontWeight={600}>
                Add New Admin
              </Typography>

              <form onSubmit={formik.handleSubmit} autoComplete="off">
                <Stack spacing={2}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    sx={textFieldStyle}
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    autoComplete="off"
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    sx={textFieldStyle}
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    autoComplete="off"
                  />
                  <TextField
                    label="Email"
                    name="email"
                    sx={textFieldStyle}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    autoComplete="new-password"
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    sx={textFieldStyle}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    autoComplete="new-password"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={createLoading || formik.isSubmitting}
                    sx={{
                      bgcolor: COLORS.ACCENT,
                      color: COLORS.WHITE,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontFamily: "var(--font-primary) !important",
                      "&:hover": { bgcolor: "#0052E0" },
                    }}
                  >
                    {createLoading ? "Creating..." : "Create Admin"}
                  </Button>
                </Stack>
              </form>
            </Box>
          </Modal>

          {/* VIEW MODAL */}
          <Modal open={openViewModal} onClose={handleCloseView}>
            <Box sx={modalStyle}>
              {selectedAdmin && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" sx={commonStyles} fontWeight={600}>
                      Admin Details
                    </Typography>
                    <IconButton
                      onClick={handleCloseView}
                      sx={{ color: COLORS.TEXT_PRIMARY }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: "var(--font-primary) !important" }}>Name</Typography>
                      <Typography variant="body1" fontWeight={500} sx={{ ...commonStyles, fontSize: '1.1rem' }}>
                        {selectedAdmin.name || `${selectedAdmin.firstName} ${selectedAdmin.lastName}`}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: "var(--font-primary) !important" }}>Email</Typography>
                      <Typography variant="body1" sx={{ ...commonStyles, fontSize: '1.1rem' }}>{selectedAdmin.email}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: "var(--font-primary) !important" }}>Role</Typography>
                      <Typography variant="body1" sx={{ ...commonStyles, fontSize: '1.1rem' }}>{selectedAdmin.role}</Typography>
                    </Box>
                  </Stack>
                </>
              )}
            </Box>
          </Modal>

          {/* Confirmation Pop-up */}
          <Modal
            open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
          >
            <Box sx={confirmModalStyle}>
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                sx={commonStyles}
              >
                {(selectedAdmin?.status === "Active" ||
                  selectedAdmin?.isActive === true)
                  ? "Disable Admin"
                  : "Enable Admin"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: COLORS.TEXT_SECONDARY,
                  fontFamily: "var(--font-primary) !important",
                }}
              >
                Are you sure you want to{" "}
                {(selectedAdmin?.status === "Active" ||
                  selectedAdmin?.isActive === true)
                  ? "disable"
                  : "enable"}{" "}
                this admin&#39;s profile?
              </Typography>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenConfirmModal(false)}
                  sx={{
                    borderRadius: "10px",
                    color: COLORS.ACCENT,
                    borderColor: COLORS.ACCENT,
                    minWidth: 100,
                    fontFamily: "var(--font-primary) !important",
                    "&:hover": {
                      borderColor: COLORS.ACCENT,
                      bgcolor: "rgba(22, 93, 255, 0.05)",
                    },
                  }}
                >
                  NO
                </Button>
                <Button
                  variant="contained"
                  onClick={confirmStatusChange}
                  sx={{
                    borderRadius: "10px",
                    bgcolor: COLORS.ACCENT,
                    color: COLORS.WHITE,
                    minWidth: 100,
                    fontFamily: "var(--font-primary) !important",
                    "&:hover": { bgcolor: "#0052E0" },
                  }}
                >
                  YES
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box >
      </Box >

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontFamily: "var(--font-primary)",
            fontWeight: 600,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box >
  );
}