import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Video, Award, Calendar, BookOpen, Trophy } from 'lucide-react';

const HalaqaStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { halaqas, currentUser, progress, attendance, users } = useAppContext();

    const halaqa = halaqas.find(h => h.id === parseInt(id));
    if (!halaqa) return <div>Halaqa not found</div>;

    const key = `${currentUser.id}_${halaqa.id}`;
    const myProgress = progress[key] || { pages: 0, points: 0 };
    const myAttendance = attendance[key] || [];

    // Calculate Leaderboard
    const leaderboard = halaqa.students.map(studentId => {
        const studentKey = `${studentId}_${halaqa.id}`;
        const studentProgress = progress[studentKey] || { points: 0 };
        const studentUser = users.find(u => u.id === studentId);
        return {
            id: studentId,
            username: studentUser ? studentUser.username : 'Unknown',
            points: studentProgress.points || 0
        };
    }).sort((a, b) => b.points - a.points);

    const handleJoinSession = () => {
        if (halaqa.isLive) {
            navigate(`/live/${halaqa.id}`);
        }
    };

    return (
        <div>
            <header style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>{halaqa.name}</h1>
                    <p style={{ color: 'var(--color-text-light)' }}>Teacher: {halaqa.teacherName}</p>
                </div>
                <button
                    className={`btn ${halaqa.isLive ? 'btn-success' : 'btn-outline'}`}
                    onClick={handleJoinSession}
                    disabled={!halaqa.isLive}
                    style={{
                        backgroundColor: halaqa.isLive ? 'var(--color-success)' : 'transparent',
                        color: halaqa.isLive ? 'white' : 'var(--color-text-light)',
                        borderColor: halaqa.isLive ? 'transparent' : 'var(--color-border)',
                        cursor: halaqa.isLive ? 'pointer' : 'not-allowed',
                        boxShadow: halaqa.isLive ? '0 0 15px rgba(42, 157, 143, 0.5)' : 'none'
                    }}
                >
                    <Video size={20} />
                    {halaqa.isLive ? 'Join Live Session' : 'Session Not Started'}
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                {/* Progress Card */}
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Award size={24} color="var(--color-accent)" />
                        My Progress
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{myProgress.pages}</div>
                            <div style={{ color: 'var(--color-text-light)' }}>Pages Memorized</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>{myProgress.points}</div>
                            <div style={{ color: 'var(--color-text-light)' }}>Total Points</div>
                        </div>
                    </div>
                </div>

                {/* Attendance Card */}
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Calendar size={24} color="var(--color-secondary)" />
                        Attendance Log
                    </h3>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {myAttendance.length === 0 ? (
                            <p style={{ color: 'var(--color-text-light)', textAlign: 'center' }}>No attendance records yet.</p>
                        ) : (
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    {myAttendance.map((record, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid var(--color-surface)' }}>
                                            <td style={{ padding: 'var(--spacing-sm)' }}>{record.date}</td>
                                            <td style={{
                                                padding: 'var(--spacing-sm)',
                                                textAlign: 'right',
                                                color: record.status === 'Present' ? 'var(--color-success)' :
                                                    record.status === 'Absent' ? 'var(--color-danger)' : 'var(--color-accent)',
                                                fontWeight: 500
                                            }}>
                                                {record.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Leaderboard Card */}
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Trophy size={24} color="#F59E0B" />
                        Leaderboard
                    </h3>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                {leaderboard.map((student, index) => (
                                    <tr key={student.id} style={{
                                        borderBottom: '1px solid var(--color-surface)',
                                        backgroundColor: student.id === currentUser.id ? 'var(--color-primary-light)' : 'transparent'
                                    }}>
                                        <td style={{ padding: 'var(--spacing-sm)', width: '40px', fontWeight: 'bold', color: index < 3 ? '#F59E0B' : 'var(--color-text-light)' }}>
                                            #{index + 1}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-sm)', fontWeight: student.id === currentUser.id ? 600 : 400 }}>
                                            {student.username} {student.id === currentUser.id && '(You)'}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-sm)', textAlign: 'right', fontWeight: 600, color: 'var(--color-primary)' }}>
                                            {student.points} pts
                                        </td>
                                    </tr>
                                ))}
                                {leaderboard.length === 0 && (
                                    <tr>
                                        <td colSpan="3" style={{ padding: 'var(--spacing-md)', textAlign: 'center', color: 'var(--color-text-light)' }}>
                                            No students yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HalaqaStudent;
