import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import { Video, Users, Award, Calendar, Check, X as XIcon, Clock, Edit2, Star, Mic, UserPlus } from 'lucide-react';

const HalaqaTeacher = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { halaqas, users, toggleLiveSession, updateProgress, markAttendance, progress, attendance, updateStudentInfo, evaluateStudent, addPoints, evaluations, pointsHistory, addStudentToHalaqa } = useAppContext();
    const [activeTab, setActiveTab] = useState('students');

    // Modal States
    const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', email: '' });
    const [addStudentIdentifier, setAddStudentIdentifier] = useState('');

    // Evaluation States
    const [evalScore, setEvalScore] = useState('');
    const [evalNotes, setEvalNotes] = useState('');

    // Points States
    const [pointsAmount, setPointsAmount] = useState('');
    const [pointsReason, setPointsReason] = useState('');

    const halaqa = halaqas.find(h => h.id === parseInt(id));
    if (!halaqa) return <div>Halaqa not found</div>;

    const students = users.filter(u => halaqa.students.includes(u.id));

    const handleStartSession = () => {
        toggleLiveSession(halaqa.id, true);
        navigate(`/live/${halaqa.id}`);
    };

    return (
        <div>
            <header style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>{halaqa.name}</h1>
                    <p style={{ color: 'var(--color-text-light)' }}>Invite Code: <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{halaqa.code}</span></p>
                </div>
                <button className="btn btn-primary" onClick={handleStartSession}>
                    <Video size={20} />
                    Start Live Session
                </button>
            </header>

            <div style={{ marginBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-xl)' }}>
                    {['students', 'progress', 'attendance', 'evaluation', 'rewards'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: 'var(--spacing-md) 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
                                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-light)',
                                fontWeight: activeTab === tab ? 600 : 400,
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'students' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <h3 style={{ margin: 0 }}>Roster ({students.length})</h3>
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsAddStudentOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: '8px 16px' }}
                        >
                            <UserPlus size={18} />
                            Add Student
                        </button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                                <th style={{ padding: 'var(--spacing-sm)' }}>Name</th>
                                <th style={{ padding: 'var(--spacing-sm)' }}>Email</th>
                                <th style={{ padding: 'var(--spacing-sm)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} style={{ borderBottom: '1px solid var(--color-surface)' }}>
                                    <td style={{ padding: 'var(--spacing-md) var(--spacing-sm)' }}>{student.username}</td>
                                    <td style={{ padding: 'var(--spacing-md) var(--spacing-sm)' }}>{student.email}</td>
                                    <td style={{ padding: 'var(--spacing-md) var(--spacing-sm)' }}>
                                        <button
                                            onClick={() => {
                                                setSelectedStudent(student);
                                                setEditForm({ username: student.username, email: student.email });
                                                setIsEditStudentOpen(true);
                                            }}
                                            style={{ color: 'var(--color-primary)', background: 'none', border: 'none', marginRight: 'var(--spacing-md)' }}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button style={{ color: 'var(--color-danger)', background: 'none', border: 'none' }}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--color-text-light)' }}>
                                        No students joined yet. Share the code <strong>{halaqa.code}</strong>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'progress' && (
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Student Progress</h3>
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {students.map(student => {
                            const key = `${student.id}_${halaqa.id}`;
                            const studentProgress = progress[key] || { pages: 0, points: 0 };
                            return (
                                <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ fontWeight: 500 }}>{student.username}</span>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Pages:</label>
                                            <input
                                                type="number"
                                                value={studentProgress.pages}
                                                onChange={(e) => updateProgress(student.id, halaqa.id, parseInt(e.target.value) || 0, studentProgress.points)}
                                                style={{ width: '60px', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Points:</label>
                                            <input
                                                type="number"
                                                value={studentProgress.points}
                                                onChange={(e) => updateProgress(student.id, halaqa.id, studentProgress.pages, parseInt(e.target.value) || 0)}
                                                style={{ width: '60px', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Today's Attendance</h3>
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {students.map(student => {
                            const key = `${student.id}_${halaqa.id}`;
                            const today = new Date().toISOString().split('T')[0];
                            const record = (attendance[key] || []).find(r => r.date === today);
                            const status = record ? record.status : null;

                            return (
                                <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ fontWeight: 500 }}>{student.username}</span>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                        <button
                                            onClick={() => markAttendance(student.id, halaqa.id, 'Present')}
                                            style={{
                                                padding: '4px 12px',
                                                borderRadius: 'var(--radius-full)',
                                                border: '1px solid var(--color-success)',
                                                backgroundColor: status === 'Present' ? 'var(--color-success)' : 'transparent',
                                                color: status === 'Present' ? 'white' : 'var(--color-success)',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Present
                                        </button>
                                        <button
                                            onClick={() => markAttendance(student.id, halaqa.id, 'Late')}
                                            style={{
                                                padding: '4px 12px',
                                                borderRadius: 'var(--radius-full)',
                                                border: '1px solid var(--color-accent)',
                                                backgroundColor: status === 'Late' ? 'var(--color-accent)' : 'transparent',
                                                color: status === 'Late' ? 'white' : 'var(--color-accent)',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Late
                                        </button>
                                        <button
                                            onClick={() => markAttendance(student.id, halaqa.id, 'Absent')}
                                            style={{
                                                padding: '4px 12px',
                                                borderRadius: 'var(--radius-full)',
                                                border: '1px solid var(--color-danger)',
                                                backgroundColor: status === 'Absent' ? 'var(--color-danger)' : 'transparent',
                                                color: status === 'Absent' ? 'white' : 'var(--color-danger)',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'evaluation' && (
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Dictation Evaluation</h3>
                    <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                        {students.map(student => {
                            const key = `${student.id}_${halaqa.id}`;
                            const studentEvaluations = evaluations[key] || [];

                            return (
                                <div key={student.id} style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{student.username}</span>
                                        <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>{studentEvaluations.length} evaluations</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                                        <div style={{
                                            width: 50,
                                            height: 50,
                                            background: 'var(--color-primary-light)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--color-primary)'
                                        }}>
                                            <Mic size={24} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 500, marginBottom: '4px' }}>Latest Submission: Surah Al-Fatiha</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: 'var(--spacing-sm)' }}>Submitted 2 hours ago</div>
                                            <audio controls style={{ width: '100%', height: '32px' }}>
                                                <source src="" type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-end' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Notes</label>
                                            <input
                                                type="text"
                                                placeholder="Feedback..."
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                                                onChange={(e) => setEvalNotes(e.target.value)}
                                            />
                                        </div>
                                        <div style={{ width: '80px' }}>
                                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Score</label>
                                            <input
                                                type="number"
                                                placeholder="/10"
                                                max="10"
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                                                onChange={(e) => setEvalScore(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                if (evalScore) {
                                                    evaluateStudent(student.id, halaqa.id, { score: evalScore, notes: evalNotes, type: 'dictation' });
                                                    alert('Evaluation saved!');
                                                }
                                            }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'rewards' && (
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Student Rewards Bank</h3>
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {students.map(student => {
                            const key = `${student.id}_${halaqa.id}`;
                            const studentProgress = progress[key] || { points: 0 };
                            const history = pointsHistory[key] || [];

                            return (
                                <div key={student.id} style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{student.username}</span>
                                            <span style={{
                                                background: 'var(--color-accent-light)',
                                                color: 'var(--color-accent)',
                                                padding: '4px 12px',
                                                borderRadius: 'var(--radius-full)',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <Award size={16} />
                                                {studentProgress.points} pts
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Reason</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Excellent Recitation"
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                                                onChange={(e) => setPointsReason(e.target.value)}
                                            />
                                        </div>
                                        <div style={{ width: '100px' }}>
                                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Points</label>
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                                                onChange={(e) => setPointsAmount(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                if (pointsAmount) {
                                                    addPoints(student.id, halaqa.id, parseInt(pointsAmount), pointsReason);
                                                    alert('Points added!');
                                                }
                                            }}
                                        >
                                            Add Points
                                        </button>
                                    </div>

                                    {history.length > 0 && (
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                                            <div style={{ fontWeight: 500, marginBottom: '4px' }}>Recent History:</div>
                                            {history.slice(-3).reverse().map((h, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                                                    <span>{h.reason || 'Bonus'}</span>
                                                    <span style={{ color: 'var(--color-success)' }}>+{h.amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            <Modal isOpen={isEditStudentOpen} onClose={() => setIsEditStudentOpen(false)} title="Edit Student Info">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    updateStudentInfo(selectedStudent.id, editForm);
                    setIsEditStudentOpen(false);
                }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.9rem' }}>Username</label>
                        <input
                            type="text"
                            value={editForm.username}
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            style={{ width: '100%', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.9rem' }}>Email</label>
                        <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            style={{ width: '100%', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
            </Modal>

            {/* Add Student Modal */}
            <Modal isOpen={isAddStudentOpen} onClose={() => setIsAddStudentOpen(false)} title="Add Student to Halaqa">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const result = addStudentToHalaqa(halaqa.id, addStudentIdentifier);
                    if (result.success) {
                        alert(result.message);
                        setAddStudentIdentifier('');
                        setIsAddStudentOpen(false);
                    } else {
                        alert(result.message);
                    }
                }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.9rem' }}>Username or Email</label>
                        <input
                            type="text"
                            value={addStudentIdentifier}
                            onChange={(e) => setAddStudentIdentifier(e.target.value)}
                            placeholder="Enter student's username or email"
                            style={{ width: '100%', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Student</button>
                </form>
            </Modal>
        </div>
    );
};

export default HalaqaTeacher;
