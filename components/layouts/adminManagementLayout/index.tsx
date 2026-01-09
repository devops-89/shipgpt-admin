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
  Switch,
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

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setUserRole(storedRole);
  }, []);

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

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
    toast.info("Status update logic pending API integration");
    setOpenConfirmModal(false);
    setSelectedAdmin(null);
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
      "& fieldset": { borderColor: COLORS.FOREGROUND },
      "&:hover fieldset": { borderColor: COLORS.ACCENT },
      "&.Mui-focused fieldset": { borderColor: COLORS.ACCENT },
    },
    "& .MuiInputLabel-root": { color: COLORS.TEXT_SECONDARY },
    "& .MuiInputLabel-root.Mui-focused": { color: COLORS.ACCENT },
    "& .MuiInputBase-input": { color: COLORS.TEXT_PRIMARY },
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
        toast.success("Admin created successfully!");
        setOpenAddModal(false);
        formik.resetForm();
        dispatch(fetchAdmins());
      }
      setSubmitting(false);
    },
  });

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
              color={COLORS.TEXT_PRIMARY}
            >
              Admin Management
            </Typography>

            {userRole === "SUPERADMIN" && (
              <Button
                startIcon={<AddIcon />}
                onClick={() => setOpenAddModal(true)}
                sx={{
                  bgcolor: COLORS.ACCENT,
                  color: COLORS.WHITE,
                  borderRadius: "10px",
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
                    <TableCell colSpan={5} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  admins?.map((row: any) => (
                    <TableRow key={row._id}>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>
                        {row.name || `${row.firstName} ${row.lastName}`}
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>
                        {row.email}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.role || "Admin"}
                          sx={{
                            bgcolor: COLORS.ACCENT,
                            color: COLORS.WHITE,
                            borderRadius: "10px",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={row.isActive}
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
          </TableContainer>

          {/* ADD MODAL */}
          <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
            <Box sx={modalStyle}>
              <Typography variant="h6" mb={3} color={COLORS.TEXT_PRIMARY}>
                Add New Admin
              </Typography>

              <form onSubmit={formik.handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    sx={textFieldStyle}
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    sx={textFieldStyle}
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    sx={textFieldStyle}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    sx={textFieldStyle}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />

                  <Button
                    type="submit"
                    disabled={createLoading}
                    sx={{
                      bgcolor: COLORS.GREEN,
                      color: COLORS.WHITE,
                      borderRadius: "10px",
                      "&:hover": { bgcolor: COLORS.GREEN_DARK },
                    }}
                  >
                    Create Admin
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
                  <Typography variant="h6" mb={2} color={COLORS.TEXT_PRIMARY}>
                    Admin Details
                  </Typography>
                  <Typography color={COLORS.TEXT_PRIMARY}>
                    Name:{" "}
                    {selectedAdmin.name ||
                      `${selectedAdmin.firstName} ${selectedAdmin.lastName}`}
                  </Typography>
                  <Typography color={COLORS.TEXT_PRIMARY}>
                    Email: {selectedAdmin.email}
                  </Typography>
                  <Typography color={COLORS.TEXT_PRIMARY}>
                    Role: {selectedAdmin.role}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label="User Mgmt"
                      sx={{
                        bgcolor: COLORS.ACCENT,
                        color: COLORS.WHITE,
                        borderRadius: "10px",
                      }}
                    />
                    <Chip
                      label="PDF Mgmt"
                      sx={{
                        mx: 1,
                        bgcolor: COLORS.ACCENT,
                        color: COLORS.WHITE,
                        borderRadius: "10px",
                      }}
                    />
                    <Chip
                      label="Settings"
                      sx={{
                        bgcolor: COLORS.ACCENT,
                        color: COLORS.WHITE,
                        borderRadius: "10px",
                      }}
                    />
                  </Box>
                  <Button
                    sx={{
                      mt: 3,
                      bgcolor: COLORS.ACCENT,
                      color: COLORS.WHITE,
                      borderRadius: "10px",
                      "&:hover": { bgcolor: "#0052E0" },
                    }}
                    onClick={handleCloseView}
                  >
                    Close
                  </Button>
                </>
              )}
            </Box>
          </Modal>

          {/* CONFIRM MODAL */}
          <Modal
            open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
          >
            <Box sx={confirmModalStyle}>
              <Typography color={COLORS.TEXT_PRIMARY} mb={2}>
                Are you sure?
              </Typography>
              <Button
                onClick={confirmStatusChange}
                sx={{
                  bgcolor: COLORS.ACCENT,
                  color: COLORS.WHITE,
                  borderRadius: "10px",
                  "&:hover": { bgcolor: "#0052E0" },
                }}
              >
                YES
              </Button>
            </Box>
          </Modal>
        </Box>
      </Box>
    </Box>
  );
}
