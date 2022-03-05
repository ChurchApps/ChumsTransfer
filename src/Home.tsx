import React, { useState, useRef } from "react";
import { Button, Container, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Footer, Header } from "./components"
import { DataSourceType } from "./types/index"
import { ImportPreview } from "./settings/components/ImportPreview";
import readChumsZip from "./helpers/ImportHelpers/ImportChumsCsvHelper"
import getChumsData from "./helpers/ImportHelpers/ImportChumsDbHelper"
import readBreezeZip from "./helpers/ImportHelpers/ImportBreezeCsvHelper"
import { ImportDataInterface } from "./helpers/ImportHelper";

const dataSourceDropDown = [
  {label: "Chums DB", value: DataSourceType.CHUMS_DB},
  {label: "Chums zip", value: DataSourceType.CHUMS_ZIP},
  {label: "Breeze zip", value: DataSourceType.BREEZE_ZIP},
  {label: "Planning center zip", value: DataSourceType.PLANNING_CENTER_ZIP}
];
export const Home = () => {
  const [dataImportSource, setDataImportSource] = useState<string | null>(null);
  const [dataExportSource, setDataExportSource] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [importData, setImportData] = useState<ImportDataInterface | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputIsFile = dataImportSource !== DataSourceType.CHUMS_DB;

  const handleSelectFile = () => {
    inputRef.current?.click();
  };
  const handleImportSelection = (e: string) => {
    setDataImportSource(e)
    if(e === DataSourceType.CHUMS_DB){
      importFromDb();
    }
  };
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
    setImportData(null)
    let importData: ImportDataInterface;
    switch(dataImportSource) {
      case DataSourceType.CHUMS_ZIP: {
        importData = await readChumsZip(inputRef.current?.files[0])
        break;
      }
      case DataSourceType.BREEZE_ZIP: {
        importData = await readBreezeZip(inputRef.current?.files[0])
        break;
      }
      case DataSourceType.PLANNING_CENTER_ZIP: {
        importData = await readChumsZip(inputRef.current?.files[0])
        break;
      }
      default: {
        break;
      }
    }
    setImportData(importData);
  }
  const handleExport = () => {

  };
  return (
    <>
      <Header />
      <Container>
        <h1>Import/Export Tool</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper et magna in imperdiet. Pellentesque nec fermentum neque, sed accumsan ex. Suspendisse eu turpis vel mi bibendum dictum quis non nibh. Aliquam venenatis urna ac purus mattis aliquam. Nulla facilisi. In placerat ex congue, eleifend dolor sit amet, molestie magna. Aliquam imperdiet lacinia arcu eget accumsan. Nunc pulvinar facilisis porttitor. Quisque commodo nisl quam, nec posuere elit bibendum nec. Nam lacinia, odio et elementum tempor, purus dolor eleifend dui, in imperdiet ligula metus eget dui.</p>

        <p>Sed semper dolor nulla, at pretium est placerat sed. Quisque tempor, odio quis iaculis bibendum, sapien tortor blandit est, quis vulputate leo tortor id dolor. Quisque sed ornare nunc, eu congue neque. Integer bibendum porttitor purus, sed cursus purus tincidunt vitae. Morbi ipsum urna, molestie id posuere in, luctus sit amet quam. Mauris pellentesque dolor a purus mollis iaculis a eget enim. Etiam et venenatis nibh, ac aliquam urna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque tristique accumsan iaculis. Donec ut dolor augue. Proin sed felis elementum diam eleifend maximus. Morbi dictum et tortor eu condimentum.</p>
        <hr />
        {importData == null && (
          <>
            <h2>Step 1 - Import Source</h2>
            <p>Choose data source for import data</p>
            <DropdownButton id="dropdown-import-types" title={dataImportSource ?? "Choose One"} onSelect={(e) => handleImportSelection(e)}>
              <Dropdown.Item eventKey={DataSourceType.CHUMS_DB}>Chums DB</Dropdown.Item>
              <Dropdown.Item eventKey={DataSourceType.CHUMS_ZIP}>Chums zip</Dropdown.Item>
              <Dropdown.Item eventKey={DataSourceType.BREEZE_ZIP}>Breeze zip</Dropdown.Item>
              <Dropdown.Item eventKey={DataSourceType.PLANNING_CENTER_ZIP}>Planning center zip</Dropdown.Item>
            </DropdownButton>
          </>
        )}
        {importData && (
          <>
            <h2>Step 2 - Export</h2>
            <p>Choose export format</p>
            <DropdownButton id="dropdown-export-types" title={dataExportSource ?? "Choose One"} onSelect={(e) => setDataExportSource(e)}>
              <Dropdown.Item eventKey={DataSourceType.CHUMS_DB}>Chums DB</Dropdown.Item>
              <Dropdown.Item eventKey={DataSourceType.CHUMS_ZIP}>Chums zip</Dropdown.Item>
              <Dropdown.Item eventKey={DataSourceType.BREEZE_ZIP}>Breeze zip</Dropdown.Item>
              <Dropdown.Item eventKey={DataSourceType.PLANNING_CENTER_ZIP}>Planning center zip</Dropdown.Item>
            </DropdownButton>
          </>
        )}

        {(dataImportSource && inputIsFile && importData == null) && (
          <>
            <label className="mx-3">Please select your {dataSourceDropDown.find(s => s.value === dataImportSource).label} file </label>
            <input ref={inputRef} className="d-none" type="file" onChange={handleDisplayFileDetails} />
            <button onClick={handleSelectFile} className="btn btn-outline-primary">Upload</button>
          </>
        )}

        {dataExportSource && (
          <>
            <br></br>
            <button
              onClick={handleExport}
              className={`btn btn-outline-success`}
            >
              Export data
            </button>
          </>
        )}

        {importData && (
          <ImportPreview triggerRender={1} importData={importData} />
        )}
        <hr />
        <Link to={"/settings/import"}>Temp Link to Old Import</Link><br />
        <Link to={"/settings/export"}>Temp Link to Old Export</Link><br />
        <br /><br />

      </Container>
      <Footer />
    </>
  )}
