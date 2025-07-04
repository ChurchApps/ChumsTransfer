import React from "react"
import { AppBar, Toolbar, Box, Button, Typography, Link } from "@mui/material";
import { UserHelper } from "@churchapps/apphelper";

export const Header: React.FC = () => {

  const getHeaderLink = () => {
    if (!UserHelper.user) return <Link href="/login" sx={{ color: '#FFF', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Login</Link>
    else return UserHelper.user.firstName + " " + UserHelper.user.lastName;
  }

  return (
    <div style={{ backgroundColor: "var(--c1)", color: "#FFF" }}>
      <AppBar position="fixed" sx={{
        backgroundColor: 'var(--c1)',
        color: '#FFF',
        boxShadow: 'none',
        height: '64px'
      }}>
        <Toolbar sx={{
          pr: '24px',
          pl: '24px',
          backgroundColor: 'var(--c1)',
          minHeight: '64px !important',
          maxWidth: 'none',
          width: '100%'
        }}>
          <Box sx={{
            flexGrow: 0,
            display: 'flex',
            alignItems: 'center',
            mr: 6
          }}>
            <Link
              href="/"
              id="primaryNavButton"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#FFF',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'var(--c1d2)'
                }
              }}
            >
              <img
                src="/images/logo-icon.png"
                alt="CHUMS"
                style={{
                  height: '35px',
                  marginRight: '15px'
                }}
              />
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 600,
                  color: '#FFF',
                  lineHeight: 1,
                  textWrap: 'nowrap',
                  display: { xs: 'none', md: 'block' }
                }}
              >
                CHUMS
              </Typography>
            </Link>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#FFF' }}>
              {getHeaderLink()}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  )
}
