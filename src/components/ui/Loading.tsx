import React from 'react';
import { Box, CircularProgress, Typography, Stack } from '@mui/material';

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  center?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "md",
  message,
  center = true
}) => {
  const getSize = () => {
    switch (size) {
      case "sm": return 24;
      case "lg": return 48;
      default: return 32;
    }
  };

  const content = (
    <Stack spacing={2} alignItems="center">
      <CircularProgress size={getSize()} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Stack>
  );

  if (center) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        py: 4
      }}>
        {content}
      </Box>
    );
  }

  return content;
};