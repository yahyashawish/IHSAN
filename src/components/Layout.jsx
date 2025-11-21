import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, BookOpen, User, LogOut, Video } from 'lucide-react';

const Layout = ({ children }) => {
    const { currentUser, logout } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!currentUser) return children;

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Mus\'haf', path: '/mushaf', icon: BookOpen },
        { label: 'My Account', path: '/profile', icon: User },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                background: 'linear-gradient(180deg, #ffffff 0%, #FAF5FF 100%)',
                borderRight: '2px solid var(--color-border)',
                padding: 'var(--spacing-lg)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-md)'
            }}>
                <div style={{ marginBottom: 'var(--spacing-2xl)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-md)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                            animation: 'shimmer 3s infinite'
                        }}></div>
                        <BookOpen size={28} color="white" strokeWidth={2.5} />
                    </div>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.75rem',
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                        fontFamily: 'var(--font-arabic-display)'
                    }}>إحسان</h2>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-md)',
                                    padding: 'var(--spacing-md) var(--spacing-lg)',
                                    borderRadius: 'var(--radius-md)',
                                    color: isActive ? 'white' : 'var(--color-text)',
                                    background: isActive ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' : 'transparent',
                                    fontWeight: isActive ? 600 : 500,
                                    boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'var(--color-primary-light)';
                                        e.currentTarget.style.color = 'var(--color-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--color-text)';
                                    }
                                }}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    className="btn btn-outline"
                    style={{ marginTop: 'auto', width: '100%' }}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: 'var(--spacing-xl)', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
