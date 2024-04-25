import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  Avatar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, Assignment } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [advs, setAdvs] = useState([]);
  const [updateOpen, setUpdateOpen] = useState(false);

  useEffect(() => {
    getAllAdvertisers();
  }, []);

  const getAllAdvertisers = async () => {
    const { data } = await axios.get("http://localhost:3001/advertisers");
    setAdvs(data);
  };

  const [advertiserId, setAdvertiserId] = useState("");
  const [advertiserName, setAdvertiserName] = useState("");
  const [updateAdvId, setUpdateAdvId] = useState("");
  const [updateAdvName, setUpdateAdvName] = useState("");
  const [advIndex, setAdvIndex] = useState("");

  const handleCreate = async () => {
    if (advertiserId.trim() === "") {
      toast.error(<Typography>Enter the advertiser ID.</Typography>);
      return;
    }
    if (advertiserName.trim() === "") {
      toast.error(<Typography>Enter the advertiser Name.</Typography>);
      return;
    }
    const { data } = await axios.post("http://localhost:3001/advertisers", {
      advId: advertiserId,
      advName: advertiserName,
    });
    if (data.success === true) {
      toast.success(<Typography>{data.msg}</Typography>);
    } else {
      toast.error(<Typography>{data.msg}</Typography>);
    }
    getAllAdvertisers();
    handleInit();
  };

  const handleUpdate = async (index) => {
    const { data } = await axios.get(
      `http://localhost:3001/advertisers/${index}`
    );
    setUpdateAdvName(data.advName);
    setUpdateAdvId(data.advId);
    setAdvIndex(data.id);
    handleUpdateOpen();
  };

  const handleDelete = async (index) => {
    await axios.delete(`http://localhost:3001/advertisers/${index}`);
    getAllAdvertisers();
  };

  const handleAdsList = async (index) => {
    const { data } = await axios.get(
      `http://localhost:3001/advertisers/${index}`
    );
    router.push(`${data.advId}`);
  };

  const handleInit = () => {
    setAdvertiserId("");
    setAdvertiserName("");
  };

  const handleUpdateOpen = () => {
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
  };

  const handleChange = async () => {
    await axios.patch(`http://localhost:3001/advertisers/${advIndex}`, {
      advId: updateAdvId,
      advName: updateAdvName
    });
    getAllAdvertisers();
    handleUpdateClose()
  }

  const columns = [
    { field: "id", headerName: "No", width: 100 },
    {
      field: "advId",
      headerName: "Advertiser ID",
      width: 250,
    },
    {
      field: "advName",
      headerName: "Advertiser Name",
      width: 250,
    },
    {
      filed: "action",
      headerName: "Action",
      width: 160,
      renderCell: ({ row }) => (
        <Box>
          <Tooltip title="edit" followCursor>
            <IconButton
              color="primary"
              variant="outlined"
              size="small"
              onClick={() => handleUpdate(row.index)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="delete" followCursor>
            <IconButton
              color="error"
              variant="outlined"
              size="small"
              onClick={() => handleDelete(row.index)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ads List" followCursor>
            <IconButton
              color="success"
              variant="outlined"
              size="small"
              onClick={() => handleAdsList(row.index)}
            >
              <Assignment fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, p: 2, mb: 3 }}>
              <Avatar alt="Tiktok Logo" src="/tiktok.png" sx={{ width: 100, height: 100 }} />
              <Typography variant="h3">TikTok</Typography>
            </Box>
            <TextField
              fullWidth
              label="Advertiser Id"
              sx={{ mb: 2 }}
              value={advertiserId}
              onChange={(e) => setAdvertiserId(e.target.value)}
            />
            <TextField
              fullWidth
              label="Advertiser Name"
              value={advertiserName}
              onChange={(e) => setAdvertiserName(e.target.value)}
            />
            <Button
              size="large"
              variant="contained"
              sx={{ textTransform: "none", mt: 2 }}
              fullWidth
              onClick={handleCreate}
            >
              Add Advertiser
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={9}>
        <Card>
          <CardContent>
            <DataGrid
              rows={advs}
              columns={columns}
              getRowId={(row) => row.id.toString()}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              sx={{
                '& .MuiDataGrid-cellContent': {
                  fontSize: '1rem'
                },
                '& .MuiDataGrid-columnHeaders': {
                  fontSize: '1.1rem'
                }
              }}
              pageSizeOptions={[10]}
            />
          </CardContent>
        </Card>
      </Grid>
      <Toaster position="top-right" />
      <Dialog open={updateOpen} onClose={handleUpdateClose} maxWidth="xs">
        <DialogTitle>Update Advertiser Info</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Advertiser Id"
                variant="outlined"
                sx={{ mt: 1 }}
                fullWidth
                value={updateAdvId}
                onChange={(e) => setUpdateAdvId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Advertiser Name"
                variant="outlined"
                fullWidth
                value={updateAdvName}
                onChange={(e) => setUpdateAdvName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth size="large" onClick={handleChange}>Change</Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}
