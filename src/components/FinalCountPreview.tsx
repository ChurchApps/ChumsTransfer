import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
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
        <TableRow key={index}>
          <TableCell>{camelCaseToWords(key)}</TableCell>
          <TableCell>{chumsData.length}</TableCell>
          <TableCell>{importData.length}</TableCell>
          <TableCell>{total}</TableCell>
        </TableRow>
      );
    });
    return rows;
  };

  const getTable = () => (
    <TableContainer sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Current</TableCell>
            <TableCell>To Add</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <DisplayBox headerIcon="" headerText="Final Count">
      {getTable()}
    </DisplayBox>
  );
};
