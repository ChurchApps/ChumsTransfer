import React, { useState, useRef } from "react";
import { Container, Dropdown, DropdownButton, Tabs, Tab } from "react-bootstrap";
import "react-activity/dist/Dots.css"
import "react-activity/dist/Windmill.css"
import { Windmill } from "react-activity";
import { Footer, Header, DisplayBox } from "./components"
import { DataSourceType } from "./types/index"
import readChumsZip from "./helpers/ImportHelpers/ImportChumsZipHelper"
import getChumsData from "./helpers/ImportHelpers/ImportChumsDbHelper"
import readBreezeZip from "./helpers/ImportHelpers/ImportBreezeZipHelper"
import readPlanningCenterZip from "./helpers/ImportHelpers/ImportPlanningCenterZipHelper"
import generateBreezeZip from "./helpers/ExportHelpers/ExportBreezeZipHelper"
import generateChumsZip from "./helpers/ExportHelpers/ExportChumsZipHelper"
import exportToChumsDb from "./helpers/ExportHelpers/ExportChumsDbHelper"
import generatePlanningCenterZip from "./helpers/ExportHelpers/ExportPlanningCenterZipHelper"

import { ImportDataInterface } from "./helpers/ImportHelper";
import { TabPreview } from "./components/TabPreview";

const dataSourceDropDown = [
  { label: "Chums DB", value: DataSourceType.CHUMS_DB },
  { label: "Chums zip", value: DataSourceType.CHUMS_ZIP },
  { label: "Breeze zip", value: DataSourceType.BREEZE_ZIP },
  { label: "Planning center zip", value: DataSourceType.PLANNING_CENTER_ZIP }
];
export const Home = () => {
  const [dataImportSource, setDataImportSource] = useState<string | null>(null);
  const [dataExportSource, setDataExportSource] = useState<string | null>(null);
  const [, setUploadedFileName] = useState<string | null>(null);
  const [importData, setImportData] = useState<ImportDataInterface | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>("step1");
  const inputIsFile = dataImportSource !== DataSourceType.CHUMS_DB;
  const isLoadingSourceData = dataImportSource && !importData;
  let progress: any = {};

  const handleSelectFile = () => {
    inputRef.current?.click();
  };
  const handleStartOver = () => {
    setImportData(null)
    setDataImportSource(null)
    setDataExportSource(null)
    setIsExporting(false)
    setStatus({})
  };
  const handleImportSelection = (e: string) => {
    setDataImportSource(e)
    if (e === DataSourceType.CHUMS_DB) {
      setActiveTab("step2")
      importFromDb();
    }
  };
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
  const setProgress = (name: string, status: string) => {
    progress[name] = status;
    setStatus({ ...progress });
  }
  const importFromDb = async () => {
    setImportData(null)
    let importData: ImportDataInterface;
    importData = await getChumsData();
    setImportData(importData);
  };
  const handleDisplayFileDetails = () => {
    inputRef.current?.files
      && setUploadedFileName(inputRef.current.files[0].name);
    handleUpload();
  };
  const handleUpload = async () => {
    setActiveTab("step2")
    setImportData(null)
    let importData: ImportDataInterface;
    switch (dataImportSource) {
      case DataSourceType.CHUMS_ZIP: {
        importData = await readChumsZip(inputRef.current?.files[0])
        break;
      }
      case DataSourceType.BREEZE_ZIP: {
        importData = await readBreezeZip(inputRef.current?.files[0])
        break;
      }
      case DataSourceType.PLANNING_CENTER_ZIP: {
        importData = await readPlanningCenterZip(inputRef.current?.files[0])
        break;
      }
      default: {
        break;
      }
    }
    setImportData(importData);
  }
  const handleExport = async (e: string) => {
    setDataExportSource(e)
    if (e === dataImportSource) {
      alert("Export source must be different than import source to avoid duplication of data")
      return;
    } else {
      setIsExporting(true)
      setActiveTab("step4")
      switch (e) {
        case DataSourceType.CHUMS_DB: {
          await exportToChumsDb(importData, setProgress)
          break;
        }
        case DataSourceType.CHUMS_ZIP: {
          await generateChumsZip(importData, setProgress)
          break;
        }
        case DataSourceType.BREEZE_ZIP: {
          generateBreezeZip(importData, setProgress)
          break;
        }
        case DataSourceType.PLANNING_CENTER_ZIP: {
          generatePlanningCenterZip(importData, setProgress)
          break;
        }
        default: {
          break;
        }
      }
    }
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
            <>
              <h2>Step 1 - Import Source</h2>
              <p>Choose data source for import data</p>
              <DropdownButton id="dropdown-import-types" title={dataImportSource ?? "Choose One"} onSelect={(e) => handleImportSelection(e)}>
                <Dropdown.Item eventKey={DataSourceType.CHUMS_DB}>Chums Database</Dropdown.Item>
                <Dropdown.Item eventKey={DataSourceType.CHUMS_ZIP}>Chums Import Zip</Dropdown.Item>
                <Dropdown.Item eventKey={DataSourceType.BREEZE_ZIP}>Breeze Import Zip</Dropdown.Item>
                <Dropdown.Item eventKey={DataSourceType.PLANNING_CENTER_ZIP}>Planning Center zip</Dropdown.Item>
              </DropdownButton>
              <br></br>
              <br></br>
              {(dataImportSource && inputIsFile && importData == null) && (
                <>
                  <label className="mx-3">Please select your {dataSourceDropDown.find(s => s.value === dataImportSource).label} file </label>
                  <input ref={inputRef} className="d-none" type="file" onChange={handleDisplayFileDetails} />
                  <button onClick={handleSelectFile} className="btn btn-outline-primary">Upload</button>
                </>
              )}
              {importData && (
                <button onClick={handleStartOver} className="btn btn-outline-danger">Start Over</button>
              )}
            </>
          </Tab>
          <Tab eventKey="step2" title="Step 2 - Preview">
            <TabPreview importData={importData} isLoadingSourceData={isLoadingSourceData} setActiveTab={setActiveTab} dataImportSource={dataImportSource} />
          </Tab>
          <Tab eventKey="step3" title="Step 3 - Destination">
            <>
              <h2>Step 3 - Choose Export Destination</h2>
              <p>Choose export format</p>
              <DropdownButton id="dropdown-export-types" title={dataExportSource ?? "Choose One"} onSelect={(e) => handleExport(e)}>
                <Dropdown.Item eventKey={DataSourceType.CHUMS_DB}>Chums Database</Dropdown.Item>
                <Dropdown.Item eventKey={DataSourceType.CHUMS_ZIP}>Chums Export Zip</Dropdown.Item>
                <Dropdown.Item eventKey={DataSourceType.BREEZE_ZIP}>Breeze Export Zip</Dropdown.Item>
                <Dropdown.Item eventKey={DataSourceType.PLANNING_CENTER_ZIP}>Planning Center zip</Dropdown.Item>
              </DropdownButton>
              <br></br>
              <br></br>
            </>
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
