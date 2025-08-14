// // File: frontend/src/components/ProfilePage.js

// import React, { useState, useEffect, useCallback } from 'react';
// import styled from 'styled-components';
// import axios from 'axios';
// import { Link as RouterLink } from 'react-router-dom';

// // Icons
// import { FiUser, FiMail, FiShield, FiArrowLeft } from 'react-icons/fi';

// // --- STYLING (Reusing the theme from your Dashboard) ---
// const theme = { /* ... Paste your full theme object here ... */ };
// // Reusable styled components
// const PageWrapper = styled.div` /* ... */ `;
// const Header = styled.header` /* ... */ `;
// const HeaderTitle = styled.h1` /* ... */ `;
// const StyledButton = styled.button` /* ... */ `;
// const ContentContainer = styled.main` padding: 2rem; display: flex; justify-content: center; align-items: flex-start;`;
// const ProfileCard = styled.div`
//     background-color: ${theme.surfaceSolid};
//     border-radius: 12px;
//     padding: 2rem;
//     width: 100%;
//     max-width: 500px;
//     border: 1px solid ${theme.border};
//     box-shadow: 0 4px 6px rgba(0,0,0,0.2);
// `;
// const ProfileInfoRow = styled.div`
//     display: flex;
//     align-items: center;
//     gap: 1rem;
//     margin-bottom: 1.5rem;
//     font-size: 1.1rem;
// `;
// const InfoText = styled.div``;
// const InfoLabel = styled.div` color: ${theme.textSecondary}; font-size: 0.9rem;`;
// const InfoValue = styled.div` color: ${theme.text}; font-weight: 500;`;


// // --- MAIN PROFILE PAGE COMPONENT ---
// const ProfilePage = () => {
//     const [profile, setProfile] = useState(null);

//     const getApi = useCallback(() => {
//         const token = localStorage.getItem('token');
//         return axios.create({ baseURL: 'http://localhost:5209/api', headers: { 'Authorization': `Bearer ${token}` } });
//     }, []);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const api = getApi();
//                 const response = await api.get('/profile/me');
//                 setProfile(response.data);
//             } catch (error) {
//                 console.error('Failed to fetch profile:', error);
//             }
//         };
//         fetchProfile();
//     }, [getApi]);

//     if (!profile) {
//         return <PageWrapper><HeaderTitle>Loading Profile...</HeaderTitle></PageWrapper>; // Loading state
//     }

//     return (
//         <PageWrapper>
//             <Header>
//                 <HeaderTitle><FiUser /> My Profile</HeaderTitle>
//                 <StyledButton as={RouterLink} to="/dashboard">
//                     <FiArrowLeft /> Back to Dashboard
//                 </StyledButton>
//             </Header>
//             <ContentContainer>
//                 <ProfileCard>
//                     <ProfileInfoRow>
//                         <FiUser size={24} color={theme.primary} />
//                         <InfoText>
//                             <InfoLabel>Username</InfoLabel>
//                             <InfoValue>{profile.userName}</InfoValue>
//                         </InfoText>
//                     </ProfileInfoRow>
//                     <ProfileInfoRow>
//                         <FiMail size={24} color={theme.primary} />
//                         <InfoText>
//                             <InfoLabel>Email</InfoLabel>
//                             <InfoValue>{profile.email}</InfoValue>
//                         </InfoText>
//                     </ProfileInfoRow>
//                     <ProfileInfoRow>
//                         <FiShield size={24} color={theme.primary} />
//                         <InfoText>
//                             <InfoLabel>Roles</InfoLabel>
//                             <InfoValue>{profile.roles.join(', ')}</InfoValue>
//                         </InfoText>
//                     </ProfileInfoRow>
//                 </ProfileCard>
//             </ContentContainer>
//         </PageWrapper>
//     );
// };

// export default ProfilePage;


// File: frontend/src/components/ProfilePage.js
// File: frontend/src/components/ProfilePage.js
// File: frontend/src/components/ProfilePage.js

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';

// Icons
import { FiUser, FiArrowLeft } from 'react-icons/fi';

// --- THEME & STYLING (Identical to DashboardPage.js) ---
const theme = {
  primary: '#a78bfa',
  gradient: '#7c3aed',
  bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
  surfaceGlass: 'rgba(23, 23, 23, 0.6)',
  surfaceSolid: '#1f2937',
  text: '#e2e8f0',
  textSecondary: '#94a3b8',
  error: '#f43f5e',
  warning: '#facc15',
  success: '#4ade80',
  border: 'rgba(255, 255, 255, 0.1)',
};

const PageWrapper = styled.div`
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
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${theme.surfaceGlass};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.border};
`;
const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  background-color: transparent;
  color: ${props => props.color || theme.textSecondary};
  border-color: ${props => props.color || theme.textSecondary};
  &:hover {
    background-color: ${props => (props.color || theme.textSecondary) + '20'};
    color: white;
    border-color: ${props => props.color || 'white'};
  }
`;
const ContentContainer = styled.main`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
  padding-top: 4rem; // Give it some space from the header
  min-height: calc(100vh - 74px); // Adjust based on header height
`;
const ProfileCard = styled.div`
  background-color: ${theme.surfaceSolid};
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 600px;
  border: 1px solid ${theme.border};
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
`;
const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${theme.border};
`;
const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  background-image: linear-gradient(45deg, ${theme.primary}, ${theme.gradient});
  box-shadow: 0 0 20px -5px ${theme.primary};
`;
const UserTitle = styled.div``;
const UserName = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  color: ${theme.text};
`;
const UserEmail = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 1rem;
  color: ${theme.textSecondary};
`;
const ProfileBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;
const InfoBlock = styled.div`
  text-align: left;
`;
const InfoLabel = styled.p`
  margin: 0 0 0.5rem 0;
  color: ${theme.textSecondary};
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const InfoValue = styled.p`
  margin: 0;
  color: ${theme.text};
  font-size: 1.1rem;
`;


// --- MAIN PROFILE PAGE COMPONENT ---
const ProfilePage = () => {
    const [profile, setProfile] = useState(null);

    const getApi = useCallback(() => {
        const token = localStorage.getItem('token');
        return axios.create({ baseURL: 'http://localhost:5209/api', headers: { 'Authorization': `Bearer ${token}` } });
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const api = getApi();
                const response = await api.get('/profile/me');
                setProfile(response.data);
            } catch (error) { console.error('Failed to fetch profile:', error); }
        };
        fetchProfile();
    }, [getApi]);

    if (!profile) {
        return (
            <PageWrapper>
                <Header>
                    <HeaderTitle>Loading...</HeaderTitle>
                </Header>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Header>
                <HeaderTitle><FiUser /> My Profile</HeaderTitle>
                <StyledButton as={RouterLink} to="/dashboard">
                    <FiArrowLeft /> Back to Dashboard
                </StyledButton>
            </Header>
            <ContentContainer>
                <ProfileCard>
                    <ProfileHeader>
                        <UserTitle>
                            <UserName>{ (profile.firstName || profile.lastName) ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : profile.userName}</UserName>
                            <UserEmail>{profile.email}</UserEmail>
                        </UserTitle>
                        <Avatar>
                            {profile.userName.charAt(0).toUpperCase()}
                        </Avatar>
                    </ProfileHeader>

                    <ProfileBody>
                        <InfoBlock>
                            <InfoLabel>Username</InfoLabel>
                            <InfoValue>{profile.userName}</InfoValue>
                        </InfoBlock>
                        <InfoBlock>
                            <InfoLabel>Roles</InfoLabel>
                            <InfoValue>{profile.roles.join(', ')}</InfoValue>
                        </InfoBlock>
                        <InfoBlock>
                            <InfoLabel>First Name</InfoLabel>
                            <InfoValue>{profile.firstName || 'Not Set'}</InfoValue>
                        </InfoBlock>
                        <InfoBlock>
                            <InfoLabel>Last Name</InfoLabel>
                            <InfoValue>{profile.lastName || 'Not Set'}</InfoValue>
                        </InfoBlock>
                        <InfoBlock>
                            <InfoLabel>Gender</InfoLabel>
                            <InfoValue>{profile.gender || 'Not Set'}</InfoValue>
                        </InfoBlock>
                    </ProfileBody>
                </ProfileCard>
            </ContentContainer>
        </PageWrapper>
    );
};

export default ProfilePage;