import React from "react"
import { Windmill } from "react-activity";
import { DisplayBox } from ".";
import { DataSourceType } from "../types";

interface Props {
  dataExportSource: string | null;
  isExporting: boolean;
  status: any;
}

export const TabRun = (props: Props) => {

  const getProgress = (name: string) => {

    if (props.status[name] === undefined) return (<li className="pending" key={name}>{name}</li>);

    if (props.status[name] === "error") return (<li className="error" key={name}>{name}</li>);

    if (props.status[name] === "running") return (
      <li key={name}>
        <Windmill className="inline-child" color="#727981" size={14} speed={1} animating={true} style={{ marginRight: 10 }} />
        <span className="inline-child">{name}</span>
      </li>
    );
    else return (<li className={props.status[name]} key={name}>{name}</li>);
  }

  const getExportSteps = () => {
    if (!props.isExporting) return null;
    else {
      let steps = ["Campuses/Services/Times", "People", "Photos", "Groups", "Group Members", "Donations", "Attendance", "Forms", "Questions", "Answers", "Form Submissions", "Compressing"];
      if (props.dataExportSource === DataSourceType.CHUMS_DB) steps = steps.filter(s => s !== "Compressing")
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

  return (<>
    <h2>Step 4 - Export Progress</h2>
    {props.dataExportSource && props.isExporting && (
      <div>{getExportSteps()}</div>
    )}
  </>)
}
