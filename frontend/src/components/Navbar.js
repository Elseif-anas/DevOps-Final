import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Navbar = () => {
  return (
    <AppBar position="static" elevation={3}>
      <Toolbar>
        <SchoolIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Student Management System
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/students"
            startIcon={<PeopleIcon />}
          >
            Students
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/add-student"
            startIcon={<PersonAddIcon />}
          >
            Add Student
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
