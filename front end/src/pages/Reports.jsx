import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar, Clock, TrendingUp, Download, ChevronDown,
  FileText, Target, Award, Mic, Loader2,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import AppSidebar from '../components/AppSidebar';
import Navbar from '../components/Navbar';

export default function Reports() {
  const { interviewId } = useParams()
  const { getInterviewResult, saveInterviewResult } = useUser();
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(getInterviewResult())

  useEffect(() => {
    const r = getInterviewResult()
    if (r && r.interviewId === interviewId && r.questions?.length) {
      setResult(r)
      return
    }
    setLoading(true)
    const token = localStorage.getItem('token')
    Promise.all([
      fetch(`/api/results/calculate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId }),
      }).then(r => r.json().catch(() => ({}))),
      fetch(`/api/answers/interview/${interviewId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(r => r.json().catch(() => [])),
    ])
    .then(([resultData, answers]) => {
      const questions = (answers || []).map((a, i) => {
        const q = a.question || {}
        const fb = a.aiFeedback || {}
        const scoreNum = fb.score || 0
        return {
          id: `Q${i + 1}`,
          text: q.text || '',
          score: `${scoreNum}/10`,
          scoreBg: scoreNum >= 7 ? '#DCFCE7' : scoreNum >= 4 ? '#FEF3C7' : '#FEE2E2',
          scoreColor: scoreNum >= 7 ? '#166534' : scoreNum >= 4 ? '#92400E' : '#991B1B',
          answer: a.answerText || '',
          strengths: fb.strengths || [],
          improvements: fb.weaknesses || [],
          fillers: [],
          modelAnswer: q.modelAnswer || '',
        }
      })
      const totalScore = resultData.totalScore || 0
      const maxScore = resultData.maxScore || questions.length * 10
      const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
      const technical = resultData.technicalScore || 0
      const personal = resultData.personalScore || 0
      const newResult = {
        interviewId,
        overallScore: pct,
        technicalScore: technical,
        communicationScore: Math.round(personal * 0.6),
        confidenceScore: Math.round(personal * 0.25),
        stressScore: Math.round(personal * 0.15),
        questions,
        overallAssessment: resultData.feedback || '',
        recommendedTrack: resultData.recommendedTrack || '',
      }
      saveInterviewResult(newResult)
      setResult(newResult)
    })
    .catch(() => {})
    .finally(() => setLoading(false))
  }, [interviewId])

  const qs = result?.questions || [];
  const avgScore = result?.overallScore ?? result?.score ?? 0;
  const totalStrengths = qs.reduce((sum, q) => sum + (q.strengths?.length || 0), 0);
  const totalFillers = qs.reduce((sum, q) => sum + (q.fillers || []).reduce((a, f) => a + (f.count || 0), 0), 0);

  const stats = [
    { label: 'QUESTIONS', value: String(qs.length || 0), color: '#07060F', icon: FileText },
    { label: 'AVG SCORE', value: qs.length ? `${avgScore}%` : '—', color: '#059669', icon: Target },
    { label: 'STRENGTHS', value: String(totalStrengths || 0), color: '#059669', icon: Award },
    { label: 'FILLER WORDS', value: String(totalFillers || 0), color: '#D97706', icon: Mic },
  ];

  const questions = qs;

  const [openId, setOpenId] = useState(null);
  const [activeTab, setActiveTab] = useState('technical');

  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ background: '#EEEEF8' }}>
        <AppSidebar />
        <div className="flex-1" style={{ marginLeft: 240 }}>
          <Navbar />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <Loader2 size={32} color="#7C3AED" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#EEEEF8' }}>
      <AppSidebar />
      <div className="flex-1" style={{ marginLeft: 240 }}>
        <Navbar />
        <main className="p-6">
          {/* Header card */}
          <div className="bg-white rounded-xl p-6 mb-6" style={{ border: '1px solid #E4E4E8' }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold" style={{ color: '#07060F' }}>
                  Mock Interview Report
                </h1>
                <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#717177' }}>
                  {result && <>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {qs.length} Questions
                    </span>
                    <span className="flex items-center gap-1.5 font-medium" style={{ color: '#7661DF' }}>
                      <TrendingUp size={13} />
                      Overall Readiness: {avgScore}%
                    </span>
                  </>}
                </div>
              </div>
              {questions.length > 0 && (
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-all duration-150 cursor-pointer shrink-0"
                  style={{ backgroundColor: '#3A1078' }}
                >
                  <Download size={16} />
                  Download PDF Report
                </button>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="bg-white rounded-xl p-4"
                  style={{ border: '1px solid #E4E4E8' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] uppercase tracking-wide font-medium" style={{ color: '#9E9EB0' }}>
                      {s.label}
                    </p>
                    <Icon size={18} color="#7C3AED" />
                  </div>
                  <p className="text-2xl font-bold" style={{ color: s.color }}>
                    {s.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab('technical')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                activeTab === 'technical' ? 'bg-violet-50' : 'hover:bg-gray-50'
              }`}
              style={{ color: activeTab === 'technical' ? '#3A1078' : '#717177' }}
            >
              Technical Questions
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100" style={{ color: '#717177' }}>
                {questions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('behavioral')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                activeTab === 'behavioral' ? 'bg-violet-50' : 'hover:bg-gray-50'
              }`}
              style={{ color: activeTab === 'behavioral' ? '#3A1078' : '#717177' }}
            >
              Behavioral & HR Questions
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100" style={{ color: '#717177' }}>
                0
              </span>
            </button>
          </div>

          {/* Questions list */}
          <div className="flex flex-col gap-4 mb-6">
           {questions.length === 0 ? (
             <div className="bg-white rounded-xl p-8 text-center" style={{ border: '1px solid #E4E4E8', color: '#9E9EB0' }}>
               No interview results yet. Complete an interview to see your report.
             </div>
           ) : questions.map((q) => {
           const isOpen = openId === q.id;
           return (
             <div
            key={q.id}
            className="bg-white rounded-xl transition-all duration-200"
            style={{
              border: '1px solid #b3b3b8',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0px 4px 4px 0px rgba(58, 16, 120, 0.36)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : q.id)}
                    className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="rounded-md text-xs font-semibold px-2 py-1 shrink-0"
                        style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}
                      >
                        {q.id}
                      </span>
                      <span className="text-sm" style={{ color: '#1F2937' }}>
                        {q.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="rounded-full text-xs font-semibold px-3 py-1"
                        style={{ backgroundColor: q.scoreBg, color: q.scoreColor }}
                      >
                        {q.score}
                      </span>
                      <ChevronDown
                        size={16}
                        style={{ color: '#9E9EB0' }}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>
                  <div
      className={`overflow-hidden transition-all duration-500 ${
        isOpen ? "max-h-[1000px]" : "max-h-0"
      }`}
    >
      <div className="border-t border-[#E4E4E8] p-5">

        <p className="text-sm text-[#717177] leading-7">
          {q.answer}
        </p>

        <div className="grid md:grid-cols-2 gap-5 mt-6">

          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="font-semibold text-green-700 mb-4">
              ✅ Core Strengths
            </h3>

            <ul className="space-y-2 text-sm list-disc pl-5">
              {(q.strengths || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
            <h3 className="font-semibold text-orange-700 mb-4">
              ⚡ Areas to Refine
            </h3>

            <ul className="space-y-2 text-sm list-disc pl-5">
              {(q.improvements || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <div className="mt-5">
              <p className="text-xs font-semibold mb-2">
                Filler Words Detected
              </p>

              <div className="flex gap-2 flex-wrap">
                {(q.fillers || []).map((item, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs"
                  >
                    "{item.word}" × {item.count}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {q.modelAnswer && (
          <button className="mt-6 text-[#7661DF] font-medium hover:underline">
            View AI Suggested Model Answer (STAR Method)
          </button>
        )}

      </div>
    </div>
                </div>
              );
            })}
          </div>

          {result?.overallAssessment && (
            <div
              className="rounded-xl p-6 text-white"
              style={{ background: 'linear-gradient(135deg, #2E0F5E 0%, #170630 100%)' }}
            >
              <h3 className="font-semibold text-base mb-2">Overall Assessment</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#D8D2E8' }}>
                {result.overallAssessment}
              </p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media print {
          nav, aside, .sidebar, button { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
