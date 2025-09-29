import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const CustomBreadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(path => path);

  return (
    <Breadcrumb className="mb-3">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
        Dashboard
      </Breadcrumb.Item>
      
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        const pathUrl = `/${paths.slice(0, index + 1).join('/')}`;
        const pathName = path.charAt(0).toUpperCase() + path.slice(1);
        
        return isLast ? (
          <Breadcrumb.Item active key={pathUrl}>
            {pathName}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: pathUrl }} key={pathUrl}>
            {pathName}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;