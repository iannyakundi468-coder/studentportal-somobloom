import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, GraduationCap, BookOpen, Users, Menu, X, ChevronDown, Bell, FolderGit2, Bot } from 'lucide-react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useTeacher } from '../context/TeacherContext';
import { useStudent } from '../context/StudentContext';
import GlobalAiAssistant from '../components/ai/GlobalAiAssistant';

export default function PortalLayout({ role }) {
  const { teacherData, logout: teacherLogout } = useTeacher();
  const { studentData, logout: studentLogout } = useStudent();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const isTeacher = role === 'teacher';

  const navItems = isTeacher ? [
    { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teacher/classes', label: 'My Classes', icon: Users },
    { to: '/teacher/portfolio', label: 'Portfolio Manager', icon: BookOpen },
    { to: '/teacher/profile', label: 'Settings', icon: User },
  ] : [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/portfolio', label: 'Portfolio', icon: FolderGit2 },
    { to: '/student/ai-study', label: 'AI Study Center', icon: Bot },
    { to: '/student/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    if (isTeacher) teacherLogout();
    else studentLogout();
    navigate('/');
  };

  const userData = isTeacher ? teacherData : studentData;

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {!isTeacher && <GlobalAiAssistant />}
      
      {/* Sidebar - Hidden on mobile for students */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-600 border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${!isTeacher && 'hidden md:flex'} 
      `}>
        <div className="h-full flex flex-col">
          {/* Brand */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className={`w-8 h-8 ${isTeacher ? 'bg-indigo-600' : 'bg-yellow-400'} rounded flex items-center justify-center shadow-sm`}>
              <GraduationCap size={20} className={isTeacher ? "text-white" : "text-slate-900"} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Somobloom</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isTeacher ? 'Teacher Menu' : 'Student Menu'}
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === (isTeacher ? '/teacher' : '/student')}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? isTeacher ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'
                      : 'hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Bottom Section */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-600 overflow-hidden border border-slate-200">
                {userData?.avatarUrl ? (
                  <img src={userData.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  userData?.name?.charAt(0) || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{userData?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{isTeacher ? userData?.school : userData?.grade}</p>
              </div>
              <button onClick={handleLogout} className="text-slate-400 group-hover:text-red-500 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/30">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-30">
          
          {/* Mobile Left Section */}
          <div className="flex items-center gap-2 md:hidden">
            {isTeacher ? (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500">
                <Menu size={20} />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center shadow-sm">
                  <GraduationCap size={20} className="text-slate-900" />
                </div>
                <span className="font-bold text-slate-900 tracking-tight">Somobloom</span>
              </div>
            )}
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">{isTeacher ? 'Teacher' : 'Student'}</span>
          </div>

          <div className="flex items-center gap-3 md:gap-4 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-[10px] font-bold text-indigo-600 uppercase">Clear All</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {(isTeacher ? [
                    { id: 1, title: 'New Submission', text: 'Sarah Smith submitted a portfolio item.', time: '10m ago' },
                    { id: 2, title: 'Attendance Reminder', text: 'Grade 4 Science attendance is pending.', time: '1h ago' },
                  ] : [
                    { id: 1, title: 'Assignment Due', text: 'Math homework is due today.', time: '2h ago' },
                    { id: 2, title: 'New Badge!', text: 'You earned the "Fast Learner" badge.', time: '5h ago' },
                  ]).map(n => (
                    <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer text-left">
                      <p className="text-sm font-bold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">{userData?.name}</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                {userData?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className={`flex-1 overflow-auto p-4 md:p-8 ${!isTeacher ? 'pb-24 md:pb-8' : ''}`}>
          <div className="max-w-6xl mx-auto h-full">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>

        {/* Mobile Sidebar Overlay (Teacher Only) */}
        {isSidebarOpen && isTeacher && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Bottom Navigation (Student Only) */}
        {!isTeacher && (
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around items-center pb-safe">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/student'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-2 flex-1 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'
                  }`
                }
              >
                <item.icon size={20} className={`mb-1 ${({isActive}) => isActive ? 'text-blue-600' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
