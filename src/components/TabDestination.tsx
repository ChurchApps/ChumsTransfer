import React, { useState } from "react"
import { Select, MenuItem, FormControl, InputLabel, Box, Typography, Button, Alert } from "@mui/material";
import { ImportDataInterface } from "../helpers/ImportHelper";
import { DataSourceType } from "../types";
import { ApiHelper } from "@churchapps/apphelper";
import getChumsData from "../helpers/ImportHelpers/ImportChumsDbHelper"
import generateBreezeZip from "../helpers/ExportHelpers/ExportBreezeZipHelper"
import generateChumsZip from "../helpers/ExportHelpers/ExportChumsZipHelper"
import exportToChumsDb from "../helpers/ExportHelpers/ExportChumsDbHelper"
import generatePlanningCenterZip from "../helpers/ExportHelpers/ExportPlanningCenterZipHelper"
import { FinalCountPreview } from "./FinalCountPreview";

interface Props {
  dataImportSource?: string;
  importData: ImportDataInterface;
  setActiveTab: (tabName: string) => void;
  dataExportSource: string | null;
  setDataExportSource: (src: string | null) => void
  setStatus: (status: string) => void
  setIsExporting: (exporting: boolean) => void;
  showFinalCount: boolean;
  setShowFinalCount: (showing: boolean) => void;
}

export const TabDestination = (props: Props) => {
  const [chumsData, setChumsData] = useState<ImportDataInterface>();
  const [loginError, setLoginError] = useState<boolean>(false);
  let progress: any = {};

  const setProgress = (name: string, status: string) => {
    progress[name] = status;
    props.setStatus({ ...progress });
  }

  const getChumsDBData = async () => {
    const data = await getChumsData();
    setChumsData(data);
  }

  const handleSelect = (e: string) => {
    setLoginError(false);
    if (e === DataSourceType.CHUMS_DB && !ApiHelper.isAuthenticated) {
      setLoginError(true);
      return;
    }
    if (e === DataSourceType.CHUMS_DB) {
      props.setDataExportSource(e);
      getChumsDBData();
      props.setShowFinalCount(true);
    } else {
      props.setShowFinalCount(false);
      handleExport(e);
    }
  }

  const handleExport = async (e: string) => {
    props.setDataExportSource(e)
    if (e === props.dataImportSource) {
      alert("Export source must be different than import source to avoid duplication of data")
      return;
    } else {
      props.setIsExporting(true)
      props.setActiveTab("step4")
      switch (e) {
        case DataSourceType.CHUMS_DB: {
          await exportToChumsDb(props.importData, setProgress)
          break;
        }
        case DataSourceType.CHUMS_ZIP: {
          await generateChumsZip(props.importData, setProgress)
          break;
        }
        case DataSourceType.BREEZE_ZIP: {
          generateBreezeZip(props.importData, setProgress)
          break;
        }
        case DataSourceType.PLANNING_CENTER_ZIP: {
          generatePlanningCenterZip(props.importData, setProgress)
          break;
        }
        default: {
          break;
        }
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
        Step 3 - Choose Export Destination
      </Typography>
      <Typography variant="body1" paragraph>
        Choose export format
      </Typography>

      {loginError && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
          You must be logged in to use Chums Database as a destination. Please log in first.
        </Alert>
      )}

      <FormControl fullWidth sx={{ mb: 3, maxWidth: 300 }}>
        <InputLabel id="export-destination-select-label">Export Destination</InputLabel>
        <Select
          labelId="export-destination-select-label"
          value={props.dataExportSource || ''}
          label="Export Destination"
          onChange={(e) => handleSelect(e.target.value)}
        >
          <MenuItem value={DataSourceType.CHUMS_DB}>Chums Database</MenuItem>
          <MenuItem value={DataSourceType.CHUMS_ZIP}>Chums Export Zip</MenuItem>
          <MenuItem value={DataSourceType.BREEZE_ZIP}>Breeze Export Zip</MenuItem>
          <MenuItem value={DataSourceType.PLANNING_CENTER_ZIP}>Planning Center zip</MenuItem>
        </Select>
      </FormControl>

      {props.showFinalCount && props.importData && chumsData && (
        <Box sx={{ mt: 3 }}>
          <FinalCountPreview importData={props.importData} chumsData={chumsData} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleExport(DataSourceType.CHUMS_DB)}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600, px: 4 }}
            >
              Start Transfer
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
