import React from "react";
import { Table } from "react-bootstrap";
import { ImportDataInterface } from "../helpers/ImportHelper";
import { DisplayBox } from "@churchapps/apphelper";

interface Props {
  importData: ImportDataInterface;
  chumsData: ImportDataInterface;
}

export const FinalCountPreview = (props: Props) => {
  const camelCaseToWords = (str: string) => {
    const spacedString = str.replace(/([A-Z])/g, " $1");
    const capitalisedString = spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
    return capitalisedString;
  };

  const getRows = () => {
    let rows: any[] = [];
    const keys = Object.keys(props.chumsData);
    keys.forEach((key, index) => {
      let chumsData = props.chumsData[key as keyof ImportDataInterface];
      let importData = props.importData[key as keyof ImportDataInterface];
      const total = chumsData.length + importData.length;
      rows.push(
        <tr key={index}>
          <td>{camelCaseToWords(key)}</td>
          <td>{chumsData.length}</td>
          <td>{importData.length}</td>
          <td>{total}</td>
        </tr>
      );
    });
    return rows;
  };

  const getTable = () => (
    <Table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Current</th>
          <th>To Add</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>{getRows()}</tbody>
    </Table>
  );

  return (
    <DisplayBox headerIcon="" headerText="Final Count">
      {getTable()}
    </DisplayBox>
  );
};
