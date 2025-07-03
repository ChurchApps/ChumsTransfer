import React, { useState } from "react";
import { Container, Tabs, Tab, Box, Typography, Button, Divider } from "@mui/material";
import "react-activity/dist/Dots.css"
import "react-activity/dist/Windmill.css"
import { Footer, Header } from "./components"
import { ImportDataInterface } from "./helpers/ImportHelper";
import { TabSource } from "./components/TabSource";
import { TabPreview } from "./components/TabPreview";
import { TabDestination } from "./components/TabDestination";
import { TabRun } from "./components/TabRun";

export const Home = () => {
  const [dataImportSource, setDataImportSource] = useState<string | null>(null);
  const [dataExportSource, setDataExportSource] = useState<string | null>(null);

  const [importData, setImportData] = useState<ImportDataInterface | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [status, setStatus] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>("step1");

  const [showFinalCount, setShowFinalCount] = useState<boolean>(false);

  const isLoadingSourceData = dataImportSource && !importData;

  const handleStartOver = () => {
    setActiveTab("step1")
    setImportData(null)
    setDataImportSource(null)
    setDataExportSource(null)
    setIsExporting(false)
    setStatus({})
    setShowFinalCount(false);
  };

  console.log("***Made it Home");

  return (
    <>
      <Header />
      <Box sx={{ mt: 9, minHeight: 'calc(100vh - 200px)' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Page Header */}
          <Box sx={{ 
            bgcolor: 'grey.50',
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: 2,
            p: 4,
            mb: 4
          }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Import/Export Tool
            </Typography>
            <Typography variant="h6" paragraph sx={{ color: 'primary.main', mb: 2, fontWeight: 500 }}>
              Backup, transfer, and import your ChuMS data
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: 'text.secondary', mb: 2 }}>
              Welcome to the import/export tool for ChuMS. You can use this file to backup your ChuMS data or transfer your data out of ChuMS to be used in another system. If you're just getting started you can also use this tool to import existing data into ChuMS.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              We support three different data formats: the ChuMS export file format, along with Breeze and Planning Center file formats. You can use this tool to convert between any of these three in addition to reading/writing to your hosted ChuMS database.
            </Typography>
          </Box>

          {/* Wizard Tabs */}
          <Box sx={{ 
            width: '100%', 
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            overflow: 'hidden'
          }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)} 
              variant="fullWidth"
            >
              <Tab label="Step 1 - Source" value="step1" disabled={activeTab !== "step1"} />
              <Tab label="Step 2 - Preview" value="step2" disabled={activeTab !== "step2"} />
              <Tab label="Step 3 - Destination" value="step3" disabled={activeTab !== "step3"} />
              <Tab label="Step 4 - Run" value="step4" disabled={activeTab !== "step4"} />
            </Tabs>
            
            <Box sx={{ 
              p: 4, 
              bgcolor: 'background.paper',
              minHeight: 400
            }}>
              {activeTab === "step1" && (
                <TabSource importData={importData} isLoadingSourceData={isLoadingSourceData} setActiveTab={setActiveTab} dataImportSource={dataImportSource} setDataImportSource={setDataImportSource} setImportData={setImportData} />
              )}
              {activeTab === "step2" && (
                <TabPreview importData={importData} isLoadingSourceData={isLoadingSourceData} setActiveTab={setActiveTab} dataImportSource={dataImportSource} />
              )}
              {activeTab === "step3" && (
                <TabDestination importData={importData} setActiveTab={setActiveTab} dataImportSource={dataImportSource} dataExportSource={dataExportSource} setDataExportSource={setDataExportSource} setIsExporting={setIsExporting} setStatus={setStatus} showFinalCount={showFinalCount} setShowFinalCount={setShowFinalCount} />
              )}
              {activeTab === "step4" && (
                <TabRun dataExportSource={dataExportSource} isExporting={isExporting} status={status} />
              )}
            </Box>
          </Box>
          
          {/* Action Buttons */}
          {importData && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button 
                onClick={handleStartOver} 
                variant="outlined" 
                color="error"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Start Over
              </Button>
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  )
}
