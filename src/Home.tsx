import React, { useState } from "react";
import { Container, Dropdown, DropdownButton, Tabs, Tab } from "react-bootstrap";
import "react-activity/dist/Dots.css"
import "react-activity/dist/Windmill.css"
import { Windmill } from "react-activity";
import { Footer, Header, DisplayBox } from "./components"
import { DataSourceType } from "./types/index"


import { ImportDataInterface } from "./helpers/ImportHelper";
import { TabSource } from "./components/TabSource";
import { TabPreview } from "./components/TabPreview";
import { TabDestination } from "./components/TabDestination";

export const Home = () => {
  const [dataImportSource, setDataImportSource] = useState<string | null>(null);
  const [dataExportSource, setDataExportSource] = useState<string | null>(null);

  const [importData, setImportData] = useState<ImportDataInterface | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [status, setStatus] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>("step1");

  const isLoadingSourceData = dataImportSource && !importData;

  const getProgress = (name: string) => {

    if (status[name] === undefined) return (<li className="pending" key={name}>{name}</li>);

    if (status[name] === "error") return (<li className="error" key={name}>{name}</li>);

    if (status[name] === "running") return (
      <li key={name}>
        <Windmill className="inline-child" color="#727981" size={14} speed={1} animating={true} style={{ marginRight: 10 }} />
        <span className="inline-child">{name}</span>
      </li>
    );
    else return (<li className={status[name]} key={name}>{name}</li>);
  }

  const handleStartOver = () => {
    setImportData(null)
    setDataImportSource(null)
    setDataExportSource(null)
    setIsExporting(false)
    setStatus({})
  };

  const getExportSteps = () => {
    if (!isExporting) return null;
    else {
      let steps = ["Campuses/Services/Times", "People", "Photos", "Groups", "Group Members", "Donations", "Attendance", "Forms", "Questions", "Answers", "Form Submissions", "Compressing"];
      if (dataExportSource === DataSourceType.CHUMS_DB) steps = steps.filter(s => s !== "Compressing")
      let stepsHtml: JSX.Element[] = [];
      steps.forEach((s) => stepsHtml.push(getProgress(s)));

      return (
        <DisplayBox headerText="Export" headerIcon="fas fa-download">
          Exporting content:
          <ul className="statusList">{stepsHtml}</ul>
          <p>This process may take some time.  It is important that you do not close your browser until it has finished.</p>
        </DisplayBox>
      );
    }
  }
  return (
    <>
      <Header />
      <Container>
        <h1>Import/Export Tool</h1>
        <p>Welcome to the import/export tool for ChuMS.  You can use this file to backup your ChuMS data or transfer your data out of ChuMS to be used in another system.  If you're just getting started you can also use this tool to import existing data into ChuMS.</p>
        <p>We support three different data formats at the moment; the ChuMS export file format, along with Breeze and Planning Center file formats.  You can use this tool to convert between any of these three in addition to reading/writing to your hosted ChuMS database.</p>
        <hr />

        <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)} defaultActiveKey="step1" className="importWizard">
          <Tab eventKey="step1" title="Step 1 - Source">
            <TabSource importData={importData} isLoadingSourceData={isLoadingSourceData} setActiveTab={setActiveTab} dataImportSource={dataImportSource} setDataImportSource={setDataImportSource} setImportData={setImportData} startOver={handleStartOver} />
          </Tab>
          <Tab eventKey="step2" title="Step 2 - Preview">
            <TabPreview importData={importData} isLoadingSourceData={isLoadingSourceData} setActiveTab={setActiveTab} dataImportSource={dataImportSource} />
          </Tab>
          <Tab eventKey="step3" title="Step 3 - Destination">
            <TabDestination importData={importData} setActiveTab={setActiveTab} dataImportSource={dataImportSource} dataExportSource={dataExportSource} setDataExportSource={setDataExportSource} setIsExporting={setIsExporting} setStatus={setStatus} />
          </Tab>
          <Tab eventKey="step4" title="Step 4 - Run">
            <>
              <h2>Step 4 - Export Progress</h2>
              {dataExportSource && isExporting && (
                <div>{getExportSteps()}</div>
              )}
            </>
          </Tab>
        </Tabs>
        <br /><br />

      </Container>
      <Footer />
    </>
  )
}
