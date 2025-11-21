import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

// Mock Data
const MOCK_USERS = [
    { id: 1, username: 'teacher1', email: 'teacher@ihsan.com', password: 'password', role: 'user' },
    { id: 2, username: 'student1', email: 'student@ihsan.com', password: 'password', role: 'user' },
    { id: 3, username: 'Ahmed Ali', email: 'ahmed@ihsan.com', password: 'password', role: 'user' },
    { id: 4, username: 'Fatima Omar', email: 'fatima@ihsan.com', password: 'password', role: 'user' }
];

const MOCK_HALAQAS = [
    {
        id: 1,
        name: 'Fajr Reflections',
        description: 'Daily morning tafsir.',
        teacherId: 1,
        teacherName: 'teacher1',
        code: 'FAJR123',
        students: [2, 3, 4], // student1, Ahmed, Fatima joined
        isLive: false
    },
    {
        id: 2,
        name: 'Tajweed Mastery',
        description: 'Advanced Tajweed rules.',
        teacherId: 1,
        teacherName: 'teacher1',
        code: 'TAJ999',
        students: [],
        isLive: true
    }
];

export const AppContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState(MOCK_USERS);
    const [halaqas, setHalaqas] = useState(MOCK_HALAQAS);
    const [chatHistory, setChatHistory] = useState([]);
    const [progress, setProgress] = useState({
        '2_1': { pages: 10, points: 100 },
        '3_1': { pages: 5, points: 50 },
        '4_1': { pages: 2, points: 20 }
    }); // { studentId_halaqaId: { pages: 0, points: 0 } }
    const [attendance, setAttendance] = useState({}); // { studentId_halaqaId: [{ date: '...', status: 'Present' }] }

    const [evaluations, setEvaluations] = useState({}); // { studentId_halaqaId: [{ date, score, notes, type }] }
    const [pointsHistory, setPointsHistory] = useState({}); // { studentId_halaqaId: [{ date, amount, reason }] }

    // Persist login
    useEffect(() => {
        const storedUser = localStorage.getItem('ihsan_user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (username, password) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('ihsan_user', JSON.stringify(user));
            return { success: true };
        }
        return { success: false, message: 'Invalid credentials' };
    };

    const register = (username, email, password) => {
        if (users.find(u => u.username === username)) {
            return { success: false, message: 'Username taken' };
        }
        const newUser = { id: Date.now(), username, email, password, role: 'user' };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        localStorage.setItem('ihsan_user', JSON.stringify(newUser));
        return { success: true };
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('ihsan_user');
    };

    const updateProfile = (userId, updates) => {
        const updatedUsers = users.map(u => u.id === userId ? { ...u, ...updates } : u);
        setUsers(updatedUsers);

        // Update current user if it's them
        if (currentUser.id === userId) {
            const updatedUser = { ...currentUser, ...updates };
            setCurrentUser(updatedUser);
            localStorage.setItem('ihsan_user', JSON.stringify(updatedUser));
        }
        return { success: true };
    };

    const changePassword = (userId, currentPassword, newPassword) => {
        const user = users.find(u => u.id === userId);
        if (user.password !== currentPassword) {
            return { success: false, message: 'Incorrect current password' };
        }

        updateProfile(userId, { password: newPassword });
        return { success: true };
    };

    const deleteAccount = (userId) => {
        setUsers(users.filter(u => u.id !== userId));
        if (currentUser.id === userId) {
            logout();
        }
        return { success: true };
    };

    const updateStudentInfo = (studentId, newInfo) => {
        updateProfile(studentId, newInfo);
    };

    const createHalaqa = (name, description) => {
        const newHalaqa = {
            id: Date.now(),
            name,
            description,
            teacherId: currentUser.id,
            teacherName: currentUser.username,
            code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            students: [],
            isLive: false
        };
        setHalaqas([...halaqas, newHalaqa]);
        return newHalaqa;
    };

    const joinHalaqa = (code) => {
        const halaqa = halaqas.find(h => h.code === code);
        if (!halaqa) return { success: false, message: 'Invalid code' };
        if (halaqa.teacherId === currentUser.id) return { success: false, message: 'You are the teacher' };
        if (halaqa.students.includes(currentUser.id)) return { success: false, message: 'Already joined' };

        const updatedHalaqas = halaqas.map(h => {
            if (h.id === halaqa.id) {
                return { ...h, students: [...h.students, currentUser.id] };
            }
            return h;
        });
        setHalaqas(updatedHalaqas);
        return { success: true };
    };

    const toggleLiveSession = (halaqaId, isLive) => {
        setHalaqas(halaqas.map(h => h.id === halaqaId ? { ...h, isLive } : h));
    };

    const addStudentToHalaqa = (halaqaId, identifier) => {
        const user = users.find(u => u.username === identifier || u.email === identifier);
        if (!user) return { success: false, message: 'User not found' };

        const halaqa = halaqas.find(h => h.id === halaqaId);
        if (!halaqa) return { success: false, message: 'Halaqa not found' };

        if (halaqa.students.includes(user.id)) return { success: false, message: 'Student already in Halaqa' };
        if (halaqa.teacherId === user.id) return { success: false, message: 'Cannot add teacher as student' };

        const updatedHalaqas = halaqas.map(h => {
            if (h.id === halaqaId) {
                return { ...h, students: [...h.students, user.id] };
            }
            return h;
        });
        setHalaqas(updatedHalaqas);
        return { success: true, message: 'Student added successfully' };
    };

    const updateProgress = (studentId, halaqaId, pages, points) => {
        const key = `${studentId}_${halaqaId}`;
        setProgress(prev => ({
            ...prev,
            [key]: { pages, points }
        }));
    };

    const addPoints = (studentId, halaqaId, amount, reason) => {
        const key = `${studentId}_${halaqaId}`;
        const currentProgress = progress[key] || { pages: 0, points: 0 };
        const newPoints = (currentProgress.points || 0) + amount;

        updateProgress(studentId, halaqaId, currentProgress.pages, newPoints);

        setPointsHistory(prev => {
            const current = prev[key] || [];
            return {
                ...prev,
                [key]: [...current, { date: new Date().toISOString(), amount, reason }]
            };
        });
    };

    const evaluateStudent = (studentId, halaqaId, evaluationData) => {
        const key = `${studentId}_${halaqaId}`;
        setEvaluations(prev => {
            const current = prev[key] || [];
            return {
                ...prev,
                [key]: [...current, { date: new Date().toISOString(), ...evaluationData }]
            };
        });
    };

    const markAttendance = (studentId, halaqaId, status) => {
        const key = `${studentId}_${halaqaId}`;
        const today = new Date().toISOString().split('T')[0];
        setAttendance(prev => {
            const current = prev[key] || [];
            // Avoid duplicate for same day
            const filtered = current.filter(r => r.date !== today);
            return {
                ...prev,
                [key]: [...filtered, { date: today, status }]
            };
        });
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            users,
            halaqas,
            chatHistory,
            progress,
            attendance,
            evaluations,
            pointsHistory,
            login,
            register,
            logout,
            updateStudentInfo,
            updateProfile,
            changePassword,
            deleteAccount,
            createHalaqa,
            joinHalaqa,
            addStudentToHalaqa,
            toggleLiveSession,
            setChatHistory,
            updateProgress,
            addPoints,
            evaluateStudent,
            markAttendance
        }}>
            {children}
        </AppContext.Provider>
    );
};
