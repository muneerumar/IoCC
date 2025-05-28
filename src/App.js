import React, { useState, useEffect } from 'react';
import { CssBaseline, Box, Typography, Button } from '@mui/material';
import CourseManager from './pages/CourseManager';
import LoginPage from './pages/login';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return (
      <>
        <CssBaseline />
        <LoginPage onLogin={setUser} />
      </>
    );
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{ height: '100vh', m: 1, p: 1, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 2 }}>
          <Typography variant="h4" gutterBottom>
            Course Descriptions
          </Typography>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout ({user.username})
          </Button>
        </Box>
        <CourseManager user={user} />
      </Box>
    </>
  );
}

export default App;
