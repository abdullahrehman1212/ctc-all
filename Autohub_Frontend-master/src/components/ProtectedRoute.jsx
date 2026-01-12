import React from 'react';  // Add this line if necessary
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { demoPages } from '../menu';

const ProtectedRoute = ({ element }) => {
  const userToken = Cookies.get('userToken1');
  
  if (userToken === undefined || userToken === null) {
    return <Navigate to={`../${demoPages.login.path}`} replace />;
  }

  return element;
};

export default ProtectedRoute; 
