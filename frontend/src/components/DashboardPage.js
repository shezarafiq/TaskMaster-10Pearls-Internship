// File: frontend/src/components/DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { 
  Box, Typography, Button, Container, Card, CardContent, CardActions,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField 
} from '@mui/material';
import axios from 'axios';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false); 
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  // --- Reusable API instance creator ---
  const getApi = () => {
    const token = localStorage.getItem('token');
    return axios.create({
      baseURL: 'http://localhost:5209/api',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };
  
  // 2. Define fetchTasks with useCallback so it's stable
  const fetchTasks = useCallback(async () => {
    try {
      const api = getApi();
      const response = await api.get('/todo');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }, []); // The empty array means this function itself never needs to change
  
  // 3. useEffect now calls the memoized fetchTasks
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // 4. Add fetchTasks to the dependency array

  // --- Modal and Form Handlers ---
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.dueDate) {
      alert('Title and Due Date are required.');
      return;
    }
    try {
      const api = getApi();
      await api.post('/todo', {
        ...newTask,
        priority: 0, 
        status: 0,   
      });
      handleClose(); 
      fetchTasks();  // 5. This now works perfectly
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // ... The rest of the JSX (return statement) is exactly the same ...
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Dashboard
        </Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Task List */}
      <Typography variant="h6" gutterBottom>My Tasks</Typography>
      {tasks.length > 0 ? (
        tasks.map(task => (
          <Card key={task.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">{task.title}</Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">{task.description}</Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Priority: {task.priority} | Status: {task.status}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Edit</Button>
              <Button size="small" color="warning">Delete</Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography sx={{ mt: 2 }}>You have no tasks. Create one!</Typography>
      )}

      {/* Create Task Button */}
      <Button variant="contained" sx={{ mt: 4 }} onClick={handleClickOpen}>
        + Create New Task
      </Button>

      {/* Create Task Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Task</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="title" label="Task Title" type="text" fullWidth variant="standard" value={newTask.title} onChange={handleInputChange} />
          <TextField margin="dense" name="description" label="Description" type="text" fullWidth multiline rows={4} variant="standard" value={newTask.description} onChange={handleInputChange} />
          <TextField margin="dense" name="dueDate" label="Due Date" type="date" fullWidth variant="standard" InputLabelProps={{ shrink: true }} value={newTask.dueDate} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateTask}>Create</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default DashboardPage;