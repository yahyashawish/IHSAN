import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import { Plus, Users, BookOpen, ArrowRight, Video, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const { currentUser, halaqas, createHalaqa, joinHalaqa } = useAppContext();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);

    // Form States
    const [halaqaName, setHalaqaName] = useState('');
    const [halaqaDesc, setHalaqaDesc] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');

    const myTeachingHalaqas = halaqas.filter(h => h.teacherId === currentUser.id);
    const myStudentHalaqas = halaqas.filter(h => h.students.includes(currentUser.id));

    const handleCreate = (e) => {
        e.preventDefault();
        createHalaqa(halaqaName, halaqaDesc);
        setIsCreateOpen(false);
        setHalaqaName('');
        setHalaqaDesc('');
    };

    const handleJoin = (e) => {
        e.preventDefault();
        const result = joinHalaqa(joinCode);
        if (result.success) {
            setIsJoinOpen(false);
            setJoinCode('');
            setError('');
        } else {
            setError(result.message);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                padding: 'var(--spacing-2xl)',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                marginBottom: 'var(--spacing-2xl)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', top: '-100px', right: '-100px' }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)', color: 'white' }}>
                        السلام عليكم, {currentUser.username}!
                    </h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.95, marginBottom: 'var(--spacing-xl)' }}>
                        Welcome back to your learning journey
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                        <button
                            className="btn"
                            onClick={() => setIsCreateOpen(true)}
                            style={{ background: 'white', color: 'var(--color-primary)', padding: '1rem 2rem' }}
                        >
                            <Plus size={20} />
                            Create Halaqa
                        </button>
                        <button
                            className="btn"
                            onClick={() => setIsJoinOpen(true)}
                            style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid white', color: 'white', backdropFilter: 'blur(10px)', padding: '1rem 2rem' }}
                        >
                            <Users size={20} />
                            Join Halaqa
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Teaching</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{myTeachingHalaqas.length}</div>
                        </div>
                        <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={24} />
                        </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Halaqas you manage</div>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Learning</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{myStudentHalaqas.length}</div>
                        </div>
                        <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Halaqas you joined</div>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Live Now</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{halaqas.filter(h => h.isLive).length}</div>
                        </div>
                        <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Video size={24} />
                        </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>Active sessions</div>
                </div>
            </div>

            {/* Teaching Section */}
            <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h2 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: '1.75rem' }}>
                    <BookOpen size={28} />
                    My Teaching
                </h2>
                {myTeachingHalaqas.length === 0 ? (
                    <div className="card" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', border: '2px dashed var(--color-border)' }}>
                        <BookOpen size={48} style={{ color: 'var(--color-text-light)', marginBottom: 'var(--spacing-md)' }} />
                        <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--spacing-md)' }}>
                            You haven't created any Halaqas yet.
                        </p>
                        <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
                            <Plus size={20} />
                            Create Your First Halaqa
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {myTeachingHalaqas.map(halaqa => (
                            <Link to={`/halaqa/teacher/${halaqa.id}`} key={halaqa.id} className="card"
                                style={{ textDecoration: 'none', color: 'inherit', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-accent-light) 100%)', borderRadius: '0 0 0 100%', opacity: 0.5 }}></div>

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                                        <h3 style={{ fontSize: '1.3rem', margin: 0, flex: 1 }}>{halaqa.name}</h3>
                                        <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>
                                            TEACHER
                                        </span>
                                    </div>

                                    <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--spacing-lg)', minHeight: '3rem', lineHeight: '1.5' }}>
                                        {halaqa.description}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                                                <Users size={16} />
                                                <span style={{ fontWeight: 600 }}>{halaqa.students.length}</span>
                                            </div>
                                            {halaqa.isLive && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-danger)', fontWeight: 600, fontSize: '0.85rem' }}>
                                                    <span style={{ width: 8, height: 8, backgroundColor: 'var(--color-danger)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                                                    LIVE
                                                </span>
                                            )}
                                        </div>
                                        <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                            Manage <ArrowRight size={18} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Learning Section */}
            <section>
                <h2 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: '1.75rem' }}>
                    <Users size={28} />
                    My Learning
                </h2>
                {myStudentHalaqas.length === 0 ? (
                    <div className="card" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', border: '2px dashed var(--color-border)' }}>
                        <Users size={48} style={{ color: 'var(--color-text-light)', marginBottom: 'var(--spacing-md)' }} />
                        <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--spacing-md)' }}>
                            You haven't joined any Halaqas yet.
                        </p>
                        <button className="btn btn-secondary" onClick={() => setIsJoinOpen(true)}>
                            <Users size={20} />
                            Join a Halaqa
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {myStudentHalaqas.map(halaqa => (
                            <Link to={`/halaqa/student/${halaqa.id}`} key={halaqa.id} className="card"
                                style={{ textDecoration: 'none', color: 'inherit', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'linear-gradient(135deg, var(--color-secondary-light) 0%, var(--color-accent-light) 100%)', borderRadius: '0 0 0 100%', opacity: 0.5 }}></div>

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                                        <h3 style={{ fontSize: '1.3rem', margin: 0, flex: 1 }}>{halaqa.name}</h3>
                                        <span style={{ backgroundColor: 'var(--color-secondary)', color: 'white', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>
                                            STUDENT
                                        </span>
                                    </div>

                                    <p style={{ color: 'var(--color-text)', marginBottom: 'var(--spacing-lg)', fontWeight: 500 }}>
                                        Teacher: {halaqa.teacherName}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                                        {halaqa.isLive ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-danger)', fontWeight: 700, fontSize: '0.95rem' }}>
                                                <span style={{ width: 10, height: 10, backgroundColor: 'var(--color-danger)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                                                LIVE NOW
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Not Live</span>
                                        )}
                                        <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                            Enter <ArrowRight size={18} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Modals */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Halaqa">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <input
                        type="text"
                        placeholder="Halaqa Name"
                        value={halaqaName}
                        onChange={(e) => setHalaqaName(e.target.value)}
                        style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', fontSize: '1rem' }}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={halaqaDesc}
                        onChange={(e) => setHalaqaDesc(e.target.value)}
                        style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', minHeight: '100px', fontFamily: 'inherit', fontSize: '1rem' }}
                        required
                    />
                    <button type="submit" className="btn btn-primary">Create Halaqa</button>
                </form>
            </Modal>

            <Modal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} title="Join a Halaqa">
                <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {error && <div style={{ color: 'var(--color-danger)', fontSize: '0.9rem', padding: 'var(--spacing-sm)', background: '#fee', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
                    <input
                        type="text"
                        placeholder="Enter Invite Code"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', fontSize: '1rem', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '2px', fontWeight: 600 }}
                        required
                    />
                    <button type="submit" className="btn btn-secondary">Join Halaqa</button>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;
