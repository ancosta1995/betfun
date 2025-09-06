const axios = require('axios');

// Use your JWT token here
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZmNGNhZmVmMDY4NGMzYTRjMzYxNWZhIn0sImlhdCI6MTcyNzUzNjczMCwiZXhwIjoxNzI3ODk2NzMwfQ.lr0Kqz4pQX6wZMjDqw4le_DNm2aXkAz3e6DAsaHuFCE';

// Make a request to the users list endpoint
axios.get('http://localhost:2053/api/external/v1/users/list', {
  headers: {
    'x-auth-token': token, // Include the token in the headers
  },
})
.then(response => {
  console.log('Users List:', response.data);  // Log the users list
})
.catch(error => {
  console.error('Failed to fetch users:', error.response ? error.response.data : error.message);  // Handle errors
});
