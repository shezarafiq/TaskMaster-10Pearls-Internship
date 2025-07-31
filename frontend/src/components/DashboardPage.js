// // File: frontend/src/components/DashboardPage.js

// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   Box, Typography, Button, Container, Card, CardContent, CardActions,
// //   Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, CssBaseline ,Grid
// // } from '@mui/material';
// // import axios from 'axios';

// // File: frontend/src/components/DashboardPage.js

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box, Typography, Button, Card, CardContent, CardActions,
//   Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem,
//   CssBaseline, Grid, Chip // Added Grid and Chip, removed unused Container
// } from '@mui/material';
// import axios from 'axios';

// // Added imports for the icons
// import AddIcon from '@mui/icons-material/Add';
// import LogoutIcon from '@mui/icons-material/Logout';
// // --- Main Dashboard Component ---
// const DashboardPage = () => {
//   // --- STATE MANAGEMENT ---
//   const [tasks, setTasks] = useState([]);
//   const [open, setOpen] = useState(false); // Controls the modal's visibility
//   const [editingTask, setEditingTask] = useState(null); // Null for 'Create', task object for 'Edit'
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     dueDate: '',
//     priority: 0, // 0: Low, 1: Medium, 2: High
//     status: 0,   // 0: Pending, 1: InProgress, 2: Completed
//   });

//   // --- API HELPERS ---
//   const getApi = useCallback(() => {
//     const token = localStorage.getItem('token');
//     return axios.create({
//       baseURL: 'http://localhost:5209/api', // IMPORTANT: Use your backend's port
//       headers: { 'Authorization': `Bearer ${token}` }
//     });
//   }, []);

//   const fetchTasks = useCallback(async () => {
//     try {
//       const api = getApi();
//       const response = await api.get('/todo');
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Failed to fetch tasks:', error);
//     }
//   }, [getApi]);

//   // --- LIFECYCLE HOOKS ---
//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   // --- EVENT HANDLERS ---
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/login';
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;
//     const finalValue = type === 'number' ? parseInt(value, 10) : value;
//     setFormData(prevData => ({ ...prevData, [name]: finalValue }));
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setEditingTask(null); // Always reset editing state on close
//   };

//   // --- CRUD HANDLERS ---
//   const handleCreateOpen = () => {
//     setEditingTask(null);
//     setFormData({ title: '', description: '', dueDate: '', priority: 0, status: 0 });
//     setOpen(true);
//   };

//   const handleEditOpen = (task) => {
//     setEditingTask(task);
//     setFormData({
//       title: task.title,
//       description: task.description,
//       dueDate: new Date(task.dueDate).toISOString().split('T')[0],
//       priority: task.priority,
//       status: task.status,
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (taskId) => {
//     if (window.confirm('Are you sure you want to delete this task?')) {
//       try {
//         const api = getApi();
//         await api.delete(`/todo/${taskId}`);
//         fetchTasks(); // Refresh the list
//       } catch (error) {
//         console.error('Failed to delete task:', error);
//         alert('Could not delete task.');
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.title || !formData.dueDate) {
//       alert('Title and Due Date are required.');
//       return;
//     }
//     try {
//       const api = getApi();
//       if (editingTask) {
//         // Update existing task
//         await api.put(`/todo/${editingTask.id}`, formData);
//       } else {
//         // Create new task
//         await api.post('/todo', formData);
//       }
//       handleClose();
//       fetchTasks(); // Refresh the list
//     } catch (error) {
//       console.error('Failed to save task:', error);
//       alert('Could not save task.');
//     }
//   };

//   // --- A NEW RENDER FUNCTION ---
//   return (
//     <>
//       <CssBaseline />
//       <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.100' }}>
//         {/* Header */}
//         <Box
//           component="header"
//           sx={{
//             p: 2,
//             bgcolor: 'background.paper',
//             boxShadow: 1,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <Typography variant="h5" component="h1" fontWeight="bold">
//             TaskMaster Dashboard
//           </Typography>
//           <Box>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={handleCreateOpen}
//               sx={{ mr: 2 }}
//             >
//               Create Task
//             </Button>
//             <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
//               Logout
//             </Button>
//           </Box>
//         </Box>

//         {/* Kanban Board Container */}
//         <Box sx={{ flexGrow: 1, p: 3, overflowX: 'auto' }}>
//           <Grid container spacing={3}>
//             {/* Column 1: Pending */}
//             <Grid item xs={12} md={4}>
//               <Box sx={{ p: 2, bgcolor: 'grey.200', borderRadius: 2 }}>
//                 <Typography variant="h6" gutterBottom>Pending</Typography>
//                 {tasks.filter(t => t.status === 0).map(task => (
//                   <TaskCard key={task.id} task={task} onEdit={handleEditOpen} onDelete={handleDelete}  />
//                 ))}
//               </Box>
//             </Grid>

//             {/* Column 2: In Progress */}
//             <Grid item xs={12} md={4}>
//               <Box sx={{ p: 2, bgcolor: 'grey.200', borderRadius: 2 }}>
//                 <Typography variant="h6" gutterBottom>In Progress</Typography>
//                 {tasks.filter(t => t.status === 1).map(task => (
//                   <TaskCard key={task.id} task={task} onEdit={handleEditOpen} onDelete={handleDelete}  />
//                 ))}
//               </Box>
//             </Grid>

//             {/* Column 3: Completed */}
//             <Grid item xs={12} md={4}>
//               <Box sx={{ p: 2, bgcolor: 'grey.200', borderRadius: 2 }}>
//                 <Typography variant="h6" gutterBottom>Completed</Typography>
//                 {tasks.filter(t => t.status === 2).map(task => (
//                   <TaskCard key={task.id} task={task} onEdit={handleEditOpen} onDelete={handleDelete}  />
//                 ))}
//               </Box>
//             </Grid>
//           </Grid>
//         </Box>

//         {/* Create/Edit Dialog (same as before) */}
//         <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//           <DialogTitle>{editingTask ? 'Edit Task' : 'Create a New Task'}</DialogTitle>
//           <DialogContent>
//             {/* ... same form fields as before ... */}
//             <TextField autoFocus margin="dense" name="title" label="Task Title" type="text" fullWidth variant="outlined" value={formData.title} onChange={handleInputChange}/>
//             <TextField margin="dense" name="description" label="Description" type="text" fullWidth multiline rows={4} variant="outlined" value={formData.description} onChange={handleInputChange}/>
//             <TextField margin="dense" name="dueDate" label="Due Date" type="date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} value={formData.dueDate} onChange={handleInputChange}/>
//             <TextField select margin="dense" name="priority" label="Priority" fullWidth variant="outlined" value={formData.priority} onChange={handleInputChange}>
//               <MenuItem value={0}>Low</MenuItem>
//               <MenuItem value={1}>Medium</MenuItem>
//               <MenuItem value={2}>High</MenuItem>
//             </TextField>
//             <TextField select margin="dense" name="status" label="Status" fullWidth variant="outlined" value={formData.status} onChange={handleInputChange}>
//               <MenuItem value={0}>Pending</MenuItem>
//               <MenuItem value={1}>In Progress</MenuItem>
//               <MenuItem value={2}>Completed</MenuItem>
//             </TextField>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button variant="contained" onClick={handleSubmit}>{editingTask ? 'Save Changes' : 'Create'}</Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </>
//   );
// };


// // --- A NEW Reusable Task Card Component ---
// const TaskCard = ({ task, onEdit, onDelete }) => {
//   // The helper function now lives inside the component that uses it.
//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 2: return 'error';   // High
//       case 1: return 'warning'; // Medium
//       default: return 'success'; // Low
//     }
//   };

//   return (
//     <Card sx={{ mb: 2, boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//           <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'medium' }}>
//             {task.title}
//           </Typography>
//           <Chip 
//             label={['Low', 'Medium', 'High'][task.priority]}
//             color={getPriorityColor(task.priority)} // It can call the function directly
//             size="small"
//           />
//         </Box>
//         <Typography variant="body2" color="text.secondary" sx={{ minHeight: '40px' }}>
//           {task.description}
//         </Typography>
//       </CardContent>
//       <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
//          <Typography variant="caption" color="text.secondary">
//           Due: {new Date(task.dueDate).toLocaleDateString()}
//         </Typography>
//         <Box>
//           <Button size="small" onClick={() => onEdit(task)}>Edit</Button>
//           <Button size="small" color="error" onClick={() => onDelete(task.id)}>Delete</Button>
//         </Box>
//       </CardActions>
//     </Card>
//   );
// };


// export default DashboardPage;

  //==== working old dashboard
  // --- RENDER ---
//   return (
//     <>
//       <CssBaseline />
//       <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//         {/* Header */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//           <Typography variant="h4" component="h1" gutterBottom>
//             My Task Dashboard
//           </Typography>
//           <Button variant="contained" color="error" onClick={handleLogout}>
//             Logout
//           </Button>
//         </Box>

//         {/* Create Task Button */}
//         <Button variant="contained" sx={{ mb: 4 }} onClick={handleCreateOpen}>
//           + Create New Task
//         </Button>

//         {/* Task List */}
//         <Grid container spacing={3}>
//           {tasks.length > 0 ? (
//             tasks.map(task => (
//               <Grid item xs={12} sm={6} md={4} key={task.id}>
//                 <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//                   <CardContent sx={{ flexGrow: 1 }}>
//                     <Typography gutterBottom variant="h5" component="h2">
//                       {task.title}
//                     </Typography>
//                     <Typography color="text.secondary">
//                       Due: {new Date(task.dueDate).toLocaleDateString()}
//                     </Typography>
//                     <Typography variant="body2" sx={{ my: 2 }}>
//                       {task.description}
//                     </Typography>
//                     <Typography variant="caption" display="block">
//                       Priority: {['Low', 'Medium', 'High'][task.priority]} | Status: {['Pending', 'In Progress', 'Completed'][task.status]}
//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button size="small" onClick={() => handleEditOpen(task)}>Edit</Button>
//                     <Button size="small" color="error" onClick={() => handleDelete(task.id)}>Delete</Button>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))
//           ) : (
//             <Grid item xs={12}>
//               <Typography sx={{ mt: 2, textAlign: 'center' }}>
//                 You have no tasks. Click "Create New Task" to get started!
//               </Typography>
//             </Grid>
//           )}
//         </Grid>

//         {/* Create/Edit Dialog */}
//         <Dialog open={open} onClose={handleClose}>
//           <DialogTitle>{editingTask ? 'Edit Task' : 'Create a New Task'}</DialogTitle>
//           <DialogContent>
//             <TextField autoFocus margin="dense" name="title" label="Task Title" type="text" fullWidth variant="standard" value={formData.title} onChange={handleInputChange} />
//             <TextField margin="dense" name="description" label="Description" type="text" fullWidth multiline rows={4} variant="standard" value={formData.description} onChange={handleInputChange} />
//             <TextField margin="dense" name="dueDate" label="Due Date" type="date" fullWidth variant="standard" InputLabelProps={{ shrink: true }} value={formData.dueDate} onChange={handleInputChange} />
//             <TextField select margin="dense" name="priority" label="Priority" fullWidth variant="standard" value={formData.priority} onChange={handleInputChange}>
//               <MenuItem value={0}>Low</MenuItem>
//               <MenuItem value={1}>Medium</MenuItem>
//               <MenuItem value={2}>High</MenuItem>
//             </TextField>
//             <TextField select margin="dense" name="status" label="Status" fullWidth variant="standard" value={formData.status} onChange={handleInputChange}>
//               <MenuItem value={0}>Pending</MenuItem>
//               <MenuItem value={1}>In Progress</MenuItem>
//               <MenuItem value={2}>Completed</MenuItem>
//             </TextField>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button onClick={handleSubmit}>{editingTask ? 'Save Changes' : 'Create'}</Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </>
//   );
// };

// export default DashboardPage;




import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Icons
import { FiPlus, FiLogOut, FiEdit, FiTrash2 } from 'react-icons/fi';

// MUI Components for the Dialog
import { Dialog, DialogContent, DialogTitle, DialogActions, MenuItem, TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


// --- THEME & STYLING ---

const theme = {
  // Electric Amethyst Palette
  primary: '#a78bfa',
  gradient: '#7c3aed',
  // Creative Background
  bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
  // Glassmorphism Surface
  surfaceGlass: 'rgba(23, 23, 23, 0.6)',
  surfaceSolid: '#2a2a2a', // For solid elements like cards
  text: '#e2e8f0', // Brighter text for better contrast
  textSecondary: '#94a3b8',
  error: '#f43f5e',
  warning: '#facc15',
  success: '#4ade80',
  border: 'rgba(255, 255, 255, 0.1)'
};

// --- A DEDICATED THEME FOR THE GLASSMORPHIC MUI DIALOG ---
const muiDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: theme.primary },
    background: { paper: 'transparent' }, // Make paper transparent to see our styles
    text: { primary: theme.text, secondary: theme.textSecondary },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.surfaceGlass,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          borderRadius: '12px',
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.textSecondary },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.primary },
        },
      },
    },
    MuiPaper: { // For the dropdown menu
      styleOverrides: {
        root: {
          backgroundColor: theme.surfaceSolid,
          backgroundImage: 'none',
        },
      },
    },
  },
});

// --- NEW STYLED COMPONENTS ---

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: ${theme.bgGradient};
  color: ${theme.text};
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
`;

const Header = styled.header`
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;

  /* Glassmorphism Effect */
  background: ${theme.surfaceGlass};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'primary' && `
    background-color: ${theme.primary};
    color: white;
    &:hover { background-color: ${theme.gradient}; }
  `}

  ${props => props.variant === 'outline' && `
    background-color: transparent;
    color: ${props.color || theme.textSecondary};
    border-color: ${props.color || theme.textSecondary};
    &:hover {
      background-color: ${props.color ? props.color + '20' : theme.textSecondary + '20'};
      color: white;
      border-color: ${props.color || 'white'};
    }
  `}
`;

const BoardContainer = styled.main`
  flex-grow: 1;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  /* Glassmorphism Effect for Columns */
  background: ${theme.surfaceGlass};
  backdrop-filter: blur(5px);
  border: 1px solid ${theme.border};
  border-radius: 12px;
  padding: 1rem;
`;

const ColumnTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0 0.5rem 0.75rem 0.5rem;
  margin: 0;
  border-bottom: 1px solid ${theme.border};
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
`;

const CardWrapper = styled.div`
  background-color: ${theme.surfaceSolid};
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);

  &:hover {
    transform: translateY(-3px);
    border-color: ${theme.primary};
    box-shadow: 0 0 20px -5px ${theme.primary};
  }
`;

// ... other styled components like CardHeader, CardTitle etc. remain conceptually the same but use the new theme variables ...
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: ${theme.text};
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: ${theme.textSecondary};
  min-height: 40px;
  line-height: 1.5;
  margin: 0;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const DueDate = styled.span`
  font-size: 0.8rem;
  color: ${theme.textSecondary};
`;

const CardActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${theme.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.color || theme.primary};
  }
`;

const PriorityChip = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #111;
  background-color: ${props => {
    switch (props.priority) {
      case 2: return theme.error;
      case 1: return theme.warning;
      default: return theme.success;
    }
  }};
`;

// --- Reusable Task Card Component (Unchanged Logic) ---
const TaskCard = ({ task, onEdit, onDelete }) => {
    return (
    <CardWrapper>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <PriorityChip priority={task.priority}>
          {['Low', 'Medium', 'High'][task.priority]}
        </PriorityChip>
      </CardHeader>
      <CardDescription>{task.description}</CardDescription>
      <CardFooter>
        <DueDate>Due: {new Date(task.dueDate).toLocaleDateString()}</DueDate>
        <CardActionsContainer>
          <ActionButton onClick={() => onEdit(task)} title="Edit Task">
            <FiEdit size={16} />
          </ActionButton>
          <ActionButton color={theme.error} onClick={() => onDelete(task.id)} title="Delete Task">
            <FiTrash2 size={16} />
          </ActionButton>
        </CardActionsContainer>
      </CardFooter>
    </CardWrapper>
  );
};

// --- Main Dashboard Component ---
const DashboardPage = () => {
  // --- STATE & FUNCTIONALITY (100% UNCHANGED) ---
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', priority: 0, status: 0 });
  const getApi = useCallback(() => { const token = localStorage.getItem('token'); return axios.create({ baseURL: 'http://localhost:5209/api', headers: { 'Authorization': `Bearer ${token}` } }); }, []);
  const fetchTasks = useCallback(async () => { try { const api = getApi(); const response = await api.get('/todo'); setTasks(response.data); } catch (error) { console.error('Failed to fetch tasks:', error); if (error.response?.status === 401) { handleLogout(); } } }, [getApi]);
  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  const handleLogout = () => { localStorage.removeItem('token'); window.location.href = '/login'; };
  const handleInputChange = (e) => { const { name, value, type } = e.target; const finalValue = type === 'number' ? parseInt(value, 10) : value; setFormData(prevData => ({ ...prevData, [name]: finalValue })); };
  const handleClose = () => { setOpen(false); setEditingTask(null); };
  const handleCreateOpen = () => { setEditingTask(null); setFormData({ title: '', description: '', dueDate: '', priority: 0, status: 0 }); setOpen(true); };
  const handleEditOpen = (task) => { setEditingTask(task); setFormData({ title: task.title, description: task.description, dueDate: new Date(task.dueDate).toISOString().split('T')[0], priority: task.priority, status: task.status, }); setOpen(true); };
  const handleDelete = async (taskId) => { if (window.confirm('Are you sure you want to delete this task?')) { try { const api = getApi(); await api.delete(`/todo/${taskId}`); fetchTasks(); } catch (error) { console.error('Failed to delete task:', error); alert('Could not delete task.'); } } };
  const handleSubmit = async () => { if (!formData.title || !formData.dueDate) { alert('Title and Due Date are required.'); return; } try { const api = getApi(); if (editingTask) { await api.put(`/todo/${editingTask.id}`, formData); } else { await api.post('/todo', formData); } handleClose(); fetchTasks(); } catch (error) { console.error('Failed to save task:', error); alert('Could not save task.'); } };

  // --- RENDER FUNCTION WITH NEW CREATIVE COMPONENTS ---
  return (
    <DashboardWrapper>
      <Header>
        <HeaderTitle>TaskMaster Dashboard</HeaderTitle>
        <HeaderActions>
          <StyledButton variant="primary" onClick={handleCreateOpen}>
            <FiPlus /> Create Task
          </StyledButton>
          <StyledButton variant="outline" color={theme.error} onClick={handleLogout}>
            <FiLogOut /> Logout
          </StyledButton>
        </HeaderActions>
      </Header>

      <BoardContainer>
        <Column>
          <ColumnTitle>Pending</ColumnTitle>
          {tasks.filter(t => t.status === 0).map(task => ( <TaskCard key={task.id} task={task} onEdit={handleEditOpen} onDelete={handleDelete}  /> ))}
        </Column>
        <Column>
          <ColumnTitle>In Progress</ColumnTitle>
          {tasks.filter(t => t.status === 1).map(task => ( <TaskCard key={task.id} task={task} onEdit={handleEditOpen} onDelete={handleDelete}  /> ))}
        </Column>
        <Column>
          <ColumnTitle>Completed</ColumnTitle>
          {tasks.filter(t => t.status === 2).map(task => ( <TaskCard key={task.id} task={task} onEdit={handleEditOpen} onDelete={handleDelete}  /> ))}
        </Column>
      </BoardContainer>

      <ThemeProvider theme={muiDarkTheme}>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle fontWeight="bold">{editingTask ? 'Edit Task' : 'Create a New Task'}</DialogTitle>
          <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '1rem' }}>
            <TextField autoFocus name="title" label="Task Title" fullWidth variant="outlined" value={formData.title} onChange={handleInputChange}/>
            <TextField name="description" label="Description" fullWidth multiline rows={4} variant="outlined" value={formData.description} onChange={handleInputChange}/>
            <TextField name="dueDate" label="Due Date" type="date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} value={formData.dueDate} onChange={handleInputChange}/>
            <TextField select name="priority" label="Priority" fullWidth variant="outlined" value={formData.priority} onChange={handleInputChange}>
              <MenuItem value={0}>Low</MenuItem>
              <MenuItem value={1}>Medium</MenuItem>
              <MenuItem value={2}>High</MenuItem>
            </TextField>
            <TextField select name="status" label="Status" fullWidth variant="outlined" value={formData.status} onChange={handleInputChange}>
              <MenuItem value={0}>Pending</MenuItem>
              <MenuItem value={1}>In Progress</MenuItem>
              <MenuItem value={2}>Completed</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions style={{padding: '1rem 1.5rem'}}>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>{editingTask ? 'Save Changes' : 'Create'}</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </DashboardWrapper>
  );
};

export default DashboardPage;