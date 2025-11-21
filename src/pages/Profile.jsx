import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { User, Lock, Save } from 'lucide-react';

const Profile = () => {
    const { currentUser, logout, updateProfile, changePassword, deleteAccount } = useAppContext();
    const navigate = useNavigate();

    // Profile Form
    const [username, setUsername] = useState(currentUser.username);

    // Password Form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState({ type: '', text: '' });

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        const result = updateProfile(currentUser.id, { username });
        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        const result = changePassword(currentUser.id, currentPassword, newPassword);
        if (result.success) {
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            deleteAccount(currentUser.id);
            navigate('/');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>My Account</h1>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ width: 80, height: 80, backgroundColor: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>
                        {currentUser.username[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>{currentUser.username}</h2>
                        <p style={{ color: 'var(--color-text-light)' }}>{currentUser.email}</p>
                        <span style={{
                            display: 'inline-block',
                            marginTop: 'var(--spacing-xs)',
                            padding: '4px 12px',
                            backgroundColor: 'var(--color-secondary-light)',
                            color: 'var(--color-secondary)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            fontWeight: 600
                        }}>
                            {currentUser.role.toUpperCase()}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    {message.text && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            backgroundColor: message.type === 'success' ? 'var(--color-secondary-light)' : '#FEE2E2',
                            color: message.type === 'success' ? 'var(--color-secondary)' : 'var(--color-danger)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: 500 }}>Username</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-sm)' }}>
                            <User size={20} color="var(--color-text-light)" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ border: 'none', outline: 'none', flex: 1, fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                        <Save size={20} />
                        Update Profile
                    </button>
                </form>

                <div style={{ margin: 'var(--spacing-xl) 0', borderTop: '1px solid var(--color-border)' }}></div>

                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Change Password</h3>
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: 500 }}>Current Password</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-sm)' }}>
                            <Lock size={20} color="var(--color-text-light)" />
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                style={{ border: 'none', outline: 'none', flex: 1, fontSize: '1rem' }}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: 500 }}>New Password</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-sm)' }}>
                            <Lock size={20} color="var(--color-text-light)" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ border: 'none', outline: 'none', flex: 1, fontSize: '1rem' }}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: 500 }}>Confirm New Password</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-sm)' }}>
                            <Lock size={20} color="var(--color-text-light)" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ border: 'none', outline: 'none', flex: 1, fontSize: '1rem' }}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
                        Change Password
                    </button>
                </form>

                <div style={{ margin: 'var(--spacing-xl) 0', borderTop: '1px solid var(--color-border)' }}></div>

                <div style={{ padding: 'var(--spacing-lg)', backgroundColor: '#FEF2F2', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA' }}>
                    <h3 style={{ color: 'var(--color-danger)', marginBottom: 'var(--spacing-sm)' }}>Danger Zone</h3>
                    <p style={{ marginBottom: 'var(--spacing-md)', color: '#991B1B' }}>Once you delete your account, there is no going back. Please be certain.</p>
                    <button
                        onClick={handleDeleteAccount}
                        className="btn"
                        style={{ backgroundColor: 'var(--color-danger)', color: 'white', border: 'none' }}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
