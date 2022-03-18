import React, { useRef, useState } from "react"
import { Dropdown, DropdownButton } from "react-bootstrap";
import { ImportDataInterface } from "../helpers/ImportHelper";
import { DataSourceType } from "../types";
import readChumsZip from "../helpers/ImportHelpers/ImportChumsZipHelper"
import getChumsData from "../helpers/ImportHelpers/ImportChumsDbHelper"
import readBreezeZip from "../helpers/ImportHelpers/ImportBreezeZipHelper"
import readPlanningCenterZip from "../helpers/ImportHelpers/ImportPlanningCenterZipHelper"

interface Props {
  dataImportSource?: String;
  importData: ImportDataInterface;
  isLoadingSourceData: boolean;
  setActiveTab: (tabName: string) => void
  startOver: () => void
  setImportData: (data: ImportDataInterface) => void
  setDataImportSource: (data: string | null) => void
}

export const TabSource = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputIsFile = props.dataImportSource !== DataSourceType.CHUMS_DB;
  const [, setUploadedFileName] = useState<string | null>(null);

  const dataSourceDropDown = [
    { label: "Chums DB", value: DataSourceType.CHUMS_DB },
    { label: "Chums zip", value: DataSourceType.CHUMS_ZIP },
    { label: "Breeze zip", value: DataSourceType.BREEZE_ZIP },
    { label: "Planning center zip", value: DataSourceType.PLANNING_CENTER_ZIP }
  ];

  const handleUpload = async () => {
    props.setActiveTab("step2")
    props.setImportData(null)
    let importData: ImportDataInterface;
    switch (props.dataImportSource) {
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
    props.setImportData(importData);
  }

  const importFromDb = async () => {
    props.setImportData(null)
    let importData: ImportDataInterface;
    importData = await getChumsData();
    props.setImportData(importData);
  };

  const handleDisplayFileDetails = () => {
    inputRef.current?.files
      && setUploadedFileName(inputRef.current.files[0].name);
    handleUpload();
  };

  const handleSelectFile = () => {
    inputRef.current?.click();
  };

  const handleImportSelection = (e: string) => {
    props.setDataImportSource(e)
    if (e === DataSourceType.CHUMS_DB) {
      props.setActiveTab("step2")
      importFromDb();
    }
  };

  return (<>
    <h2>Step 1 - Import Source</h2>
    <p>Choose data source for import data</p>
    <DropdownButton id="dropdown-import-types" title={props.dataImportSource ?? "Choose One"} onSelect={(e) => handleImportSelection(e)}>
      <Dropdown.Item eventKey={DataSourceType.CHUMS_DB}>Chums Database</Dropdown.Item>
      <Dropdown.Item eventKey={DataSourceType.CHUMS_ZIP}>Chums Import Zip</Dropdown.Item>
      <Dropdown.Item eventKey={DataSourceType.BREEZE_ZIP}>Breeze Import Zip</Dropdown.Item>
      <Dropdown.Item eventKey={DataSourceType.PLANNING_CENTER_ZIP}>Planning Center zip</Dropdown.Item>
    </DropdownButton>
    <br></br>
    <br></br>
    {(props.dataImportSource && inputIsFile && props.importData == null) && (
      <>
        <label className="mx-3">Please select your {dataSourceDropDown.find(s => s.value === props.dataImportSource).label} file </label>
        <input ref={inputRef} className="d-none" type="file" onChange={handleDisplayFileDetails} />
        <button onClick={handleSelectFile} className="btn btn-outline-primary">Upload</button>
      </>
    )}
    {props.importData && (
      <button onClick={props.startOver} className="btn btn-outline-danger">Start Over</button>
    )}
  </>);
}
