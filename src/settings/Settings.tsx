import React from "react";
import { Routes, Route } from "react-router-dom";
import { ExportPage } from "./ExportPage"
import { ImportPage } from "./ImportPage"

export const Settings: React.FC = () => {
  console.log("***SETTINGS")
  return (
    <Routes>
      <Route path="/import" element={<ImportPage />} />
      <Route path="/export" element={<ExportPage />} />
    </Routes>
  );
}

