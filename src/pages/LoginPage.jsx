import { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GraduationCap, User, Mail, Phone, BookOpen, School, ArrowRight } from 'lucide-react';

const onboardingSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  grade: z.string().min(1, 'Please select your grade'),
  school: z.string().min(2, 'School name must be at least 2 characters'),
  interests: z.string().optional(),
});

const gradeOptions = ['9th Grade', '10th Grade', '11th Grade', '12th Grade'];

export default function LoginPage() {
  const { login: studentLogin } = useStudent();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isStudentSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { grade: '' },
  });

  const onSubmitStudent = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        studentLogin(data);
        navigate('/student');
        resolve();
      }, 800);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden text-slate-900">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-2xl">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl mb-6 rotate-3">
            <GraduationCap className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Somobloom <span className="text-blue-600">Portal</span>
          </h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          <form onSubmit={handleSubmit(onSubmitStudent)} className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Student Onboarding</h2>
              <p className="text-slate-500 text-sm">Welcome! Let's get your portal ready.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User size={14} /> Full Name
                </label>
                <input
                  {...register('name')}
                  placeholder="Alex Johnson"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail size={14} /> Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="alex@school.edu"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <School size={14} /> School
                </label>
                <input
                  {...register('school')}
                  placeholder="Somobloom School"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Phone size={14} /> Phone
                </label>
                <input
                  {...register('phone')}
                  placeholder="Optional"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <BookOpen size={14} /> Grade Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {gradeOptions.map(g => (
                  <label key={g} className={`flex items-center justify-center px-3 py-2 rounded-xl border cursor-pointer transition-all text-xs font-bold ${watch('grade') === g ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                    <input type="radio" {...register('grade')} value={g} className="sr-only" />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <button disabled={isStudentSubmitting} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all">
              {isStudentSubmitting ? 'Entering...' : <>Enter Student Portal <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8">
          Somobloom School Management System • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
