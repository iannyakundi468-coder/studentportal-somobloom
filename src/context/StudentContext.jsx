import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

const StudentContext = createContext(null);

// Keeping some mock structure for UI compatibility but will populate with real data
const INITIAL_UI_STATE = {
  courses: [],
  tasks: [],
  portfolio: [],
  marks: { rats: [], cats: [] },
  attendance: { present: 0, total: 0 },
  aiStudyEnabled: false
};

export function StudentProvider({ children }) {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('somobloom_token');
  const isAuthenticated = !!token;

  const fetchStudentData = useCallback(async () => {
    const activeToken = localStorage.getItem('somobloom_token');
    if (!activeToken) return;

    if (activeToken === 'mock_student_token') {
      const stored = localStorage.getItem('somobloom_user');
      if (stored) {
        setStudentData(JSON.parse(stored));
      }
      return;
    }

    setIsLoading(true);
    try {
      // Fetch profile
      const { profile } = await api.get('/student/me');
      
      // Fetch classes
      const { classes } = await api.get('/student/classes');
      
      // Fetch grades
      const { grades } = await api.get('/student/grades');

      setStudentData({
        ...profile,
        ...INITIAL_UI_STATE,
        courses: (classes || []).map(c => ({
          id: c.id,
          title: c.name,
          teacher: 'TBD',
          progress: 0
        })),
        tasks: [],
        marks: {
          rats: (grades || []).filter(g => g.assignmentTitle.includes('RAT')).map(g => g.score),
          cats: (grades || []).filter(g => g.assignmentTitle.includes('CAT')).map(g => g.score)
        }
      });
    } catch (err) {
      console.error('Failed to fetch student data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStudentData();
    } else {
      setStudentData(null);
    }
  }, [isAuthenticated, fetchStudentData]);

  const login = async (emailOrProfile, password) => {
    if (typeof emailOrProfile === 'object' && emailOrProfile !== null) {
      // Mock Login Mode
      const profileData = emailOrProfile;
      const newStudent = {
        id: 'STU-' + Math.floor(1000 + Math.random() * 9000),
        name: profileData.name || 'Student Name',
        email: profileData.email,
        phone: profileData.phone || '',
        grade: profileData.grade || '10th Grade',
        interests: profileData.interests || '',
        school: profileData.school || 'Somobloom High',
        avatarUrl: null,
        ...INITIAL_UI_STATE,
      };
      localStorage.setItem('somobloom_token', 'mock_student_token');
      localStorage.setItem('somobloom_user', JSON.stringify(newStudent));
      setStudentData(newStudent);
    } else {
      // Real backend mode
      setIsLoading(true);
      try {
        const email = emailOrProfile;
        const response = await api.post('/auth/login', { email, password, role: 'student' });
        localStorage.setItem('somobloom_token', response.token);
        await fetchStudentData();
      } catch (err) {
        console.error('Login failed:', err);
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  };

  const logout = () => {
    setStudentData(null);
    localStorage.removeItem('somobloom_token');
    localStorage.removeItem('somobloom_user');
  };

  const updateProfile = async (newData) => {
    // 1. Update local UI state immediately for responsive feedback
    setStudentData(prev => prev ? { ...prev, ...newData } : null);

    // 2. If real backend session, execute PUT /student/me to persist the changes (like avatarUrl) live!
    const activeToken = localStorage.getItem('somobloom_token');
    if (activeToken && activeToken !== 'mock_student_token') {
      try {
        await api.put('/student/me', {
          name: newData.name,
          avatarUrl: newData.avatarUrl
        });
      } catch (err) {
        console.error('Failed to save profile changes to backend:', err);
      }
    } else if (activeToken === 'mock_student_token') {
      // If mock session, update the local storage copy so it persists locally
      const stored = localStorage.getItem('somobloom_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('somobloom_user', JSON.stringify({ ...parsed, ...newData }));
      }
    }
  };

  const toggleTask = (taskId) => {
    setStudentData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      };
    });
  };

  const addMark = (type, value) => {
    setStudentData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        marks: {
          ...prev.marks,
          [type]: [...prev.marks[type], parseFloat(value)]
        }
      };
    });
  };

  const updateAttendance = (isPresent) => {
    setStudentData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        attendance: {
          present: isPresent ? prev.attendance.present + 1 : prev.attendance.present,
          total: prev.attendance.total + 1
        }
      };
    });
  };

  const toggleAiStudy = () => {
    setStudentData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        aiStudyEnabled: !prev.aiStudyEnabled
      };
    });
  };

  return (
    <StudentContext.Provider value={{ 
      studentData, 
      isAuthenticated, 
      isLoading,
      error,
      login, 
      logout, 
      updateProfile, 
      toggleTask,
      addMark,
      updateAttendance,
      toggleAiStudy,
      refreshData: fetchStudentData
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
