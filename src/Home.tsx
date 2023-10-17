import React, { useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
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
      <Container>
        <h1>Import/Export Tool</h1>
        <p>Welcome to the import/export tool for ChuMS.  You can use this file to backup your ChuMS data or transfer your data out of ChuMS to be used in another system.  If you're just getting started you can also use this tool to import existing data into ChuMS.</p>
        <p>We support three different data formats at the moment; the ChuMS export file format, along with Breeze and Planning Center file formats.  You can use this tool to convert between any of these three in addition to reading/writing to your hosted ChuMS database.</p>
        <hr />

        <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)} defaultActiveKey="step1" className="importWizard">
          <Tab eventKey="step1" title="Step 1 - Source" disabled={activeTab !== "step1"}>
            <TabSource importData={importData} isLoadingSourceData={isLoadingSourceData} setActiveTab={setActiveTab} dataImportSource={dataImportSource} setDataImportSource={setDataImportSource} setImportData={setImportData} />
          </Tab>
          <Tab eventKey="step2" title="Step 2 - Preview" disabled={activeTab !== "step2"}>
            <TabPreview importData={importData} isLoadingSourceData={isLoadingSourceData} setActiveTab={setActiveTab} dataImportSource={dataImportSource} />
          </Tab>
          <Tab eventKey="step3" title="Step 3 - Destination" disabled={activeTab !== "step3"}>
            <TabDestination importData={importData} setActiveTab={setActiveTab} dataImportSource={dataImportSource} dataExportSource={dataExportSource} setDataExportSource={setDataExportSource} setIsExporting={setIsExporting} setStatus={setStatus} showFinalCount={showFinalCount} setShowFinalCount={setShowFinalCount} />
          </Tab>
          <Tab eventKey="step4" title="Step 4 - Run" disabled={activeTab !== "step4"}>
            <TabRun dataExportSource={dataExportSource} isExporting={isExporting} status={status} />
          </Tab>
        </Tabs>
        <br />
        {importData && (
          <button onClick={handleStartOver} className="btn btn-outline-danger">Start Over</button>
        )}
        <br /><br />

      </Container>
      <Footer />
    </>
  )
}
