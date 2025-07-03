import React from "react"
import { Dots } from "react-activity";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { ImportDataInterface } from "../helpers/ImportHelper";
import { ImportPreview } from "../components";
import { DataSourceType } from "../types";

interface Props {
  dataImportSource?: string;
  importData: ImportDataInterface;
  isLoadingSourceData: boolean;
  setActiveTab: (tabName: string) => void
}

export const TabPreview = (props: Props) => {
  const getPreview = () => {
    if (props.importData) return <ImportPreview triggerRender={1} importData={props.importData} />
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom color="text.primary">
        Step 2 - Preview
      </Typography>
      
      {props.isLoadingSourceData && props.dataImportSource === DataSourceType.CHUMS_DB && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2, mt: 0.5 }}>
            Loading data from ChuMS database...
          </Typography>
        </Box>
      )}
      
      {getPreview()}
      
      {props.importData && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            onClick={() => props.setActiveTab("step3")} 
            variant="contained" 
            color="primary"
            size="large"
          >
            Continue to Destination
          </Button>
        </Box>
      )}
    </Box>
  )
}
