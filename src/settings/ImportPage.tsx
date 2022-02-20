import React from "react";
import { InputBox, UploadHelper, StandardInterface } from "./components";
import { Row, Col, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";
import JSZip from "jszip";
import * as XLSX from 'xlsx';
import { ConverterHelper } from '../helpers';

export const ImportPage = () => {

  const [sourceCms, setSourceCms] = React.useState<string>('');
  const [toCMS, setToCMS] = React.useState<string>(null);
  const [sourceData, setSourceData] = React.useState<any>([]);
  const [convertedData, setConvertedData] = React.useState<any>(null);
  const [showPreview, setShowPreview] = React.useState<boolean>(null);
  const [previewData, setPreviewData] = React.useState<any>([]);

  const standardizedCategories = {
    contributions: 'donations',
    people: 'people',
    tags: 'tags',
    events: 'events',
    notes: 'notes'
  }

  const cmsOptions = ['chums', 'breeze'];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target) {
      let file = e.target.files[0];
      readZip(file);
    }
  }

  const detectSource = (data: any, type: string) => {
    let matchedCMS = '';
    let highestMatch = 0;
    if (data[0]) {
    const dataKeys = Object.keys(data[0]);
    cmsOptions.map((cms: any)=> {
      if (cms === type) {
        const dataKeys = Object.keys(data[0]);
        // @ts-ignore
        const cmsKeys: any = Object.values(ConverterHelper[type]);
        const matches = dataKeys.reduce((a, c) => a + cmsKeys.includes(c), 0);
        if (matches > highestMatch) {
          highestMatch = matches;
          matchedCMS = cms;
        }
      }
    });
    }
    return matchedCMS;
  }

  const loadCsvFile = async (file: JSZip.JSZipObject) => {
    const csv = UploadHelper.readCsvString(await file.async("string"));
    setSourceData(csv);
    console.log("CSV", csv);
  }

  const loadExcelFile = async (file: JSZip.JSZipObject) => {
    const xlsx = XLSX.read(await file.async("arraybuffer"), {type: 'buffer'});
    let source = cmsOptions.find((option: string) => xlsx?.Props?.Author.toLowerCase().includes(option)) || null;
    const standardizedData: StandardInterface = {};
    let category = xlsx?.Props?.Category?.toLowerCase() as keyof typeof standardizedData;
    if (xlsx?.Props?.Category === 'Contributions' && xlsx.Props.SheetNames[0] === 'Notes') category = 'notes';
    const standardizedCategory = standardizedCategories[category as keyof typeof standardizedCategories] as keyof typeof standardizedData;
    let preview: any = {[category]: {header: [], rows: []}};
    standardizedData[standardizedCategory] = [];
    for (const sheetName of xlsx.SheetNames) {
      let sheetData: any = {[sheetName]: []};
      const sheetJson = XLSX.utils.sheet_to_json(xlsx.Sheets[sheetName], {defval: ""});
      for (const row of sheetJson) {
        if (!source) source = detectSource(row, category);
        let standardizedRow: any = {};
        let previewTableHeaders = Object.keys(row);
        preview[category].header = [...new Set([...preview[category].header,...previewTableHeaders])];
        preview[category].rows.push(row);
        if (previewTableHeaders.length > preview[category].header.length) preview[category].header.push(previewTableHeaders);
        for (const [key, value] of Object.entries(row)) {
          if (source && category) {
            // @ts-ignore
            const referenceKeys = ConverterHelper[source][category];
            const matchedStandardizedKey = Object.keys(referenceKeys).find((k: string) => referenceKeys[k].name === key);
            if (matchedStandardizedKey) standardizedRow[matchedStandardizedKey] = value;
          }
        }
        sheetData[sheetName].push(standardizedRow);
      }
      standardizedData[standardizedCategory].push(sheetData);
    }
    setSourceCms(source);
    let existingSourceData = sourceData;
    let existingPreviewData = previewData;
    existingSourceData.push(standardizedData)
    existingPreviewData.push(preview);
    setSourceData(existingSourceData);
    setPreviewData(existingPreviewData);
    console.log('SOURCE DATA ', existingSourceData);
    console.log('PREVIEW DATA ', preview);
  }


  const readZip = async (zipFile: File) => {
    const zip = await JSZip.loadAsync(zipFile);
    console.log(zip.files);
    for (const file in zip.files) {
      const fileExt = file.split(".")[1];
      if (fileExt === "csv") await loadCsvFile(zip.file(file));
      if (fileExt === "xls" || fileExt === "xlsx") await loadExcelFile(zip.file(file));
    }

    // if (sourceData.length > 0) setShowPreview(true);
  }

  const handleCMSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.name === 'fromCMS') setSourceCms(e.target.value);
    if (e.target.name === 'toCMS') setToCMS(e.target.value);
  }

  const getAction = () => {
    if (sourceData.length < 1) return (
      <>
        {/* <FormGroup>
          <FormLabel>Convert Data From</FormLabel>
          <FormControl as="select" name="fromCMS" onChange={handleCMSChange}>
            <option value="" selected disabled hidden>Convert From</option>
            <option value="chums">Chums</option>
            <option value="breeze">Breeze</option>
          </FormControl>
        </FormGroup>
        <div className="text-center">
          <i className="fas fa-arrow-down center" style={{fontSize: '64px', margin: 'auto'}}></i>
        </div> */}

        <InputBox headerText="Import" headerIcon="fas fa-upload" saveText="Upload and Preview" saveFunction={() => { document.getElementById("fileUpload").click(); }}>
          Select a files to Upload.
          <input type="file" onChange={handleUpload} id="fileUpload" accept=".zip" style={{ display: "none" }} />
        </InputBox>

        {/* <FormGroup>
          <FormLabel>Convert Data To</FormLabel>
          <FormControl as="select" defaultValue="" name="toCMS" onChange={handleCMSChange}>
            { sourceCms !== 'breeze' && <option disabled={!sourceCms} value="breeze">Breeze</option> }
            { sourceCms !== 'chums' && <option disabled={!sourceCms} value="chums">Chums</option> }
          </FormControl>
        </FormGroup> */}

        {/* {showPreview && <Button variant="primary" onClick={convertData}>Export Data</Button>} */}


      </>
    );
    else return <Button variant="primary" onClick={convertData}>Export Data</Button>
    // else return <></>
    // else return <ImportPreview importData={previewData} triggerRender={1}></ImportPreview>;
    // else return (<ImportStatus importData={getData()} />);
  }

  const convertData = () => {
    if (sourceData) { // [{events: [{File Name: [{date: '12-2-22', name: 'joe'}, {date: '12-2-22', name: 'joe'}]}]}, {donations: [...]}]
      const to = 'chums';
      let final: any = [];
      let convertedData: any = ConverterHelper[to]; //{donations: {…}, attendance: {…}, groupmembers: {…}, groups: {…}, services: {…}, …}

      for (const [categoryName, categoryData] of Object.entries(convertedData)) {
        const finalCategory: any = {[categoryName] : []};
        let tst = sourceData.find((catObj: any) => catObj[categoryName]);
        if (tst) {
          tst[categoryName].forEach((file: any) => {
            for (const [fileName, rows] of Object.entries(file)) {
              let fileData: any = {[fileName]: []};
              //@ts-ignore
              rows.forEach((row: any) => {
                let newRow: any = {};
                for (const [columnName, data] of Object.entries(row)) {
                  //@ts-ignore
                  if (categoryData[columnName]) {
                    //@ts-ignore
                    let name: any = categoryData[columnName].name;
                    let val = data;
                    newRow[name] = val;
                  }
                }
                fileData[fileName].push(newRow);
                finalCategory[categoryName].push(fileData);
              });
            }
          });
        }
        final.push(finalCategory);
      }

    }
    console.log('CONVERTEDDATA', convertData)
  }

  return (
    <>
      <Row>
        <Col lg={6}>{getAction()}</Col>
        {/* {sourceData.length > 0 && <Col lg={8}><ImportPreview importData={sourceData} triggerRender={triggerRender} /></Col> } */}
      </Row>
    </>
  );
}
