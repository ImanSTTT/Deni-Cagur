import React from 'react';

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
      {children && <div className="flex items-center gap-2">
        {children}
      </div>}
    </div>
  );
};

export default PageHeader;
