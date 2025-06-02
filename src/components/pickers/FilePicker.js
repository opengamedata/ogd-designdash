import React, { useState } from "react";
import LargeButton from "../buttons/LargeButton";
import * as d3 from "d3";
export default function FilePicker({ setRawData }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (validateFile(file)) {
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

  const validateFile = (file) => {
    if (!file) {
      alert("No file selected");
      return false;
    }

    if (file.type !== "text/tab-separated-values") {
      alert("Only TSV files are supported");
      return false;
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
