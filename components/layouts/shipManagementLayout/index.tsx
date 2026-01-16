"use client";
import { useState, useRef, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Switch,
  Snackbar,
  Alert,
  AlertColor,
  Checkbox,
  Avatar,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import { COLORS } from "@/utils/enum";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchShips,
  createShip,
  fetchShipDetails,
  clearError,
  assignCrewToShip,
  assignSuperintendentsToShip,
} from "@/redux/slices/shipSlice";
import { fetchCrew } from "@/redux/slices/crewSlice";
import { fetchSuperintendents } from "@/redux/slices/superintendentSlice";
import { shipControllers } from "@/api/ship";

interface ShipDocument {
  id?: string | number;
  name: string;
  file?: File;
  downloadUrl?: string;
}
interface Ship {
  id: number | string;
  name: string;
  imo: string;
  status: string;
  documents: Record<string, ShipDocument[]>;
  adminName?: string;
  crewMembers?: any[];
  superintendents?: any[];
}

const CATEGORIES = ["Compliance", "Crewing", "Mechanical"];

export default function ShipManagementLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    ships,
    selectedShip: reduxSelectedShip,
    loading,
    error,
    createLoading,
  } = useSelector((state: RootState) => state.ship);
  const { crew } = useSelector((state: RootState) => state.crew);
  const { superintendents } = useSelector((state: RootState) => state.superintendent);

  const displayShips = ships.map((item: any) => ({
    id: item._id || item.id,
    name: item.name,
    imo: item.IMO || item.imo,
    status: item.status || "Active",
    documents: item.documents || {
      Compliance: [],
      Crewing: [],
      Mechanical: [],
    },
  }));

  useEffect(() => {
    dispatch(fetchShips());
    dispatch(fetchCrew());
    dispatch(fetchSuperintendents());
  }, [dispatch]);

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
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showMessage = (message: string, severity: AlertColor = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    if (error) {
      showMessage(error, "error");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCrewModal, setOpenCrewModal] = useState(false);
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedCrewIds, setSelectedCrewIds] = useState<(string | number)[]>([]);
  const [selectedSuperintendentIds, setSelectedSuperintendentIds] = useState<(string | number)[]>([]);
  const [crewSearch, setCrewSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setUserRole(storedRole);
  }, []);

  const [name, setName] = useState("");
  const [imo, setImo] = useState("");
  const [adminName, setAdminName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pendingDocuments, setPendingDocuments] = useState<
    Record<string, ShipDocument[]>
  >({
    Compliance: [],
    Crewing: [],
    Mechanical: [],
  });

  useEffect(() => {
    if (reduxSelectedShip && openViewModal) {
      const docs: Record<string, ShipDocument[]> = {
        Compliance: [],
        Crewing: [],
        Mechanical: [],
      };

      const rawPdfs = reduxSelectedShip.pdfs || reduxSelectedShip.documents || [];
      if (Array.isArray(rawPdfs)) {
        rawPdfs.forEach((pdf: any) => {
          if (pdf.type) {
            const typeKey =
              pdf.type.charAt(0).toUpperCase() +
              pdf.type.slice(1).toLowerCase();
            if (docs[typeKey]) {
              docs[typeKey].push({
                id: pdf._id || pdf.id,
                name: pdf.originalFileName || pdf.name || "Unnamed Document",
                downloadUrl: pdf.downloadUrl || pdf.url,
              });
            }
          }
        });
      }

      const detailedShip: Ship = {
        id: reduxSelectedShip._id || reduxSelectedShip.id,
        name: reduxSelectedShip.name,
        imo: reduxSelectedShip.IMO || reduxSelectedShip.imo,
        status: reduxSelectedShip.isActive ? "Active" : "Maintenance",
        documents: docs,
        adminName: reduxSelectedShip.admin
          ? `${reduxSelectedShip.admin.firstName} ${reduxSelectedShip.admin.lastName}`
          : "N/A",
        crewMembers: reduxSelectedShip.crewMembers || reduxSelectedShip.crews || [],
        superintendents: reduxSelectedShip.superintendents || [],
      };
      setSelectedShip(detailedShip);
      setName(detailedShip.name);
      setImo(detailedShip.imo);
      setAdminName(detailedShip.adminName || "N/A");
      setPendingDocuments({ Compliance: [], Crewing: [], Mechanical: [] });

      const crews = reduxSelectedShip.crewMembers || reduxSelectedShip.crews;
      if (crews) {
        setSelectedCrewIds(crews.map((c: any) => c._id || c.id));
      } else {
        setSelectedCrewIds([]);
      }

      if (reduxSelectedShip.superintendents) {
        setSelectedSuperintendentIds(reduxSelectedShip.superintendents.map((s: any) => s._id || s.id));
      } else {
        setSelectedSuperintendentIds([]);
      }
    }
  }, [reduxSelectedShip, openViewModal]);

  const resetForm = () => {
    setName("");
    setImo("");
    setAdminName("");
    setSelectedCategory("");
    setPendingDocuments({ Compliance: [], Crewing: [], Mechanical: [] });
    setSelectedCrewIds([]);
    setSelectedSuperintendentIds([]);
  };

  const handleOpenAdd = () => {
    resetForm();
    setOpenAddModal(true);
  };

  const handleOpenView = (ship: Ship) => {
    setOpenViewModal(true);
    setIsEditing(false);
    dispatch(fetchShipDetails(ship.id.toString()));
  };

  const handleCloseView = () => {
    setSelectedShip(null);
    setOpenViewModal(false);
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && selectedCategory) {
      const files = Array.from(e.target.files);
      const maxSize = 5 * 1024 * 1024;

      const validFiles = files.filter((file) => {
        if (file.size > maxSize) {
          showMessage(`File "${file.name}" is too large (max 5MB).`, "error");
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const newDocs = validFiles.map((file) => ({
        name: file.name,
        file: file,
      }));

      setPendingDocuments((prev) => ({
        ...prev,
        [selectedCategory]: [...(prev[selectedCategory] || []), ...newDocs],
      }));

      e.target.value = "";
      showMessage(`Selected ${validFiles.length} PDF(s). You can upload more if needed.`);
    }
  };

  const handleToggleStatusClick = (ship: any) => {
    setSelectedShip(ship);
    setOpenConfirmModal(true);
  };

  const confirmStatusChange = () => {
    if (selectedShip) {
      showMessage("Status update pending API integration", "info");
      setOpenConfirmModal(false);
      setSelectedShip(null);
    }
  };

  const uploadPendingDocs = async (shipId: string | number) => {
    for (const [category, docs] of Object.entries(pendingDocuments)) {
      for (const doc of docs) {
        const formData = new FormData();
        formData.append("file", doc.file as File);
        formData.append("shipId", String(shipId));
        formData.append("type", category.toUpperCase());

        try {
          await shipControllers.uploadPdf(formData);
          showMessage(`${doc.name} uploaded successfully`);
        } catch (err: any) {
          if (err.response && err.response.status === 413) {
            showMessage(`File "${doc.name}" is too large for the server.`, "error");
          } else {
            showMessage(`Failed to upload ${doc.name}`, "error");
          }
        }
      }
    }
  };

  const handleAddShip = async () => {
    const payload = { name: name, IMO: imo };
    const resultAction = await dispatch(createShip(payload));

    if (createShip.fulfilled.match(resultAction)) {
      showMessage("Ship created successfully!");
      const responseData = resultAction.payload as any;
      const newShip =
        responseData?.data?.data || responseData?.data || responseData;
      const newShipId = newShip?.id || newShip?._id;

      if (newShipId) {
        await uploadPendingDocs(newShipId);
        if (selectedCrewIds.length > 0) {
          await dispatch(
            assignCrewToShip({ shipId: newShipId, crewIds: selectedCrewIds })
          );
        }
        if (selectedSuperintendentIds.length > 0) {
          await dispatch(
            assignSuperintendentsToShip({ shipId: newShipId, superintendentIds: selectedSuperintendentIds })
          );
        }
      } else {
        showMessage(
          "Ship created but could not upload documents (ID missing).",
          "warning"
        );
      }

      setOpenAddModal(false);
      resetForm();
      dispatch(fetchShips());
    }
  };

  const handleUpdateShip = async () => {
    if (!selectedShip) return;
    const payload = { name: name, IMO: imo };

    try {
      await shipControllers.updateShip(selectedShip.id, payload);
      await uploadPendingDocs(selectedShip.id);

      await dispatch(
        assignCrewToShip({
          shipId: selectedShip.id,
          crewIds: selectedCrewIds,
        })
      );

      await dispatch(
        assignSuperintendentsToShip({
          shipId: selectedShip.id,
          superintendentIds: selectedSuperintendentIds,
        })
      );

      dispatch(fetchShips());
      setSelectedShip(null);
      setIsEditing(false);
      setOpenViewModal(false);
      showMessage("Ship details updated successfully!");
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ||
        "Failed to update ship. Please try again.",
        "error"
      );
    }
  };

  const handleDeleteShip = () => {
    if (!selectedShip) return;
    setOpenDeleteModal(true);
  };

  const confirmDeleteShip = async () => {
    if (!selectedShip) return;

    try {
      await shipControllers.deleteShip(selectedShip.id);
      dispatch(fetchShips());
      handleCloseView();
      setOpenDeleteModal(false);
      showMessage("Ship deleted successfully!");
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ||
        "Failed to delete ship. Please try again.",
        "error"
      );
    }
  };

  const handleDeleteExistingDocument = async (category: string, docId: any) => {
    if (!selectedShip || !docId) return;
    // Assuming there might be a delete document API or we update the ship
    showMessage("Document deletion pending API integration", "info");
  };

  const handleOpenCrewModal = () => {
    setOpenCrewModal(true);
  };

  const handleCrewSelection = (crewId: string | number) => {
    setSelectedCrewIds((prev) =>
      prev.includes(crewId)
        ? prev.filter((id) => id !== crewId)
        : [...prev, crewId]
    );
  };

  const handleAssignCrewSubmit = async () => {
    if (!selectedShip) return;
    setAssignLoading(true);
    try {
      const resultAction = await dispatch(
        assignCrewToShip({
          shipId: selectedShip.id,
          crewIds: selectedCrewIds,
        })
      );
      if (assignCrewToShip.fulfilled.match(resultAction)) {
        showMessage("Crew members assigned successfully!");
        setOpenCrewModal(false);
        dispatch(fetchShipDetails(selectedShip.id.toString()));
      }
    } catch (error: any) {
      showMessage("Failed to assign crew members", "error");
    } finally {
      setAssignLoading(false);
    }
  };

  const removeDocument = (category: string, index: number) => {
    const docName = pendingDocuments[category][index].name;
    setPendingDocuments((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
    showMessage(`Pending document "${docName}" removed.`);
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
    width: { xs: "95%", sm: 550 },
    maxHeight: "90vh",
    overflowY: "auto",
    bgcolor: COLORS.WHITE,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "var(--font-primary) !important",
    boxShadow: 24,
    border: `1px solid ${COLORS.ACCENT}`,
    borderRadius: "10px",
    p: 3,
    outline: "none",
  };

  const confirmModalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400 },
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
      "&.Mui-disabled": {
        "& fieldset": { borderColor: "rgba(0, 0, 0, 0.3)" },
        "& .MuiInputBase-input": {
          WebkitTextFillColor: `${COLORS.TEXT_PRIMARY} !important`,
        },
      },
    },
    "& .MuiInputLabel-root": {
      color: COLORS.TEXT_SECONDARY,
      fontFamily: "var(--font-primary) !important",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: COLORS.ACCENT },
    "& .MuiSelect-icon": { color: COLORS.TEXT_PRIMARY },
    "& .MuiInputBase-input": {
      fontFamily: "var(--font-primary) !important",
      color: COLORS.TEXT_PRIMARY,
    },
    "& .MuiMenuItem-root": { fontFamily: "var(--font-primary) !important" },
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
              Ship Management
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
                  "&:hover": { bgcolor: "#0052E0" },
                }}
              >
                Add Ship
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
              overflow: "hidden",
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: COLORS.WHITE }}>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY }}
                  >
                    Ship Name
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY }}
                  >
                    IMO Number
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ py: 4, color: COLORS.TEXT_PRIMARY }}
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  (rowsPerPage > 0
                    ? displayShips.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : displayShips
                  ).map((row: any) => (
                    <TableRow key={row.id || row._id || Math.random()}>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>
                        {row.name}
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>
                        {row.imo}
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={row.status === "Active"}
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={displayShips.length}
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
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontFamily: "var(--font-primary) !important",
                },
              }}
            />
          </TableContainer>

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
                    ? "Add New Ship"
                    : isEditing
                      ? "Edit Ship Details"
                      : "Ship Details"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {!openAddModal && !isEditing && selectedShip && (
                    <Chip
                      label={selectedShip.status}
                      size="small"
                      sx={{
                        borderRadius: "10px",
                        bgcolor: COLORS.ACCENT,
                        color: COLORS.WHITE,
                        fontFamily: "var(--font-primary) !important",
                      }}
                    />
                  )}
                  <Box>
                    {!openAddModal && !isEditing && (
                      <>
                        <IconButton
                          onClick={handleOpenCrewModal}
                          sx={{
                            color: COLORS.ACCENT,
                            mr: 1,
                            bgcolor: "rgba(22, 93, 255, 0.05)",
                            "&:hover": { bgcolor: "rgba(22, 93, 255, 0.1)" },
                          }}
                          title="Assign Crew"
                        >
                          <PeopleIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setIsEditing(true)}
                          sx={{ color: COLORS.ACCENT, mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={handleDeleteShip}
                          sx={{ color: COLORS.RED }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
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
              </Box>

              <Stack spacing={2}>
                {!openAddModal && !isEditing ? (
                  <>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: "var(--font-primary) !important" }}>
                        Ship Name
                      </Typography>
                      <Typography variant="body1" fontWeight={500} sx={{ color: COLORS.TEXT_PRIMARY, fontFamily: "var(--font-primary) !important", fontSize: "1.1rem" }}>
                        {name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: "var(--font-primary) !important" }}>
                        IMO Number
                      </Typography>
                      <Typography variant="body1" sx={{ color: COLORS.TEXT_PRIMARY, fontFamily: "var(--font-primary) !important", fontSize: "1.1rem" }}>
                        {imo}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: "var(--font-primary) !important" }}>
                        Admin Name
                      </Typography>
                      <Typography variant="body1" sx={{ color: COLORS.TEXT_PRIMARY, fontFamily: "var(--font-primary) !important", fontSize: "1.1rem" }}>
                        {adminName}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: "var(--font-primary) !important" }}>
                        Assigned Crew Members
                      </Typography>
                      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedShip?.crewMembers && selectedShip.crewMembers.length > 0 ? (
                          selectedShip.crewMembers.map((crewMember: any) => (
                            <Chip
                              key={crewMember._id || crewMember.id}
                              label={`${crewMember.firstName} ${crewMember.lastName}`}
                              size="small"
                              sx={{
                                bgcolor: "rgba(22, 93, 255, 0.05)",
                                color: COLORS.TEXT_PRIMARY,
                                fontFamily: "var(--font-primary) !important",
                                fontWeight: 500,
                              }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: "var(--font-primary) !important", fontStyle: "italic" }}>
                            No crew members assigned
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: "var(--font-primary) !important" }}>
                        Assigned Superintendents
                      </Typography>
                      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedShip?.superintendents && selectedShip.superintendents.length > 0 ? (
                          selectedShip.superintendents.map((supt: any) => (
                            <Chip
                              key={supt._id || supt.id}
                              label={`${supt.firstName} ${supt.lastName}`}
                              size="small"
                              sx={{
                                bgcolor: "rgba(22, 93, 255, 0.05)",
                                color: COLORS.TEXT_PRIMARY,
                                fontFamily: "var(--font-primary) !important",
                                fontWeight: 500,
                              }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: "var(--font-primary) !important", fontStyle: "italic" }}>
                            No superintendents assigned
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </>
                ) : (
                  <>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Ship Name"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={textFieldStyle}
                      />
                      <TextField
                        label="IMO Number"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={imo}
                        onChange={(e) => setImo(e.target.value)}
                        sx={textFieldStyle}
                      />
                    </Stack>

                    <Box>
                      <FormControl fullWidth size="small" sx={textFieldStyle}>
                        <InputLabel id="crew-multiple-select-label">
                          Assign Crew Members
                        </InputLabel>
                        <Select
                          labelId="crew-multiple-select-label"
                          multiple
                          value={selectedCrewIds}
                          label="Assign Crew Members "
                          onChange={(e) =>
                            setSelectedCrewIds(e.target.value as any[])
                          }
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {(selected as any[]).map((value) => {
                                const member = crew.find((c) => (c._id || c.id) === value);
                                return (
                                  <Chip
                                    key={value}
                                    label={member ? `${member.firstName} ${member.lastName}` : value}
                                    size="small"
                                    sx={{ fontFamily: "var(--font-primary) !important" }}
                                  />
                                );
                              })}
                            </Box>
                          )}
                        >
                          {crew.map((member) => (
                            <MenuItem
                              key={member._id || member.id}
                              value={member._id || member.id}
                              sx={{ fontFamily: "var(--font-primary) !important" }}
                            >
                              <Checkbox checked={selectedCrewIds.includes(member._id || member.id)} />
                              <ListItemText
                                primary={`${member.firstName} ${member.lastName}`}
                                secondary={member.email}
                                primaryTypographyProps={{ fontFamily: "var(--font-primary) !important" }}
                                secondaryTypographyProps={{ fontFamily: "var(--font-primary) !important" }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box>
                      <FormControl fullWidth size="small" sx={textFieldStyle}>
                        <InputLabel id="superintendent-multiple-select-label">
                          Assign Superintendents
                        </InputLabel>
                        <Select
                          labelId="superintendent-multiple-select-label"
                          multiple
                          value={selectedSuperintendentIds}
                          label="Assign Superintendents"
                          onChange={(e) =>
                            setSelectedSuperintendentIds(e.target.value as any[])
                          }
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {(selected as any[]).map((value) => {
                                const member = superintendents.find((s) => (s._id || s.id) === value);
                                return (
                                  <Chip
                                    key={value}
                                    label={member ? `${member.firstName} ${member.lastName}` : value}
                                    size="small"
                                    sx={{ fontFamily: "var(--font-primary) !important" }}
                                  />
                                );
                              })}
                            </Box>
                          )}
                        >
                          {superintendents.map((member) => (
                            <MenuItem
                              key={member._id || member.id}
                              value={member._id || member.id}
                              sx={{ fontFamily: "var(--font-primary) !important" }}
                            >
                              <Checkbox checked={selectedSuperintendentIds.includes(member._id || member.id)} />
                              <ListItemText
                                primary={`${member.firstName} ${member.lastName}`}
                                secondary={member.email}
                                primaryTypographyProps={{ fontFamily: "var(--font-primary) !important" }}
                                secondaryTypographyProps={{ fontFamily: "var(--font-primary) !important" }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </>
                )}

                <Divider sx={{ borderColor: COLORS.FOREGROUND }} />

                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2, ...commonStyles }}
                  >
                    Documents
                  </Typography>

                  {(openAddModal || isEditing) && (
                    <Box
                      sx={{
                        mb: 3,
                        p: 2,
                        border: `1px dashed ${COLORS.FOREGROUND}`,
                        bgcolor: "rgba(0,0,0,0.02)",
                        borderRadius: "10px",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <FormControl sx={{ minWidth: 200, ...textFieldStyle }}>
                          <InputLabel id="category-select">Category</InputLabel>
                          <Select
                            labelId="category-select"
                            value={selectedCategory}
                            label="Category"
                            onChange={(e) =>
                              setSelectedCategory(e.target.value)
                            }
                          >
                            {CATEGORIES.map((cat) => (
                              <MenuItem key={cat} value={cat}>
                                {cat}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                          disabled={!selectedCategory}
                          sx={{
                            height: 56,
                            flex: 1,
                            borderRadius: "10px",
                            borderColor: COLORS.ACCENT,
                            color: COLORS.ACCENT,
                            fontFamily: "var(--font-primary) !important",
                            textTransform: "none",
                            fontSize: "1rem",
                            "&:hover": {
                              borderColor: COLORS.ACCENT,
                              bgcolor: "rgba(22, 93, 255, 0.05)",
                            },
                          }}
                        >
                          {selectedCategory &&
                            pendingDocuments[selectedCategory]?.length > 0
                            ? "Upload More PDF"
                            : "Upload PDF"}
                          <input
                            type="file"
                            hidden
                            multiple
                            accept=".pdf"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                          />
                        </Button>
                      </Stack>
                      {selectedCategory &&
                        pendingDocuments[selectedCategory]?.length > 0 && (
                          <Typography
                            variant="caption"
                            sx={{
                              mt: 1,
                              display: "block",
                              color: COLORS.ACCENT,
                              fontWeight: 600,
                              textAlign: "center"
                            }}
                          >
                            PDF added successfully! Click "Upload More PDF" to add another file to this category.
                          </Typography>
                        )}
                      {!selectedCategory && (
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 1,
                            display: "block",
                            color: COLORS.TEXT_SECONDARY,
                          }}
                        >
                          Please select a category to upload files.
                        </Typography>
                      )}
                    </Box>
                  )}

                  <Stack spacing={2}>
                    {CATEGORIES.map((category) => (
                      <Box key={category}>
                        {(pendingDocuments[category]?.length > 0 ||
                          (selectedShip?.documents[category] &&
                            selectedShip.documents[category].length > 0)) && (
                            <>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: COLORS.TEXT_SECONDARY, mb: 1 }}
                              >
                                {category}
                              </Typography>
                              <List
                                dense
                                sx={{
                                  bgcolor: "rgba(0,0,0,0.02)",
                                  borderRadius: "10px",
                                }}
                              >
                                {selectedShip?.documents &&
                                  selectedShip.documents[category]?.map(
                                    (doc, idx) => (
                                      <ListItem
                                        key={`existing-${idx}`}
                                        divider={
                                          idx !==
                                          selectedShip.documents[category]
                                            .length -
                                          1 ||
                                          pendingDocuments[category].length > 0
                                        }
                                      >
                                        <ListItemText
                                          primary={
                                            <Box
                                              display="flex"
                                              alignItems="center"
                                              gap={1}
                                            >
                                              <InsertDriveFileIcon
                                                fontSize="small"
                                                sx={{ color: COLORS.ACCENT }}
                                              />
                                              <Box>
                                                <Typography
                                                  variant="body2"
                                                  sx={commonStyles}
                                                >
                                                  {doc.name}
                                                </Typography>
                                                <Typography
                                                  variant="caption"
                                                  sx={{
                                                    color: COLORS.TEXT_SECONDARY,
                                                    fontSize: "0.7rem",
                                                  }}
                                                >
                                                  Existing
                                                </Typography>
                                              </Box>
                                            </Box>
                                          }
                                        />
                                        <ListItemSecondaryAction>
                                          <Stack direction="row" spacing={1}>
                                            {doc.downloadUrl && (
                                              <IconButton
                                                edge="end"
                                                size="small"
                                                component="a"
                                                href={doc.downloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() =>
                                                  showMessage(
                                                    `Downloading "${doc.name}"...`
                                                  )
                                                }
                                                sx={{ color: COLORS.ACCENT }}
                                                title="Download"
                                              >
                                                <DownloadIcon fontSize="small" />
                                              </IconButton>
                                            )}
                                            {isEditing && (
                                              <IconButton
                                                edge="end"
                                                size="small"
                                                onClick={() =>
                                                  handleDeleteExistingDocument(
                                                    category,
                                                    (doc as any).id
                                                  )
                                                }
                                                sx={{ color: COLORS.RED }}
                                                title="Remove"
                                              >
                                                <DeleteIcon fontSize="small" />
                                              </IconButton>
                                            )}
                                          </Stack>
                                        </ListItemSecondaryAction>
                                      </ListItem>
                                    )
                                  )}

                                {pendingDocuments[category].map((doc, idx) => (
                                  <ListItem
                                    key={`pending-${idx}`}
                                    divider={
                                      idx !==
                                      pendingDocuments[category].length - 1
                                    }
                                  >
                                    <ListItemText
                                      primary={
                                        <Box
                                          display="flex"
                                          alignItems="center"
                                          gap={1}
                                        >
                                          <InsertDriveFileIcon
                                            fontSize="small"
                                            sx={{ color: "orange" }}
                                          />
                                          <Box>
                                            <Typography
                                              variant="body2"
                                              sx={commonStyles}
                                            >
                                              {doc.name}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                color: "orange",
                                                fontSize: "0.7rem",
                                              }}
                                            >
                                              Pending Upload
                                            </Typography>
                                          </Box>
                                        </Box>
                                      }
                                    />
                                    {(openAddModal || isEditing) && (
                                      <ListItemSecondaryAction>
                                        <IconButton
                                          edge="end"
                                          size="small"
                                          onClick={() =>
                                            removeDocument(category, idx)
                                          }
                                          sx={{ color: COLORS.RED }}
                                        >
                                          <CloseIcon fontSize="small" />
                                        </IconButton>
                                      </ListItemSecondaryAction>
                                    )}
                                  </ListItem>
                                ))}
                              </List>
                            </>
                          )}
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {(openAddModal || isEditing) && (
                  <Button
                    variant="contained"
                    onClick={openAddModal ? handleAddShip : handleUpdateShip}
                    disabled={createLoading}
                    sx={{
                      borderRadius: "10px",
                      bgcolor: COLORS.ACCENT,
                      color: COLORS.WHITE,
                      height: 56,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      fontFamily: "var(--font-primary) !important",
                      textTransform: "none",
                      "&:hover": { bgcolor: "#0052E0" },
                    }}
                  >
                    {openAddModal ? "Create Ship" : "Save Changes"}
                  </Button>
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
                {selectedShip?.status === "Active"
                  ? "Disable Ship"
                  : "Enable Ship"}
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
                {selectedShip?.status === "Active" ? "disable" : "enable"} this
                ship&#39;s profile?
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

          <Modal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
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
                Delete Ship
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: COLORS.TEXT_SECONDARY,
                  fontFamily: "var(--font-primary) !important",
                }}
              >
                Are you sure you want to delete this ship? This action cannot be
                undone.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenDeleteModal(false)}
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
                  onClick={confirmDeleteShip}
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

          <Modal
            open={openCrewModal}
            onClose={() => setOpenCrewModal(false)}
            disableScrollLock
          >
            <Box
              sx={{
                ...modalStyle,
                width: { xs: "95%", sm: 550 },
                p: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "80vh",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  pb: 2,
                  borderBottom: `1px solid ${COLORS.FOREGROUND}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: COLORS.WHITE,
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <PeopleIcon sx={{ color: COLORS.ACCENT }} />
                  <Typography variant="h6" fontWeight={700} sx={commonStyles}>
                    Assign Crew Members
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setOpenCrewModal(false)}
                  sx={{ color: COLORS.TEXT_SECONDARY }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ p: 3, bgcolor: "rgba(0, 0, 0, 0.02)" }}>
                <TextField
                  fullWidth
                  placeholder="Search crew members..."
                  variant="outlined"
                  size="small"
                  value={crewSearch}
                  onChange={(e) => setCrewSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: COLORS.TEXT_SECONDARY }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    ...textFieldStyle,
                    bgcolor: COLORS.WHITE,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: COLORS.WHITE,
                    },
                  }}
                />
              </Box>

              <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
                <List sx={{ pt: 0 }}>
                  {crew
                    ?.filter((member: any) =>
                      `${member.firstName} ${member.lastName}`
                        .toLowerCase()
                        .includes(crewSearch.toLowerCase()) ||
                      member.email
                        .toLowerCase()
                        .includes(crewSearch.toLowerCase())
                    )
                    .map((member: any) => {
                      const isSelected = selectedCrewIds.includes(
                        member._id || member.id
                      );
                      return (
                        <ListItem
                          key={member._id || member.id}
                          onClick={() =>
                            handleCrewSelection(member._id || member.id)
                          }
                          sx={{
                            borderRadius: "12px",
                            mb: 1,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            bgcolor: isSelected
                              ? "rgba(22, 93, 255, 0.05)"
                              : "transparent",
                            "&:hover": {
                              bgcolor: isSelected
                                ? "rgba(22, 93, 255, 0.1)"
                                : "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            sx={{
                              color: COLORS.FOREGROUND,
                              "&.Mui-checked": { color: COLORS.ACCENT },
                            }}
                          />
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 2,
                              bgcolor: COLORS.FOREGROUND,
                              color: COLORS.TEXT_PRIMARY,
                              fontSize: "1rem",
                              fontWeight: 600,
                            }}
                          >
                            {member.firstName[0]}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                fontWeight={600}
                                sx={commonStyles}
                              >
                                {member.firstName} {member.lastName}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                sx={{ color: COLORS.TEXT_SECONDARY }}
                              >
                                {member.email}
                              </Typography>
                            }
                          />
                          {isSelected && (
                            <Chip
                              label="Selected"
                              size="small"
                              sx={{
                                bgcolor: COLORS.ACCENT,
                                color: COLORS.WHITE,
                                fontWeight: 600,
                                height: 20,
                                fontSize: "0.65rem",
                              }}
                            />
                          )}
                        </ListItem>
                      );
                    })}
                </List>
              </Box>

              <Box
                sx={{
                  p: 3,
                  borderTop: `1px solid ${COLORS.FOREGROUND}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: COLORS.WHITE,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.TEXT_SECONDARY }}
                >
                  <Typography
                    component="span"
                    fontWeight={700}
                    color={COLORS.ACCENT}
                  >
                    {selectedCrewIds.length}
                  </Typography>{" "}
                  Crew Selected
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={() => setOpenCrewModal(false)}
                    sx={{
                      color: COLORS.TEXT_PRIMARY,
                      textTransform: "none",
                      fontWeight: 600,
                      fontFamily: "var(--font-primary)",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    disabled={assignLoading}
                    onClick={handleAssignCrewSubmit}
                    sx={{
                      bgcolor: COLORS.ACCENT,
                      color: COLORS.WHITE,
                      borderRadius: "10px",
                      textTransform: "none",
                      px: 4,
                      fontWeight: 600,
                      fontFamily: "var(--font-primary)",
                      "&:hover": { bgcolor: "#0052E0" },
                    }}
                  >
                    {assignLoading ? "Assigning..." : "Confirm Assignment"}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Modal>
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
    </Box>
  );
}