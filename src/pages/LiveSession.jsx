import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Hand, Users, MessageSquare } from 'lucide-react';

const LiveSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { halaqas, currentUser, toggleLiveSession } = useAppContext();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);

    const halaqa = halaqas.find(h => h.id === parseInt(id));

    useEffect(() => {
        if (!halaqa || (!halaqa.isLive && halaqa.teacherId !== currentUser.id)) {
            navigate('/dashboard');
        }
    }, [halaqa, currentUser, navigate]);

    if (!halaqa) return null;

    const isTeacher = currentUser.id === halaqa.teacherId;

    const handleEndSession = () => {
        if (window.confirm('Are you sure you want to end the session?')) {
            toggleLiveSession(halaqa.id, false);
            navigate(`/halaqa/teacher/${halaqa.id}`);
        }
    };

    const handleLeave = () => {
        navigate(`/halaqa/student/${halaqa.id}`);
    };

    return (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', backgroundColor: '#202124', borderRadius: 'var(--radius-lg)', overflow: 'hidden', color: 'white' }}>
            {/* Header */}
            <div style={{ padding: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <div style={{ width: 8, height: 8, backgroundColor: 'red', borderRadius: '50%' }}></div>
                    <span style={{ fontWeight: 600 }}>{halaqa.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                        <Users size={16} /> {halaqa.students.length + 1}
                    </span>
                </div>
            </div>

            {/* Main Video Area */}
            <div style={{ flex: 1, display: 'flex', padding: 'var(--spacing-md)', gap: 'var(--spacing-md)' }}>
                {/* Main Speaker */}
                <div style={{ flex: 1, backgroundColor: '#3c4043', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 80, height: 80, backgroundColor: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto var(--spacing-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                            {halaqa.teacherName[0].toUpperCase()}
                        </div>
                        <h3>{halaqa.teacherName}</h3>
                        <p style={{ color: '#9aa0a6' }}>Teacher (Host)</p>
                    </div>
                    <div style={{ position: 'absolute', bottom: 'var(--spacing-md)', left: 'var(--spacing-md)', backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {halaqa.teacherName}
                    </div>
                </div>

                {/* Sidebar Participants */}
                <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {halaqa.students.slice(0, 3).map((studentId, idx) => (
                        <div key={studentId} style={{ height: '150px', backgroundColor: '#3c4043', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <div style={{ width: 40, height: 40, backgroundColor: 'var(--color-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                S{idx + 1}
                            </div>
                            <div style={{ position: 'absolute', bottom: 'var(--spacing-sm)', left: 'var(--spacing-sm)', backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                                Student {idx + 1}
                            </div>
                        </div>
                    ))}
                    <div style={{ flex: 1, backgroundColor: '#3c4043', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa0a6' }}>
                        + {Math.max(0, halaqa.students.length - 3)} others
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div style={{ padding: 'var(--spacing-lg)', display: 'flex', justifyContent: 'center', gap: 'var(--spacing-lg)', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    style={{
                        width: 50, height: 50, borderRadius: '50%', border: 'none',
                        backgroundColor: isMuted ? 'var(--color-danger)' : '#3c4043',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    style={{
                        width: 50, height: 50, borderRadius: '50%', border: 'none',
                        backgroundColor: isVideoOff ? 'var(--color-danger)' : '#3c4043',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>

                {!isTeacher && (
                    <button
                        onClick={() => setIsHandRaised(!isHandRaised)}
                        style={{
                            width: 50, height: 50, borderRadius: '50%', border: 'none',
                            backgroundColor: isHandRaised ? 'var(--color-accent)' : '#3c4043',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Hand size={24} />
                    </button>
                )}

                {isTeacher ? (
                    <button
                        onClick={handleEndSession}
                        style={{
                            padding: '0 var(--spacing-xl)', borderRadius: 'var(--radius-full)', border: 'none',
                            backgroundColor: 'var(--color-danger)', color: 'white', fontWeight: 600
                        }}
                    >
                        End Session
                    </button>
                ) : (
                    <button
                        onClick={handleLeave}
                        style={{
                            width: 50, height: 50, borderRadius: '50%', border: 'none',
                            backgroundColor: 'var(--color-danger)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <PhoneOff size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default LiveSession;
