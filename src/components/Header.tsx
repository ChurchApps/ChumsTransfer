import React from "react"
import { AppBar, Toolbar, Container, Box, Button, Typography, Link } from "@mui/material";
import { UserHelper } from "@churchapps/apphelper";

export const Header: React.FC = () => {

  const getHeaderLink = () => {
    if (!UserHelper.user) return <Link href="/login" color="inherit">Login</Link>
    else return UserHelper.user.firstName + " " + UserHelper.user.lastName;
  }

  return (
    <AppBar position="fixed" sx={{ 
      backgroundColor: '#FFF', 
      color: '#000',
      boxShadow: '0px 3px 3px 0px #999',
      height: '55px',
      justifyContent: 'center'
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '55px !important' }}>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <Link href="/" sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="/images/logo.png" alt="logo" style={{ maxHeight: '35px', maxWidth: '100%' }} />
            </Link>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#000' }}>
              {getHeaderLink()}
            </Typography>
            <Button 
              variant="contained" 
              size="small" 
              href="https://chums.org/"
              sx={{ 
                backgroundColor: '#77cc00',
                '&:hover': { backgroundColor: '#55aa00' }
              }}
            >
              Go to ChuMS
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
