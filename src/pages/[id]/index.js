import { useState, useEffect } from "react";
import {
  Box,
  Backdrop,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/router";

import axios from "axios";

const AdvertiserList = () => {
  const router = useRouter();
  const id = router.query.id;
  const [adsData, setAdsData] = useState([]);
  const [fatigueView, setFatigueView] = useState(false);
  const [loadingIndex, setLoading] = useState(false);
  const [rowFatigues, setRowFatigues] = useState([]);

  useEffect(() => {
    getAllAds();
  }, [router]);

  const getAllAds = async () => {
    if (router?.query?.id) {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3001/advertisers/${router.query.id}/ads-list`
      );
      if (data.adData) {
        setAdsData(data.adData);
      }
      setLoading(false);
    }
  };

  const handleFatigueClose = () => {
    setFatigueView(false);
  };

  const handleFatigueOpen = async (advId, adId) => {
    setLoading(true);
    const { data } = await axios.post(
      "http://localhost:3001/advertisers/fatigue-list",
      {
        advId,
        adId,
      }
    );
    console.log(data.fatigueData);
    setRowFatigues(data.fatigueData);
    setFatigueView(true);
    setLoading(false);
  };

  const columnFatigues = [
    {
      field: "Date",
      headerName: "Date",
      width: 130,
      renderCell: ({ row }) => <Typography>{row?.date}</Typography>,
    },
    {
      field: "Cost Per Conversion",
      headerName: "Cost Per Conversion",
      width: 150,
      renderCell: ({ row }) => (
        <Typography>{row?.metrics?.cost_per_conversion}</Typography>
      ),
    },
    {
      field: "Dnu",
      headerName: "Dnu",
      width: 80,
      renderCell: ({ row }) => <Typography>{row?.metrics?.dnu}</Typography>,
    },
    {
      field: "Ratio",
      headerName: "Ratio",
      width: 80,
      renderCell: ({ row }) => (
        <Typography>{row?.metrics?.dnu_ratio}</Typography>
      ),
    },
    {
      field: "Fatigue Index",
      headerName: "Fatigue Index",
      width: 200,
      renderCell: ({ row }) => (
        <Typography>{row?.metrics?.fatigue_index}</Typography>
      ),
    },
    {
      field: "Skan Cost Per Conversion",
      headerName: "Skan Cost Per Conversion",
      width: 200,
      renderCell: ({ row }) => (
        <Typography>{row?.metrics?.skan_cost_per_conversion}</Typography>
      ),
    },
    {
      field: "Spend",
      headerName: "Spend",
      width: 100,
      renderCell: ({ row }) => <Typography>{row?.metrics?.spend}</Typography>,
    },
    {
      field: "Has Fatigue",
      headerName: "Has Fatigue",
      width: 150,
      renderCell: ({ row }) => (
        <Typography>{row?.metrics?.has_fatigue ? "True" : "False"}</Typography>
      ),
    },
  ];

  const columns = [
    { field: "advertiser_id", headerName: "Advertiser Id", width: 100 },
    { field: "campaign_id", headerName: "Campaign Id", width: 100 },
    { field: "campaign_name", headerName: "Campaign Name", width: 150 },
    { field: "adgroup_id", headerName: "Adgroup Id", width: 100 },
    { field: "adgroup_name", headerName: "Adgroup Name", width: 150 },
    { field: "ad_id", headerName: "Ad Id", width: 100 },
    { field: "ad_name", headerName: "Ad Name", width: 150 },
    { field: "ad_text", headerName: "Ad Text", width: 250 },
    {
      field: "Fatigue",
      headerName: "Fatigue",
      width: 100,
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          sx={{ textTransform: "none" }}
          onClick={() => handleFatigueOpen(row.advertiser_id, row.ad_id)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Button variant="containd" onClick={() => router.push("/")}>
        Go to Home
      </Button>
      <DataGrid
        getRowHeight={() => "auto"}
        rows={adsData}
        columns={columns}
        getRowId={(row) => row.advertiser_id + row.ad_id}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        sx={{
          "& .MuiDataGrid-cell": {
            whiteSpace: "pre-wrap !important",
          },
          "& .MuiDataGrid-cellContent": {
            fontSize: "1rem",
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "1.1rem",
          },
          "& .MuiDataGrid-cellContent": {
            wordWrap: "break-word",
          },
        }}
        pageSizeOptions={[10]}
      />
      <Dialog
        open={fatigueView}
        onClose={handleFatigueClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Fatigue List</DialogTitle>
        <DialogContent>
          <DataGrid
            rows={rowFatigues}
            columns={columnFatigues}
            getRowId={(row) => row.adgroup_id + row.ad_id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            sx={{
              "& .MuiDataGrid-cell": {
                whiteSpace: "pre-wrap !important",
              },
              "& .MuiDataGrid-cellContent": {
                fontSize: "1rem",
              },
              "& .MuiDataGrid-columnHeaders": {
                fontSize: "1.1rem",
              },
              "& .MuiDataGrid-cellContent": {
                wordWrap: "break-word",
              },
            }}
            pageSizeOptions={[10]}
          />
        </DialogContent>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingIndex}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default AdvertiserList;
