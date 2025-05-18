'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 0.5rem;
    font-family: inherit;
  }

  .Toastify__toast--success {
    background-color: #059669;
  }

  .Toastify__toast--error {
    background-color: #dc2626;
  }

  .Toastify__toast--info {
    background-color: #2563eb;
  }

  .Toastify__toast--warning {
    background-color: #d97706;
  }

  .Toastify__toast-body {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: white;
  }

  .Toastify__progress-bar {
    background-color: rgba(255, 255, 255, 0.7);
  }

  .Toastify__close-button {
    color: white;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
`;

export const Toast: React.FC = () => (
  <StyledToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);
