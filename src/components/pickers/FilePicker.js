import React, { useState } from 'react';
import LargeButton from '../buttons/LargeButton';

export default function FilePicker({ onFileSelected }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (onFileSelected) {
        onFileSelected(file);
      }
    }
  };

  const handleButtonClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  return (
    <div>
      <LargeButton label='Upload File' onClick={handleButtonClick} selected={false} />
      {selectedFile && <p>File selected: {selectedFile.name}</p>}

      <LargeButton label='Visualize' onClick={() => console.log("1")} selected={false} />
    </div>
  );
}
