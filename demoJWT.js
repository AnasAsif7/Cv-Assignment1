const axios = require('axios');

// Signup Function
async function signup() {
  try {
    const response = await axios.post('http://localhost:3000/api/signup', {
      username: 'testuser',
      email: 'testuser3@example.com',
      password: 'password123',
      gender: 'Male',
      phone: '03001234567',
      isAdmin: false 
    });
    console.log('Signup successful:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error during signup:', error.response.data);
    } else {
      console.error('Error during signup:', error.message);
    }
  }
}

// Login Function
async function login() {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      email: 'testuser3@example.com',
      password: 'password123'
    });
    const { token } = response.data;
    console.log('Login successful, JWT token:', token);
    return token;
  } catch (error) {
    if (error.response) {
      console.error('Error during login:', error.response.data);
    } else {
      console.error('Error during login:', error.message);
    }
  }
}

// Access Protected Route
async function accessProtectedRoute(token) {
  try {
    const response = await axios.get('http://localhost:3000/api/protected-route', {
      headers: {
        'x-auth-token': token
      }
    });
    console.log('Protected route access successful:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error accessing protected route:', error.response.data);
    } else {
      console.error('Error accessing protected route:', error.message);
    }
  }
}

// Demonstration
async function demonstrate() {
  await signup();
  const token = await login();
  if (token) {
    await accessProtectedRoute(token);
  }
}

demonstrate();
