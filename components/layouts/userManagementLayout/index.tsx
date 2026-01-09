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
  TextField,
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
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

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
    if (!selectedUser) return;
    try {
      const isActive =
        selectedUser.status === "Active" || selectedUser.isActive === true;
      await dispatch(
        updateUser({
          id: selectedUser.id || selectedUser._id,
          data: { isActive: !isActive },
        })
      ).unwrap();

      toast.success(`User ${!isActive ? "enabled" : "disabled"} successfully`);
      setOpenConfirmModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err || "Failed to update status");
    }
  };

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 500 },
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

  const textFieldSx = {
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
          <Typography
            variant="h4"
            fontWeight={700}
            color={COLORS.TEXT_PRIMARY}
            sx={{ mb: 4 }}
          >
            User Management
          </Typography>

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
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 4, color: COLORS.TEXT_PRIMARY }}
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((row: any) => (
                    <TableRow key={row.id || row._id}>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>
                        {row.firstName} {row.lastName}
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>
                        {row.email}
                      </TableCell>
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

          {/* View / Edit Modal */}
          <Modal open={openViewModal} onClose={handleCloseView}>
            <Box sx={modalStyle}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color={COLORS.TEXT_PRIMARY}
                >
                  {isEditing ? "Edit User Details" : "User Details"}
                </Typography>
                <Box>
                  {!isEditing && (
                    <IconButton
                      onClick={() => setIsEditing(true)}
                      sx={{ color: COLORS.ACCENT }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={handleCloseView}
                    sx={{ color: COLORS.TEXT_PRIMARY }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              {isEditing ? (
                <Stack spacing={2}>
                  <TextField
                    label="First Name"
                    value={selectedUser?.firstName || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        firstName: e.target.value,
                      })
                    }
                    sx={textFieldSx}
                  />
                  <TextField
                    label="Last Name"
                    value={selectedUser?.lastName || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        lastName: e.target.value,
                      })
                    }
                    sx={textFieldSx}
                  />
                  <TextField
                    label="Role"
                    value={selectedUser?.role || ""}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, role: e.target.value })
                    }
                    sx={textFieldSx}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: COLORS.ACCENT,
                      color: COLORS.WHITE,
                      borderRadius: "10px",
                      "&:hover": { bgcolor: "#0052E0" },
                    }}
                    onClick={async () => {
                      try {
                        await dispatch(
                          updateUser({
                            id: selectedUser.id || selectedUser._id,
                            data: {
                              firstName: selectedUser.firstName,
                              lastName: selectedUser.lastName,
                              role: selectedUser.role,
                            },
                          })
                        ).unwrap();
                        toast.success("User updated successfully");
                        setIsEditing(false);
                      } catch (err: any) {
                        toast.error(err || "Failed to update user");
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <Typography sx={{ color: COLORS.TEXT_PRIMARY }}>
                    <strong>Name:</strong> {selectedUser?.firstName}{" "}
                    {selectedUser?.lastName}
                  </Typography>
                  <Typography sx={{ color: COLORS.TEXT_PRIMARY }}>
                    <strong>Email:</strong> {selectedUser?.email}
                  </Typography>
                  <Typography sx={{ color: COLORS.TEXT_PRIMARY }}>
                    <strong>Role:</strong> {selectedUser?.role}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Modal>

          {/* Confirm Modal */}
          <Modal
            open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
          >
            <Box sx={confirmModalStyle}>
              <Typography fontWeight={700} color={COLORS.TEXT_PRIMARY} mb={2}>
                {selectedUser?.status === "Active"
                  ? "Disable User"
                  : "Enable User"}
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
