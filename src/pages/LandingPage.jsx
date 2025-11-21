import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import { BookOpen, Users, Sparkles } from 'lucide-react';

const LandingPage = () => {
    const { login, register, currentUser } = useAppContext();
    const navigate = useNavigate();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    // Form States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    if (currentUser) {
        navigate('/dashboard');
        return null;
    }

    const handleLogin = (e) => {
        e.preventDefault();
        const result = login(username, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const result = register(username, email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    const openLogin = () => {
        setError('');
        setUsername('');
        setPassword('');
        setIsLoginOpen(true);
        setIsRegisterOpen(false);
    };

    const openRegister = () => {
        setError('');
        setUsername('');
        setPassword('');
        setEmail('');
        setIsRegisterOpen(true);
        setIsLoginOpen(false);
    };

    const features = [
        { icon: BookOpen, title: 'Interactive Mus\'haf', desc: 'Read the Quran with AI-powered Tafsir' },
        { icon: Users, title: 'Virtual Halaqas', desc: 'Join or create learning circles globally' },
        { icon: Sparkles, title: 'Progress Tracking', desc: 'Monitor memorization and attendance' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #A855F7 100%)',
            textAlign: 'center',
            padding: 'var(--spacing-xl)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Islamic patterns */}
            <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.3)', top: '-250px', right: '-150px', filter: 'blur(80px)' }}></div>
            <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.2)', bottom: '-200px', left: '-150px', filter: 'blur(80px)' }}></div>
            <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                border: '2px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                top: '20%',
                left: '10%',
                transform: 'rotate(45deg)'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px' }} className="fade-in">
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                        borderRadius: 'var(--radius-lg)',
                        margin: '0 auto var(--spacing-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary)',
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        fontFamily: 'var(--font-arabic-display)',
                        border: '3px solid rgba(212, 175, 55, 0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(45deg, transparent 30%, rgba(124, 58, 237, 0.1) 50%, transparent 70%)',
                            animation: 'shimmer 3s infinite'
                        }}></div>
                        <BookOpen size={48} strokeWidth={2} />
                    </div>
                    <h1 style={{
                        fontSize: '3rem',
                        marginBottom: 'var(--spacing-xs)',
                        color: 'white',
                        textShadow: '0 4px 30px rgba(0,0,0,0.4)',
                        fontFamily: 'var(--font-arabic-display)',
                        letterSpacing: '2px'
                    }}>إحسان</h1>
                    <h2 style={{
                        fontSize: '1.5rem',
                        marginBottom: 'var(--spacing-xs)',
                        color: 'rgba(255,255,255,0.95)',
                        fontWeight: 600
                    }}>Ihsan</h2>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', margin: '0 auto var(--spacing-md)', lineHeight: 1.5 }}>
                        Your global Quranic community. Learn, grow, and connect—anytime, anywhere.
                    </p>
                </div>

                {/* Features */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)', maxWidth: '1000px', margin: '0 auto var(--spacing-md)' }}>
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div key={idx} style={{
                                padding: 'var(--spacing-md)',
                                background: 'rgba(255,255,255,0.12)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 'var(--radius-lg)',
                                border: '2px solid rgba(255,255,255,0.25)',
                                color: 'white',
                                transition: 'all 0.4s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-12px)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
                                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                                }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 'var(--spacing-sm)'
                                }}>
                                    <Icon size={24} strokeWidth={2} />
                                </div>
                                <h3 style={{ marginBottom: 'var(--spacing-xs)', color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>{feature.title}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.5 }}>{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                    <button
                        className="btn"
                        onClick={openLogin}
                        style={{
                            minWidth: '140px',
                            background: 'white',
                            color: 'var(--color-primary)',
                            fontSize: '1.1rem',
                            padding: '1rem 2rem'
                        }}
                    >
                        Login
                    </button>
                    <button
                        className="btn"
                        onClick={openRegister}
                        style={{
                            minWidth: '140px',
                            background: 'rgba(255,255,255,0.2)',
                            border: '2px solid white',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            fontSize: '1.1rem',
                            padding: '1rem 2rem'
                        }}
                    >
                        Register
                    </button>
                </div>
            </div>

            {/* Login Modal */}
            <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title="Welcome Back">
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {error && <div style={{ color: 'var(--color-danger)', fontSize: '0.9rem', padding: 'var(--spacing-sm)', background: '#fee', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
                        required
                    />
                    <button type="submit" className="btn btn-primary">Login</button>
                    <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                        Don't have an account? <span onClick={openRegister} style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 500 }}>Register</span>
                    </div>
                </form>
            </Modal>

            {/* Register Modal */}
            <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Join Ihsan">
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {error && <div style={{ color: 'var(--color-danger)', fontSize: '0.9rem', padding: 'var(--spacing-sm)', background: '#fee', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
                        required
                    />
                    <button type="submit" className="btn btn-secondary">Register</button>
                    <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                        Already have an account? <span onClick={openLogin} style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 500 }}>Login</span>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default LandingPage;
