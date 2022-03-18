import React from "react"
import { Dots } from "react-activity";
import { ImportDataInterface } from "../helpers/ImportHelper";
import { ImportPreview } from "../settings/components";
import { DataSourceType } from "../types";

interface Props {
  dataImportSource?: String;
  importData: ImportDataInterface;
  isLoadingSourceData: boolean;
  setActiveTab: (tabName: string) => void
}

export const TabPreview = (props: Props) => {
  const getPreview = () => {
    if (props.importData) return <ImportPreview triggerRender={1} importData={props.importData} />
  }

  return (<>
    <h2>Step 2 - Preview</h2>
    {props.isLoadingSourceData && props.dataImportSource === DataSourceType.CHUMS_DB && (
      <div style={{ justifyContent: "center", display: "flex" }}>
        <Dots color="#727981" size={34} speed={1} animating={true} />
      </div>
    )}
    {getPreview()}
    <div>
      <button onClick={() => props.setActiveTab("step3")} className="btn btn-success float-right">Continue</button>
    </div>
    <br />
    <br />
  </>)
}
