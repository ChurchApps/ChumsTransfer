import React from 'react';
import { Chip } from '@mui/material';

interface StatusChipProps {
  status: string;
  variant?: "standard" | "header";
  size?: "small" | "medium";
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  variant = "standard",
  size = "small"
}) => {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes('member') || normalizedStatus.includes('active') || normalizedStatus.includes('complete')) {
      return {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32"
      };
    }
    
    if (normalizedStatus.includes('visitor') || normalizedStatus.includes('pending') || normalizedStatus.includes('warning')) {
      return {
        backgroundColor: "#fff3e0",
        color: "#f57c00"
      };
    }
    
    if (normalizedStatus.includes('staff') || normalizedStatus.includes('admin') || normalizedStatus.includes('info')) {
      return {
        backgroundColor: "#e3f2fd",
        color: "#1565c0"
      };
    }
    
    // Default gray for other statuses
    return {
      backgroundColor: "transparent",
      color: variant === "header" ? "#FFF" : "text.secondary",
      border: variant === "header" ? "1px solid rgba(255,255,255,0.5)" : "1px solid #e0e0e0"
    };
  };

  const colors = getStatusColor(status);
  
  if (variant === "header") {
    return (
      <Chip
        label={status}
        size={size}
        sx={{ 
          backgroundColor: "rgba(255,255,255,0.2)", 
          color: "#FFF",
          fontSize: '0.75rem',
          height: 20,
          fontWeight: 600
        }}
      />
    );
  }

  return (
    <Chip 
      label={status} 
      size={size} 
      sx={{ 
        ...colors,
        fontWeight: 600,
        fontSize: '0.75rem'
      }} 
    />
  );
};