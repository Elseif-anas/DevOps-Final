import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    fetchStudentCount();
  }, []);

  const fetchStudentCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudentCount(response.data.length);
    } catch (error) {
      console.error('Error fetching student count:', error);
    }
  };

  const statsCards = [
    {
      title: 'Total Students',
      value: studentCount,
      icon: <PeopleIcon sx={{ fontSize: 60 }} />,
      color: '#667eea',
    },
    {
      title: 'Active Courses',
      value: '12',
      icon: <SchoolIcon sx={{ fontSize: 60 }} />,
      color: '#764ba2',
    },
    {
      title: 'Departments',
      value: '5',
      icon: <SchoolIcon sx={{ fontSize: 60 }} />,
      color: '#f093fb',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
          p: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to Student Management System
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          Manage your students efficiently and effectively
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PeopleIcon />}
            onClick={() => navigate('/students')}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              '&:hover': { bgcolor: '#f5f5f5' },
              px: 4,
              py: 1.5,
            }}
          >
            View All Students
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/add-student')}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              px: 4,
              py: 1.5,
            }}
          >
            Add New Student
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={4}
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)`,
                color: 'white',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                {card.icon}
                <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                  {card.value}
                </Typography>
                <Typography variant="h6">{card.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
          Features
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            'Create and manage student records',
            'Update student information',
            'Delete student records',
            'View comprehensive student list',
            'Search and filter students',
            'Export student data',
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={2} sx={{ p: 2 }}>
                <Typography variant="body1">{feature}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
