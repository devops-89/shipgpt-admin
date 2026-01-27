"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { scienceGothic } from "@/utils/fonts";
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
  CircularProgress,
  useTheme,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "@/utils/enum";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchCrew,
  createCrew,
  clearError,
  updateCrewStatus,
  fetchCrewDetails,
} from "@/redux/slices/crewSlice";

export default function CrewManagementLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    crew,
    loading,
    error,
    createLoading,
    selectedCrewDetails,
    detailsLoading,
  } = useSelector((state: RootState) => state.crew);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userRole, setUserRole] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
    reason?: string,
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
    dispatch(fetchCrew());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showMessage(error, "error");
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
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const resultAction = await dispatch(createCrew(values));
      if (createCrew.fulfilled.match(resultAction)) {
        const newCrewId =
          resultAction.payload?.data?._id ||
          resultAction.payload?._id ||
          resultAction.payload?.data?.id ||
          resultAction.payload?.id;
        if (newCrewId) {
          await dispatch(updateCrewStatus({ id: newCrewId, status: true }));
        }

        showMessage("Crew member created successfully!");
        setOpenAddModal(false);
        formik.resetForm();
        dispatch(fetchCrew());
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

  const handleOpenView = (member: any) => {
    router.push(`/crew-management/${member.id || member._id}`);
  };

  const handleCloseView = () => {
    setSelectedCrew(null);
    setOpenViewModal(false);
    setIsEditing(false);
  };

  const handleUpdateCrew = () => {
    showMessage("Update functionality coming soon", "info");
    setOpenViewModal(false);
  };

  const handleToggleStatusClick = (member: any) => {
    setSelectedCrew(member);
    setOpenConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    if (selectedCrew) {
      const newStatus = !(
        selectedCrew.status === "Active" || selectedCrew.isActive === true
      );
      const resultAction = await dispatch(
        updateCrewStatus({
          id: selectedCrew.id || selectedCrew._id,
          status: newStatus,
        }),
      );
      if (updateCrewStatus.fulfilled.match(resultAction)) {
        showMessage(
          `Crew member ${newStatus ? "enabled" : "disabled"} successfully`,
        );
        setOpenConfirmModal(false);
        setSelectedCrew(null);
      }
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
    width: "90%",
    maxWidth: 500,
    maxHeight: "90vh",
    overflowY: "auto",
    bgcolor: COLORS.WHITE,
    color: COLORS.TEXT_PRIMARY,
    boxShadow: 24,
    border: `1px solid ${COLORS.ACCENT}`,
    borderRadius: "10px",
    p: 4,
    outline: "none",
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

  const confirmModalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 400,
    maxHeight: "90vh",
    overflowY: "auto",
    bgcolor: COLORS.WHITE,
    color: COLORS.TEXT_PRIMARY,
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
    outline: "none",
    border: `1px solid ${COLORS.ACCENT}`,
    textAlign: "center",
  };

  return (
    <Box
      className={scienceGothic.className}
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: COLORS.FOREGROUND,
      }}
    >
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: "260px",
            height: "100%",
            overflowY: "auto",
            borderRight: `1px solid ${COLORS.FOREGROUND}`,
            bgcolor: COLORS.WHITE,
          }}
        >
          <Sidebar />
        </Box>
      )}

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 260,
            bgcolor: COLORS.WHITE,
          },
        }}
      >
        <Sidebar />
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "100%" : "calc(100% - 260px)",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Navbar onMenuClick={handleDrawerToggle} />
        <Box
          sx={{
            p: 3,
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            bgcolor: COLORS.FOREGROUND,
          }}
        >
          <Box
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
            }}
          >
            <Typography variant="h4" fontWeight={700} sx={commonStyles}>
              Crew Management
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
                Add Crew
              </Button>
            )}
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: `1px solid ${COLORS.FOREGROUND}`,
              borderRadius: "10px",
              bgcolor: COLORS.WHITE,
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="crew table">
              <TableHead sx={{ bgcolor: COLORS.WHITE }}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                      fontFamily: "var(--font-primary) !important",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                      fontFamily: "var(--font-primary) !important",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                      fontFamily: "var(--font-primary) !important",
                    }}
                  >
                    Role
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                      fontFamily: "var(--font-primary) !important",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: COLORS.TEXT_PRIMARY,
                      fontFamily: "var(--font-primary) !important",
                    }}
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
                      sx={{ ...commonStyles, py: 4 }}
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  (rowsPerPage > 0
                    ? crew?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                    : crew
                  )?.map((row) => (
                    <TableRow
                      key={row.id || row._id || Math.random()}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          fontWeight: 500,
                          color: COLORS.TEXT_PRIMARY,
                          fontFamily: "var(--font-primary) !important",
                        }}
                      >
                        {row.firstName} {row.lastName}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: COLORS.TEXT_PRIMARY,
                          fontFamily: "var(--font-primary) !important",
                        }}
                      >
                        {row.email}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.role || "Crew"}
                          size="small"
                          sx={{
                            borderRadius: "10px",
                            bgcolor: COLORS.ACCENT,
                            color: COLORS.WHITE,
                            fontWeight: 500,
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
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: COLORS.ACCENT,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: COLORS.ACCENT,
                            },
                          }}
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={crew?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              sx={{
                color: COLORS.TEXT_PRIMARY,
                fontFamily: "var(--font-primary) !important",
                "& .MuiTablePagination-selectIcon": {
                  color: COLORS.TEXT_PRIMARY,
                },
                "& .MuiTablePagination-actions": {
                  color: COLORS.TEXT_PRIMARY,
                },
                "& .MuiTablePagination-select": {
                  fontFamily: "var(--font-primary) !important",
                },
                "& .MuiTablePagination-selectLabel": {
                  fontFamily: "var(--font-primary) !important",
                },
                "& .MuiTablePagination-displayedRows": {
                  fontFamily: "var(--font-primary) !important",
                },
              }}
            />
          </TableContainer>

          <Modal open={openAddModal} onClose={handleCloseAddModal}>
            <Box sx={modalStyle}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  fontWeight={600}
                  sx={{
                    fontFamily: "var(--font-primary) !important",
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  Add New Crew Member
                </Typography>
                <IconButton
                  onClick={handleCloseAddModal}
                  sx={{ color: COLORS.TEXT_PRIMARY }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
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
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={createLoading || formik.isSubmitting}
                    sx={{
                      mt: 2,
                      bgcolor: COLORS.ACCENT,
                      color: COLORS.WHITE,
                      borderRadius: "10px",
                      fontFamily: "var(--font-primary) !important",
                      "&:hover": { bgcolor: "#0052E0" },
                    }}
                  >
                    {createLoading ? "Adding..." : "Add Crew"}
                  </Button>
                </Stack>
              </form>
            </Box>
          </Modal>

          <Modal open={openViewModal} onClose={handleCloseView}>
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
                  {isEditing ? "Edit Crew Details" : "Crew Details"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {!isEditing && (
                    <IconButton
                      onClick={() => setIsEditing(true)}
                      sx={{ color: COLORS.TEXT_PRIMARY, mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={handleCloseView}
                    sx={{ color: "var(--text-secondary)" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
              <Stack spacing={2}>
                {isEditing ? (
                  <Box>
                    <Typography sx={{ color: "var(--text-secondary)" }}>
                      Edit functionality pending implementation of specific API.
                    </Typography>
                  </Box>
                ) : detailsLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 4 }}
                  >
                    <CircularProgress size={40} sx={{ color: COLORS.ACCENT }} />
                  </Box>
                ) : (
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
                        {selectedCrewDetails?.firstName}{" "}
                        {selectedCrewDetails?.lastName}
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
                        {selectedCrewDetails?.email}
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
                        {selectedCrewDetails?.role || "Crew"}
                      </Typography>
                    </Box>
                    {selectedCrewDetails?.ship && (
                      <>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: COLORS.TEXT_SECONDARY,
                              fontFamily: "var(--font-primary) !important",
                            }}
                          >
                            Ship Name
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: COLORS.TEXT_PRIMARY,
                              fontFamily: "var(--font-primary) !important",
                              fontSize: "1.1rem",
                            }}
                          >
                            {selectedCrewDetails?.ship?.name || "N/A"}
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
                            Ship IMO
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: COLORS.TEXT_PRIMARY,
                              fontFamily: "var(--font-primary) !important",
                              fontSize: "1.1rem",
                            }}
                          >
                            {selectedCrewDetails?.ship?.IMO || "N/A"}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </>
                )}
              </Stack>
            </Box>
          </Modal>

          <Modal
            open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
          >
            <Box sx={confirmModalStyle}>
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                sx={{
                  color: COLORS.TEXT_PRIMARY,
                  fontFamily: "var(--font-primary) !important",
                }}
              >
                {selectedCrew?.status === "Active" ||
                  selectedCrew?.isActive === true
                  ? "Disable Crew Member"
                  : "Enable Crew Member"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-primary) !important",
                }}
              >
                Are you sure you want to{" "}
                {selectedCrew?.status === "Active" ||
                  selectedCrew?.isActive === true
                  ? "disable"
                  : "enable"}{" "}
                this crew member&#39;s account?
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
        </Box>
      </Box>

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
    </Box>
  );
}
