import React, { useState } from "react"
import { Dropdown, DropdownButton } from "react-bootstrap";
import { ImportDataInterface } from "../helpers/ImportHelper";
import { DataSourceType } from "../types";
import getChumsData from "../helpers/ImportHelpers/ImportChumsDbHelper"
import generateBreezeZip from "../helpers/ExportHelpers/ExportBreezeZipHelper"
import generateChumsZip from "../helpers/ExportHelpers/ExportChumsZipHelper"
import exportToChumsDb from "../helpers/ExportHelpers/ExportChumsDbHelper"
import generatePlanningCenterZip from "../helpers/ExportHelpers/ExportPlanningCenterZipHelper"
import { FinalCountPreview } from "./FinalCountPreview";

interface Props {
  dataImportSource?: String;
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

  return (<>
    <h2>Step 3 - Choose Export Destination</h2>
    <p>Choose export format</p>
    <DropdownButton id="dropdown-export-types" title={props.dataExportSource ?? "Choose One"} onSelect={handleSelect}>
      <Dropdown.Item eventKey={DataSourceType.CHUMS_DB}>Chums Database</Dropdown.Item>
      <Dropdown.Item eventKey={DataSourceType.CHUMS_ZIP}>Chums Export Zip</Dropdown.Item>
      <Dropdown.Item eventKey={DataSourceType.BREEZE_ZIP}>Breeze Export Zip</Dropdown.Item>
      <Dropdown.Item eventKey={DataSourceType.PLANNING_CENTER_ZIP}>Planning Center zip</Dropdown.Item>
    </DropdownButton>
    <br></br>
    <br></br>
    <div>
      {props.showFinalCount && props.importData && chumsData &&
        <>
          <FinalCountPreview importData={props.importData} chumsData={chumsData} />
          <button className="btn btn-success float-right" onClick={() => handleExport(DataSourceType.CHUMS_DB)}>Confirm</button>
        </>
      }
    </div>
    <br></br>
    <br></br>
  </>)
}
