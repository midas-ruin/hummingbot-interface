'use client';

import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Dialog = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 28rem;
  width: 90%;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant }) =>
    variant === 'primary'
      ? `
    background-color: #2563eb;
    color: white;
    border: none;
    &:hover {
      background-color: #1d4ed8;
    }
  `
      : `
    background-color: white;
    color: #4b5563;
    border: 1px solid #d1d5db;
    &:hover {
      background-color: #f3f4f6;
    }
  `}
`;

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <Dialog role="dialog" aria-modal="true">
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirm
          </Button>
        </ButtonGroup>
      </Dialog>
    </Overlay>
  );
};
