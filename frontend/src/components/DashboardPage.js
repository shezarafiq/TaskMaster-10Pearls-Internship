

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link as RouterLink } from 'react-router-dom';

import { FiPlus, FiLogOut, FiEdit, FiTrash2, FiUsers, FiUser } from 'react-icons/fi';
import { Dialog, DialogContent, DialogTitle, DialogActions, MenuItem, TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = {
  primary: '#a78bfa',
  gradient: '#7c3aed',
  bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
  surfaceGlass: 'rgba(23, 23, 23, 0.6)',
  surfaceSolid: '#2a2a2a',
  text: '#e2e8f0',
  textSecondary: '#94a3b8',
  error: '#f43f5e',
  warning: '#facc15',
  success: '#4ade80',
  border: 'rgba(255, 255, 255, 0.1)'
};

const muiDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: theme.primary },
    background: { paper: 'transparent' },
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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: theme.surfaceSolid,
          backgroundImage: 'none',
        },
      },
    },
  },
});

const DashboardWrapper = styled.div`
  display: flex; flex-direction: column; min-height: 100vh;
  background-image: ${theme.bgGradient}; color: ${theme.text};
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
`;
const Header = styled.header`
  padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;
  flex-shrink: 0; position: sticky; top: 0; z-index: 10;
  background: ${theme.surfaceGlass}; backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.border};
  @media (max-width: 768px) { flex-direction: column; gap: 1rem; padding: 1rem; }
`;
const HeaderTitle = styled.h1` font-size: 1.5rem; font-weight: 600; margin: 0; `;
const HeaderActions = styled.div` display: flex; gap: 1rem; align-items: center;`;
const StyledButton = styled.button`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.2rem; border-radius: 8px; border: 1px solid transparent;
  font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
  ${props => props.variant === 'primary' && `background-color: ${theme.primary}; color: white; &:hover { background-color: ${theme.gradient}; }`}
  ${props => props.variant === 'outline' && `background-color: transparent; color: ${props.color || theme.textSecondary}; border-color: ${props.color || theme.textSecondary}; &:hover { background-color: ${props.color ? props.color + '20' : theme.textSecondary + '20'}; color: white; border-color: ${props.color || 'white'}; }`}
`;
const BoardContainer = styled.main`
  flex-grow: 1; padding: 2rem; display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;
`;
const Column = styled.div`
  display: flex; flex-direction: column; gap: 1rem;
  background: ${theme.surfaceGlass}; backdrop-filter: blur(5px);
  border: 1px solid ${theme.border}; border-radius: 12px; padding: 1rem;
`;
const ColumnTitle = styled.h2`
  font-size: 1.2rem; font-weight: 500; padding: 0 0.5rem 0.75rem 0.5rem;
  margin: 0; border-bottom: 1px solid ${theme.border}; text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
`;
const CardWrapper = styled.div`
  background-color: ${theme.surfaceSolid}; border-radius: 8px; padding: 1rem;
  border: 1px solid transparent; transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  &:hover { transform: translateY(-3px); border-color: ${theme.primary}; box-shadow: 0 0 20px -5px ${theme.primary}; }
`;
const CardHeader = styled.div` display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; `;
const CardTitle = styled.h3` font-size: 1.1rem; font-weight: 600; margin: 0; color: ${theme.text}; `;
const CardDescription = styled.p` font-size: 0.9rem; color: ${theme.textSecondary}; min-height: 40px; line-height: 1.5; margin: 0; word-break: break-word;`;
const CardFooter = styled.div` display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; `;
const DueDate = styled.span` font-size: 0.8rem; color: ${theme.textSecondary}; `;
const CardActionsContainer = styled.div` display: flex; gap: 0.5rem; `;
const ActionButton = styled.button`
  background: none; border: none; color: ${theme.textSecondary};
  cursor: pointer; padding: 0.25rem; transition: color 0.2s ease;
  &:hover { color: ${props => props.color || theme.primary}; }
`;
const PriorityChip = styled.span`
  padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; color: #111;
  background-color: ${props => {
    switch (props.priority) {
      case 2: return theme.error;
      case 1: return theme.warning;
      default: return theme.success;
    }
  }};
`;
const OwnerInfo = styled.div`
  font-size: 0.8rem;
  color: ${theme.primary};
  margin-top: 0.75rem;
  border-top: 1px solid ${theme.border};
  padding-top: 0.75rem;
`;

// --- Reusable Task Card Component ---
const TaskCard = ({ task, onEdit, onDelete, isAdmin }) => {
    return (
    <CardWrapper>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <PriorityChip priority={task.priority}>
          {['Low', 'Medium', 'High'][task.priority]}
        </PriorityChip>
      </CardHeader>
      <CardDescription>{task.description}</CardDescription>
      {isAdmin && task.user && (
        <OwnerInfo>
          Owner: {task.user.userName}
        </OwnerInfo>
      )}
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
  const [tasks, setTasks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', priority: 0, status: 0, userId: '' });

  const getApi = useCallback(() => { const token = localStorage.getItem('token'); return axios.create({ baseURL: 'http://localhost:5209/api', headers: { 'Authorization': `Bearer ${token}` } }); }, []);
  const fetchTasks = useCallback(async () => { try { const api = getApi(); const response = await api.get('/todo'); setTasks(response.data); } catch (error) { console.error('Failed to fetch tasks:', error); if (error.response?.status === 401) { handleLogout(); } } }, [getApi]);
  const fetchAllUsers = useCallback(async () => { try { const api = getApi(); const response = await api.get('/admin/users'); setAllUsers(response.data); } catch (error) { console.error("Could not fetch users, you might not be an admin."); } }, [getApi]);
  const handleLogout = () => { localStorage.removeItem('token'); window.location.href = '/login'; };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const userIsAdmin = roles && (Array.isArray(roles) ? roles.includes('Admin') : roles === 'Admin');
        setIsAdmin(userIsAdmin);
        if (userIsAdmin) { fetchAllUsers(); }
      } catch (e) { console.error("Invalid token:", e); handleLogout(); }
    }
    fetchTasks();
  }, [fetchTasks, fetchAllUsers]);

  const handleInputChange = (e) => { const { name, value, type } = e.target; const finalValue = type === 'number' ? parseInt(value, 10) : value; setFormData(prevData => ({ ...prevData, [name]: finalValue })); };
  const handleClose = () => { setOpen(false); setEditingTask(null); };
  const handleCreateOpen = () => { setEditingTask(null); setFormData({ title: '', description: '', dueDate: '', priority: 0, status: 0, userId: '' }); setOpen(true); };
  const handleEditOpen = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      priority: task.priority,
      status: task.status,
      userId: task.userId
    });
    setOpen(true);
  };
  const handleDelete = async (taskId) => { if (window.confirm('Are you sure you want to delete this task?')) { try { const api = getApi(); await api.delete(`/todo/${taskId}`); fetchTasks(); } catch (error) { console.error('Failed to delete task:', error); alert('Could not delete task.'); } } };
  const handleSubmit = async () => {
    if (!formData.title || !formData.dueDate) { alert('Title and Due Date are required.'); return; }
    try {
      const api = getApi();
      if (editingTask) {
        // If an admin is editing AND they've changed the user
        if (isAdmin && formData.userId && editingTask.userId !== formData.userId) {
          await api.put(`/admin/assign-task/${editingTask.id}`, { newUserId: formData.userId });
        }
        await api.put(`/todo/${editingTask.id}`, formData);
      } else {
        await api.post('/todo', formData);
      }
      handleClose();
      fetchTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Could not save task.');
    }
  };

  return (
    <DashboardWrapper>
      <Header>
        <HeaderTitle>TaskMaster Dashboard</HeaderTitle>
        <HeaderActions>
          {isAdmin && (
            <StyledButton as={RouterLink} to="/admin/users" variant="outline">
              <FiUsers /> Admin Panel
            </StyledButton>
          )}
          <StyledButton variant="primary" onClick={handleCreateOpen}>
            <FiPlus /> Create Task
          </StyledButton>
          <StyledButton variant="outline" color={theme.error} onClick={handleLogout}>
            <FiLogOut /> Logout
          </StyledButton>

          <StyledButton as={RouterLink} to="/profile" variant="outline">
        <FiUser /> Profile
    </StyledButton>
        </HeaderActions>
      </Header>

      <BoardContainer>
        <Column>
          <ColumnTitle>Pending ({tasks.filter(t => t.status === 0).length})</ColumnTitle>
          {tasks.filter(t => t.status === 0).map(task => ( <TaskCard key={task.id} task={task} onEdit={handleEditOpen} onDelete={handleDelete} isAdmin={isAdmin} /> ))}
        </Column>
        <Column>
          <ColumnTitle>In Progress ({tasks.filter(t => t.status === 1).length})</ColumnTitle>
          {tasks.filter(t => t.status === 1).map(task => ( <TaskCard key={task.id} task={task} onEdit={handleEditOpen} onDelete={handleDelete} isAdmin={isAdmin} /> ))}
        </Column>
        <Column>
          <ColumnTitle>Completed ({tasks.filter(t => t.status === 2).length})</ColumnTitle>
          {tasks.filter(t => t.status === 2).map(task => ( <TaskCard key={task.id} task={task} onEdit={handleEditOpen} onDelete={handleDelete} isAdmin={isAdmin} /> ))}
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
            {isAdmin && editingTask && (
                <TextField select margin="dense" name="userId" label="Assign to User" fullWidth variant="outlined" value={formData.userId} onChange={handleInputChange}>
                    {allUsers.map(user => (
                        <MenuItem key={user.id} value={user.id}>
                            {user.userName} ({user.email})
                        </MenuItem>
                    ))}
                </TextField>
            )}
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