"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { scienceGothic } from "@/utils/fonts";
import Sidebar from "@/components/widgets/Sidebar";
import Navbar from "@/components/widgets/Navbar";
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
  TextField,
  TablePagination,
  Snackbar,
  Alert,
  AlertColor,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { COLORS } from "@/utils/enum";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers, updateUser, clearError } from "@/redux/slices/userSlice";

export default function UserManagementLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user,
  );

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
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
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showMessage(error, "error");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleOpenView = (user: any) => {
    router.push(`/users-management/${user.id || user._id}`);
  };

  const handleToggleStatusClick = (user: any) => {
    setSelectedUser(user);
    setOpenConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUser) return;
    try {
      const isActive =
        selectedUser.status === "Active" || selectedUser.isActive === true;
      await dispatch(
        updateUser({
          id: selectedUser.id || selectedUser._id,
          data: { isActive: !isActive },
        }),
      ).unwrap();

      showMessage(`User ${!isActive ? "enabled" : "disabled"} successfully`);
      setOpenConfirmModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      showMessage(err || "Failed to update status", "error");
    }
  };

  const commonStyles = {
    fontFamily: "var(--font-primary) !important",
    color: COLORS.TEXT_PRIMARY,
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

  const textFieldSx = {
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

  const filteredUsers = users.filter((u: any) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

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
          keepMounted: true,
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
              User Management
            </Typography>

            <TextField
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              sx={{
                width: { xs: "100%", sm: 300 },
                ...textFieldSx,
              }}
            />
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              bgcolor: COLORS.WHITE,
              border: `1px solid ${COLORS.FOREGROUND}`,
              borderRadius: "10px",
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.WHITE }}>
                  <TableCell
                    sx={{
                      color: COLORS.TEXT_PRIMARY,
                      fontWeight: 600,
                      fontFamily: "var(--font-primary) !important",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: COLORS.TEXT_PRIMARY,
                      fontWeight: 600,
                      fontFamily: "var(--font-primary) !important",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: COLORS.TEXT_PRIMARY,
                      fontWeight: 600,
                      fontFamily: "var(--font-primary) !important",
                    }}
                  >
                    Role
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: COLORS.TEXT_PRIMARY,
                      fontWeight: 600,
                      fontFamily: "var(--font-primary) !important",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: COLORS.TEXT_PRIMARY,
                      fontWeight: 600,
                      fontFamily: "var(--font-primary) !important",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow key="loading-row">
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 4, ...commonStyles }}
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  (rowsPerPage > 0
                    ? filteredUsers.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                    : filteredUsers
                  ).map((row: any, index: number) => (
                    <TableRow key={row._id || row.id || `user-${index}`}>
                      <TableCell sx={commonStyles}>
                        {row.firstName} {row.lastName}
                      </TableCell>
                      <TableCell sx={commonStyles}>{row.email}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.role || "User"}
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            sx={{
              color: COLORS.TEXT_PRIMARY,
              ".MuiTablePagination-selectIcon": {
                color: COLORS.TEXT_PRIMARY,
              },
              ".MuiTablePagination-actions": {
                color: COLORS.TEXT_PRIMARY,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontFamily: "var(--font-primary) !important",
                },
            }}
          />

          <Modal
            open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
          >
            <Box className={scienceGothic.className} sx={confirmModalStyle}>
              <Typography
                fontWeight={700}
                sx={commonStyles}
                variant="h6"
                mb={2}
              >
                {selectedUser?.status === "Active"
                  ? "Disable User"
                  : "Enable User"}
              </Typography>
              <Typography
                sx={{
                  my: 3,
                  color: COLORS.TEXT_SECONDARY,
                  fontFamily: "var(--font-primary) !important",
                }}
              >
                Are you sure you want to{" "}
                {selectedUser?.status === "Active" ? "disable" : "enable"} this
                user&#39;s account?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
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
                  No
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: COLORS.ACCENT,
                    color: COLORS.WHITE,
                    borderRadius: "10px",
                    minWidth: 100,
                    fontFamily: "var(--font-primary) !important",
                    "&:hover": { bgcolor: "#0052E0" },
                  }}
                  onClick={confirmStatusChange}
                >
                  Yes
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
