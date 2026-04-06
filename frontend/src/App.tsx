import { Box } from '@mui/material'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/login" element={<div>Login</div>} />
      </Routes>
    </Box>
  )
}

export default App