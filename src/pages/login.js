import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';
/// to be changed later
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  ////
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
  try {


    const res = await axios.post(`${REACT_APP_API_BASE_URL}/auth`, { username, password });
    console.log('Login response:', res.data);
    const user = res.data.user;
    localStorage.setItem('user', JSON.stringify(user));
    onLogin(user);
  } catch (err) {
    console.error(err);
    setError('Invalid credentials');
  }
};


  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField fullWidth label="Username" margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
      <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>Login</Button>
    </Box>
  );
};

export default LoginPage;
