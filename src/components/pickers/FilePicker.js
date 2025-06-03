import React, { useState } from "react";
import LargeButton from "../buttons/LargeButton";
import * as d3 from "d3";
import { Visualizers } from "../../enums/Visualizers";

export default function FilePicker({ setRawData, visualizerType }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (validateFile(file, visualizerType)) {
      setSelectedFile(file);
      await parseFileToRawData(file);
    }
  };

  const handleButtonClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = async (event) => {
      await handleFileChange(event);
    };
    fileInput.click();
  };

  const validateFile = (file, visualizerType) => {
    if (!file) {
      alert("No file selected");
      return false;
    }

    if (file.type !== "text/tab-separated-values") {
      alert("Make sure the file is a TSV file");
      return false;
    }

    if (visualizerType === Visualizers.HISTOGRAM) {
      // e.g. AQUALAB_20250107_to_20250107_6ee74c3_player-features.tsv or AQUALAB_20250107_to_20250107_6ee74c3_session-features.tsv
      const regex =
        /\w{1,}_\d{8}_to_\d{8}_\w{7}_(player|session)-features\.tsv/;
      if (!regex.test(file.name)) {
        alert(
          "Only player or session features TSV files are supported for histograms"
        );
        return false;
      }
    }

    if (visualizerType === Visualizers.JOB_GRAPH) {
      // e.g. AQUALAB_20250107_to_20250107_6ee74c3_population-features.tsv
      const regex = /\w{1,}_\d{8}_to_\d{8}_\w{7}_population-features\.tsv/;
      if (!regex.test(file.name)) {
        alert(
          "Only population features TSV files are supported for job graphs"
        );
        return false;
      }
    }

    return true;
  };

  const parseFileToRawData = async (file) => {
    const url = URL.createObjectURL(file);
    const extractedData = await d3.tsv(url);
    console.log("parsed file to raw data", extractedData);
    setRawData(extractedData);
  };

  return (
    <div>
      <LargeButton
        label="Upload File"
        onClick={handleButtonClick}
        selected={false}
      />
      {selectedFile && (
        <p className="break-words">File selected: {selectedFile.name}</p>
      )}
    </div>
  );
}
