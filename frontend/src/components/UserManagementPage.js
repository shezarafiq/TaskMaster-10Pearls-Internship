

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 


import { FiUsers, FiArrowLeft, FiShield, FiUserCheck, FiUserX, FiBriefcase } from 'react-icons/fi';

import { Dialog, DialogContent, DialogTitle, DialogActions, MenuItem, TextField, Button as MuiButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = {
  primary: '#a78bfa',
  gradient: '#7c3aed',
  bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
  surfaceGlass: 'rgba(23, 23, 23, 0.6)',
  surfaceSolid: '#1f2937',
  text: '#e2e8f0',
  textSecondary: '#94a3b8',
  error: '#f43f5e',
  success: '#4ade80',
  border: 'rgba(255, 255, 255, 0.1)',
};

const muiDarkTheme = createTheme({
  palette: { mode: 'dark', primary: { main: theme.primary }, background: { paper: 'transparent' }, text: { primary: theme.text, secondary: theme.textSecondary },},
  components: {
    MuiDialog: { styleOverrides: { paper: { backgroundColor: theme.surfaceGlass, backdropFilter: 'blur(12px)', border: `1px solid ${theme.border}`, boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', borderRadius: '12px', backgroundImage: 'none',},},},
    MuiOutlinedInput: { styleOverrides: { root: { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.textSecondary }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.primary },},},},
    MuiPaper: { styleOverrides: { root: { backgroundColor: theme.surfaceSolid, backgroundImage: 'none',},},},
  },
});

const PageWrapper = styled.div`
  min-height: 100vh;
  background-image: ${theme.bgGradient}; color: ${theme.text};
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
`;
const Header = styled.header`
  padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;
  position: sticky; top: 0; z-index: 10;
  background: ${theme.surfaceGlass}; backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.border};
`;
const HeaderTitle = styled.h1`
  font-size: 1.5rem; font-weight: 600; margin: 0;
  display: flex; align-items: center; gap: 0.75rem;
`;
const StyledButton = styled.button`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.2rem; border-radius: 8px; border: 1px solid transparent;
  font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
  background-color: transparent; color: ${props => props.color || theme.textSecondary};
  border-color: ${props => props.color || theme.textSecondary};
  &:hover { background-color: ${props => (props.color || theme.textSecondary) + '20'}; color: white; border-color: ${props => props.color || 'white'}; }
  &:disabled { cursor: not-allowed; opacity: 0.5; }
`;
const ContentContainer = styled.main` padding: 2rem; `;
const UserGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;
`;
const UserCard = styled.div`
  background-color: ${theme.surfaceSolid}; border-radius: 12px; padding: 1.5rem;
  display: flex; flex-direction: column; gap: 1rem;
  border: 1px solid ${theme.border}; box-shadow: 0 4px 6px rgba(0,0,0,0.2);
`;
const UserInfo = styled.div` flex-grow: 1; `;
const UserName = styled.h2` margin: 0; font-size: 1.2rem; color: ${theme.text}; `;
const UserEmail = styled.p` margin: 0.25rem 0 0 0; font-size: 0.9rem; color: ${theme.textSecondary}; `;
const RolesContainer = styled.div` display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem; `;
const RoleChip = styled.span`
  padding: 0.25rem 0.75rem; border-radius: 16px; font-size: 0.8rem; font-weight: 500;
  color: ${props => (props.isAdmin ? 'white' : theme.text)};
  background-color: ${props => (props.isAdmin ? theme.primary : 'rgba(255,255,255,0.1)')};
  border: 1px solid ${props => (props.isAdmin ? theme.gradient : theme.border)};
`;
const UserActions = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid ${theme.border}; padding-top: 1rem;
`;
const StatusToggle = styled.div`
    display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;
    color: ${props => props.isActive ? theme.success : theme.error};
`;

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roleName, setRoleName] = useState('User');
    const [currentAdminId, setCurrentAdminId] = useState(null);

    const getApi = useCallback(() => { const token = localStorage.getItem('token'); return axios.create({ baseURL: 'http://localhost:5209/api', headers: { 'Authorization': `Bearer ${token}` } }); }, []);
    const fetchUsers = useCallback(async () => { try { const api = getApi(); const response = await api.get('/admin/users'); setUsers(response.data); } catch (error) { console.error('Failed to fetch users:', error); alert('You do not have permission to view this page.'); } }, [getApi]);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setCurrentAdminId(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/nameid']);
            } catch (e) { console.error("Invalid token:", e); }
        }
        fetchUsers();
    }, [fetchUsers]);

    // const handleStatusChange = async (userId, isActive) => { try { const api = getApi(); await api.put(`/admin/set-status/${userId}`, { isActive: isActive }); fetchUsers(); } catch (error) { console.error('Failed to update user status:', error); alert('Failed to update user status.'); } };
    const handleOpenRoleModal = (user) => { setSelectedUser(user); setRoleModalOpen(true); };
    const handleCloseRoleModal = () => { setRoleModalOpen(false); setSelectedUser(null); setRoleName('User'); };
    const handleAddRole = async () => { if (!selectedUser || !roleName) return; try { const api = getApi(); await api.post('/admin/add-role', { userId: selectedUser.id, roleName: roleName }); fetchUsers(); handleCloseRoleModal(); } catch (error) { console.error('Failed to add role:', error); alert(`Failed to add role: ${error.response?.data?.title || 'Check console'}`); } };
    // const handleRemoveRole = async () => { if (!selectedUser || !roleName) return; if (window.confirm(`Are you sure you want to remove the "${roleName}" role from ${selectedUser.userName}?`)) { try { const api = getApi(); await api.post('/admin/remove-role', { userId: selectedUser.id, roleName: roleName }); fetchUsers(); handleCloseRoleModal(); } catch (error) { console.error('Failed to remove role:', error); alert(`Failed to remove role: ${error.response?.data?.title || 'Check console'}`); } } };

    const handleStatusChange = async (userId, newIsActiveStatus) => {
    try {
        const api = getApi();
        await api.put(`/admin/set-status/${userId}`, { isActive: newIsActiveStatus });
        fetchUsers();
    } catch (error) {
        console.error('Failed to update user status:', error);
        alert('Failed to update user status.');
    }
};
    const handleRemoveRole = async () => {
    if (!selectedUser || !roleName) return;

    if (window.confirm(`Are you sure you want to remove the "${roleName}" role from ${selectedUser.userName}?`)) {
        try {
            const api = getApi();
            await api.post('/admin/remove-role', { userId: selectedUser.id, roleName: roleName });
            fetchUsers(); 
            handleCloseRoleModal();
        } catch (error) {
            console.error('Failed to remove role:', error);
            const errorMessage = error.response?.data?.message || "An unknown error occurred.";
            alert(`Error: ${errorMessage}`);
        }
    }
};
  return (
    <ThemeProvider theme={muiDarkTheme}>
      <PageWrapper>
        <Header>
          <HeaderTitle><FiUsers /> User Management</HeaderTitle>
          <StyledButton as={RouterLink} to="/dashboard">
            <FiArrowLeft /> Back to Dashboard
          </StyledButton>
        </Header>
        <ContentContainer>
          <UserGrid>
            {users.map(user => (
              <UserCard key={user.id}>
                <UserInfo>
                  <UserName>{user.userName}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                  <RolesContainer>
                    {user.roles.length > 0 ? user.roles.map(role => (
                      <RoleChip key={role} isAdmin={role === 'Admin'}>
                        {role === 'Admin' && <FiShield size={12} style={{marginRight: '4px'}}/>}
                        {role}
                      </RoleChip>
                    )) : <RoleChip>No Roles</RoleChip>}
                  </RolesContainer>
                </UserInfo>
                <UserActions>
                  <StatusToggle isActive={user.isActive}>
    {user.isActive ? <FiUserCheck /> : <FiUserX />}
    <select
        value={user.isActive}
        onChange={(e) => handleStatusChange(user.id, e.target.value === 'true')}
        disabled={user.id === currentAdminId}
        style={{ /* ... styles ... */ }}
    >
        <option value={true} style={{color: 'black'}}>Active</option>
        <option value={false} style={{color: 'black'}}>Inactive</option>
    </select>
</StatusToggle>
                  <StyledButton
                    onClick={() => handleOpenRoleModal(user)}
                    disabled={user.id === currentAdminId}
                  >
                    <FiBriefcase size={14}/> Manage Roles
                  </StyledButton>
                </UserActions>
              </UserCard>
            ))}
          </UserGrid>
        </ContentContainer>

        <Dialog open={roleModalOpen} onClose={handleCloseRoleModal} fullWidth maxWidth="xs">
            <DialogTitle fontWeight="bold">Manage Roles for {selectedUser?.userName}</DialogTitle>
            <DialogContent>
                <TextField select autoFocus margin="dense" label="Select Role" fullWidth variant="outlined" value={roleName} onChange={(e) => setRoleName(e.target.value)}>
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions style={{padding: '1rem 1.5rem', justifyContent: 'space-between'}}>
                <MuiButton variant="outlined" onClick={handleCloseRoleModal}>Cancel</MuiButton>
                <MuiButton color="error" onClick={handleRemoveRole}>Remove Role</MuiButton>
                <MuiButton variant="contained" onClick={handleAddRole}>Add Role</MuiButton>
            </DialogActions>
        </Dialog>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default UserManagementPage;