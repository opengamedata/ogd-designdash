import React from 'react';

const GridLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div>
      {/* TODO: react-grid-layout wrapper */}
      {children}
    </div>
  );
};

export default GridLayout;
