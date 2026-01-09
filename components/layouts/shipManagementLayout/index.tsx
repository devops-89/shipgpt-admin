"use client";
import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/widgets/Sidebar";
import Navbar from "@/components/widgets/Navbar";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import DownloadIcon from "@mui/icons-material/Download";
import { COLORS } from "@/utils/enum";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchShips,
  createShip,
  fetchShipDetails,
  clearError,
} from "@/redux/slices/shipSlice";
import { shipControllers } from "@/api/ship";

interface ShipDocument {
  name: string;
  file?: File;
  downloadUrl?: string;
}

interface Ship {
  id: number;
  name: string;
  imo: string;
  status: string;
  documents: Record<string, ShipDocument[]>;
  adminName?: string;
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
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userRole, setUserRole] = useState<string>("");

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

      if (reduxSelectedShip.pdfs && Array.isArray(reduxSelectedShip.pdfs)) {
        reduxSelectedShip.pdfs.forEach((pdf: any) => {
          if (pdf.type) {
            const typeKey =
              pdf.type.charAt(0).toUpperCase() +
              pdf.type.slice(1).toLowerCase();
            if (docs[typeKey]) {
              docs[typeKey].push({
                name: pdf.originalFileName,
                downloadUrl: pdf.downloadUrl,
              });
            }
          }
        });
      }

      const detailedShip: Ship = {
        id: reduxSelectedShip._id || reduxSelectedShip.id,
        name: reduxSelectedShip.name,
        imo: reduxSelectedShip.IMO,
        status: reduxSelectedShip.isActive ? "Active" : "Maintenance",
        documents: docs,
        adminName: reduxSelectedShip.admin
          ? `${reduxSelectedShip.admin.firstName} ${reduxSelectedShip.admin.lastName}`
          : "N/A",
      };
      setSelectedShip(detailedShip);
      setName(detailedShip.name);
      setImo(detailedShip.imo);
      setAdminName(detailedShip.adminName || "N/A");
      setPendingDocuments({ Compliance: [], Crewing: [], Mechanical: [] });
    }
  }, [reduxSelectedShip, openViewModal]);

  const resetForm = () => {
    setName("");
    setImo("");
    setAdminName("");
    setSelectedCategory("");
    setPendingDocuments({ Compliance: [], Crewing: [], Mechanical: [] });
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
          toast.error(`File "${file.name}" is too large (max 5MB).`);
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
    }
  };

  const handleToggleStatusClick = (ship: any) => {
    setSelectedShip(ship);
    setOpenConfirmModal(true);
  };

  const confirmStatusChange = () => {
    if (selectedShip) {
      toast.info("Status update pending API integration");
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
          toast.success(`${doc.name} uploaded successfully`);
        } catch (err: any) {
          if (err.response && err.response.status === 413) {
            toast.error(`File "${doc.name}" is too large for the server.`);
          } else {
            toast.error(`Failed to upload ${doc.name}`);
          }
        }
      }
    }
  };

  const handleAddShip = async () => {
    const payload = { name: name, IMO: imo };
    const resultAction = await dispatch(createShip(payload));

    if (createShip.fulfilled.match(resultAction)) {
      toast.success("Ship created successfully!");
      const responseData = resultAction.payload as any;
      const newShip =
        responseData?.data?.data || responseData?.data || responseData;
      const newShipId = newShip?.id || newShip?._id;

      if (newShipId) {
        await uploadPendingDocs(newShipId);
      } else {
        toast.warning(
          "Ship created but could not upload documents (ID missing)."
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
      dispatch(fetchShips());
      setSelectedShip(null);
      setIsEditing(false);
      setOpenViewModal(false);
      toast.success("Ship details updated successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update ship. Please try again."
      );
    }
  };

  const handleDeleteShip = async () => {
    if (!selectedShip) return;

    if (confirm("Are you sure you want to delete this ship?")) {
      try {
        await shipControllers.deleteShip(selectedShip.id);
        dispatch(fetchShips());
        handleCloseView();
        toast.success("Ship deleted successfully!");
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to delete ship. Please try again."
        );
      }
    }
  };

  const removeDocument = (category: string, index: number) => {
    setPendingDocuments((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
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
    width: { xs: "90%", sm: 600 },
    maxHeight: "90vh",
    overflowY: "auto",
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
                  displayShips.map((row: any) => (
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
          </TableContainer>

          {/* Add/View/Edit Ship Modal */}
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

              <Stack spacing={3}>
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
                          Ship Name
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
                          {name}
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
                          IMO Number
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: COLORS.TEXT_PRIMARY,
                            fontFamily: "var(--font-primary) !important",
                            fontSize: "1.1rem",
                          }}
                        >
                          {imo}
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
                          Admin Name
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: COLORS.TEXT_PRIMARY,
                            fontFamily: "var(--font-primary) !important",
                            fontSize: "1.1rem",
                          }}
                        >
                          {adminName}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <TextField
                        label="Ship Name"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={textFieldStyle}
                      />
                      <TextField
                        label="IMO Number"
                        fullWidth
                        variant="outlined"
                        value={imo}
                        onChange={(e) => setImo(e.target.value)}
                        sx={textFieldStyle}
                      />
                    </>
                  )}
                </Stack>

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
                            "&:hover": {
                              borderColor: COLORS.ACCENT,
                              bgcolor: "transparent",
                            },
                          }}
                        >
                          Upload PDF
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
                                        {doc.downloadUrl && (
                                          <IconButton
                                            edge="end"
                                            size="small"
                                            component="a"
                                            href={doc.downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ color: COLORS.ACCENT }}
                                            title="Download"
                                          >
                                            <DownloadIcon fontSize="small" />
                                          </IconButton>
                                        )}
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
                    fullWidth
                    size="large"
                    onClick={openAddModal ? handleAddShip : handleUpdateShip}
                    disabled={createLoading}
                    sx={{
                      mt: 2,
                      bgcolor: COLORS.GREEN,
                      color: COLORS.WHITE,
                      borderRadius: "10px",
                      fontFamily: "var(--font-primary) !important",
                      "&:hover": { bgcolor: COLORS.GREEN_DARK },
                    }}
                  >
                    {openAddModal ? "Create Ship" : "Save Changes"}
                  </Button>
                )}
              </Stack>
            </Box>
          </Modal>

          {/* Confirmation Modal */}
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
                  color: COLORS.TEXT_SECONDARY,
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
                    color: COLORS.TEXT_PRIMARY,
                    borderColor: COLORS.TEXT_PRIMARY,
                    minWidth: 100,
                    fontFamily: "var(--font-primary) !important",
                    "&:hover": {
                      borderColor: COLORS.TEXT_PRIMARY,
                      bgcolor: "rgba(0, 0, 0, 0.05)",
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
    </Box>
  );
}
