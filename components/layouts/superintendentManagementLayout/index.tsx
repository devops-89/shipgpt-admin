"use client";
import { useState } from "react";
import { useEffect } from "react";
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
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { COLORS } from "@/utils/enum";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchSuperintendents,
  createSuperintendent,
  clearError,
} from "@/redux/slices/superintendentSlice";

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
  const { superintendents, loading, error, createLoading } = useSelector(
    (state: RootState) => state.superintendent
  );

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedSuperintendent, setSelectedSuperintendent] =
    useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setUserRole(storedRole);
  }, []);

  useEffect(() => {
    dispatch(fetchSuperintendents());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (isEditing) {
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

  const handleOpenView = (member: any) => {
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
        password: "",
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

  const handleToggleStatusClick = (superintendent: any) => {
    setSelectedSuperintendent(superintendent);
    setOpenConfirmModal(true);
  };

  const confirmStatusChange = () => {
    if (selectedSuperintendent) {
      toast.info("Status update functionality pending API integration");
      setOpenConfirmModal(false);
      setSelectedSuperintendent(null);
    }
  };

  const commonStyles = {
    fontFamily: "var(--font-primary) !important",
    color: COLORS.TEXT_PRIMARY,
  };

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 500 },
    bgcolor: COLORS.WHITE,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "var(--font-primary) !important",
    boxShadow: 24,
    border: `1px solid ${COLORS.ACCENT}`,
    borderRadius: "10px",
    p: 4,
    outline: "none",
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
    "& .MuiFormHelperText-root": {
      fontFamily: "var(--font-primary) !important",
    },
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

      <Box
        sx={{
          width: "80%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "start", sm: "center" },
              gap: 2,
            }}
          >
            <Typography variant="h4" fontWeight={700} sx={commonStyles}>
              Superintendent Management
            </Typography>
            {userRole === "ADMIN" && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAdd}
                sx={{
                  width: { xs: "100%", sm: "auto" },
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
                Add Superintendent
              </Button>
            )}
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: `1px solid ${COLORS.FOREGROUND}`,
              bgcolor: COLORS.WHITE,
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.WHITE }}>
                  <TableCell
                    sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 600 }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 600 }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 600 }}
                  >
                    Role
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 600 }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 600 }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 4, color: COLORS.FOREGROUND }}
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  superintendents.map((row: any) => (
                    <TableRow key={row.id || row._id}>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>
                        {row.firstName} {row.lastName}
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>
                        {row.email}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.role || "Superintendent"}
                          size="small"
                          sx={{
                            borderRadius: "10px",
                            bgcolor: COLORS.ACCENT,
                            color: COLORS.WHITE,
                            fontFamily: "var(--font-primary) !important",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={row.status === "Active" || row.isActive}
                          onChange={() => handleToggleStatusClick(row)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleOpenView(row)}
                          sx={{ color: COLORS.ACCENT }}
                        >
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
          <Modal
            open={openAddModal || openViewModal}
            onClose={
              openAddModal ? () => setOpenAddModal(false) : handleCloseView
            }
          >
            <Box sx={modalStyle}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight={600} sx={commonStyles}>
                  {openAddModal
                    ? "Add New Superintendent"
                    : isEditing
                    ? "Edit Superintendent Details"
                    : "Superintendent Details"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {!openAddModal && !isEditing && (
                    <IconButton
                      onClick={handleEditClick}
                      sx={{ color: COLORS.ACCENT, mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={
                      openAddModal
                        ? () => setOpenAddModal(false)
                        : handleCloseView
                    }
                    sx={{ color: COLORS.TEXT_SECONDARY }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              <Stack spacing={2}>
                {!openAddModal && !isEditing ? (
                  <>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: COLORS.TEXT_SECONDARY,
                          fontFamily: "var(--font-primary) !important",
                        }}
                      >
                        Name
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{
                          color: COLORS.TEXT_PRIMARY,
                          fontFamily: "var(--font-primary) !important",
                          fontSize: "1.1rem",
                        }}
                      >
                        {selectedSuperintendent?.firstName}{" "}
                        {selectedSuperintendent?.lastName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: COLORS.TEXT_SECONDARY,
                          fontFamily: "var(--font-primary) !important",
                        }}
                      >
                        Email
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: COLORS.TEXT_PRIMARY,
                          fontFamily: "var(--font-primary) !important",
                          fontSize: "1.1rem",
                        }}
                      >
                        {selectedSuperintendent?.email}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: COLORS.TEXT_SECONDARY,
                          fontFamily: "var(--font-primary) !important",
                        }}
                      >
                        Role
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: COLORS.TEXT_PRIMARY,
                          fontFamily: "var(--font-primary) !important",
                          fontSize: "1.1rem",
                        }}
                      >
                        {selectedSuperintendent?.role || "Superintendent"}
                      </Typography>
                    </Box>
                  </>
                ) : (
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
                          error={
                            formik.touched.firstName &&
                            Boolean(formik.errors.firstName)
                          }
                          helperText={
                            formik.touched.firstName && formik.errors.firstName
                          }
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
                          error={
                            formik.touched.lastName &&
                            Boolean(formik.errors.lastName)
                          }
                          helperText={
                            formik.touched.lastName && formik.errors.lastName
                          }
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
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
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
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                          }
                          helperText={
                            formik.touched.password && formik.errors.password
                          }
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
                          borderRadius: "10px",
                          fontFamily: "var(--font-primary) !important",
                          "&:hover": { bgcolor: COLORS.GREEN_DARK },
                        }}
                      >
                        {openAddModal
                          ? createLoading
                            ? "Adding..."
                            : "Add Superintendent"
                          : "Save Changes"}
                      </Button>
                    </Stack>
                  </form>
                )}
              </Stack>
            </Box>
          </Modal>

          {/* Confirm Modal */}
          <Modal
            open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
          >
            <Box sx={confirmModalStyle}>
              <Typography fontWeight={700} color={COLORS.TEXT_PRIMARY} mb={2}>
                {selectedSuperintendent?.status === "Active"
                  ? "Disable Superintendent"
                  : "Enable Superintendent"}
              </Typography>
              <Typography sx={{ my: 3, color: COLORS.TEXT_PRIMARY }}>
                Are you sure you want to continue?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenConfirmModal(false)}
                  sx={{ borderRadius: "10px" }}
                >
                  NO
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: COLORS.ACCENT,
                    color: COLORS.WHITE,
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "#0052E0" },
                  }}
                  onClick={confirmStatusChange}
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
