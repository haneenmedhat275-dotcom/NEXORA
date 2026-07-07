import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, Lock, LayoutList, MapPin, Info, Square, Mic, Camera, Loader2, AlertTriangle, RefreshCw } from 'lucide-react'
import { useUser } from '../context/UserContext'
import useBlockBrowserNavigation from '../hooks/useBlockBrowserNavigation'

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
const MAX_TIME = 240
const WARN_TIME = 210

const AI_TIPS = [
  'Focus on your educational background and how it connects to the role. Highlight 1–2 key projects that shaped your skills.',
  'Research the company beforehand. Mention specific aspects of their mission or products that resonate with you.',
  'Use the STAR method. Clearly describe the challenge, your role, the actions you took, and the measurable outcome.',
  'Share a real example where you prioritized tasks under pressure. Mention any tools or frameworks you use to stay organized.',
  'Show ambition but ground it in realism. Tie your goals to skills you want to build at this company.',
  'Choose an example where your contribution was clear. Emphasize communication and collaboration.',
  'Be honest but strategic. Frame your weakness as something you are actively working to improve.',
  'Pick a situation where you took initiative. Focus on how you motivated others and drove results.',
  'Mention specific resources: blogs, podcasts, conferences, or courses. Show genuine curiosity.',
  'Prepare 2–3 thoughtful questions that show you have done your research and care about the role.',
]

export default function InterviewRecording() {
  const navigate = useNavigate()
  const { saveInterviewResult } = useUser()
  useBlockBrowserNavigation()

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [timer, setTimer] = useState(0)
  const [totalTimer, setTotalTimer] = useState(0)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [interviewId, setInterviewId] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const [error, setError] = useState(null)
  const [fetchError, setFetchError] = useState(false)
  const [uploadRetry, setUploadRetry] = useState(null)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const videoRef = useRef(null)
  const timerRef = useRef(null)
  const totalTimerRef = useRef(null)
  const mountedRef = useRef(true)

  // 1. Fetch questions
  useEffect(() => {
    mountedRef.current = true
    const startInterview = async () => {
      const savedId = localStorage.getItem('interviewId')
      let token = localStorage.getItem('token')
      if (savedId) setInterviewId(savedId)
      try {
        if (!token) {
          throw new Error('No token')
        }
        const res = await fetch('/api/interviews/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ jobRole: 'Software Engineer', type: 'full_mock' }),
        })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        if (!mountedRef.current) return
        setQuestions((data.questions || []).map(q => q.text || q))
        setInterviewId(data.interviewId || savedId)
        if (data.interviewId) localStorage.setItem('interviewId', data.interviewId)
        totalTimerRef.current = setInterval(() => setTotalTimer(prev => prev + 1), 1000)
      } catch {
        if (!mountedRef.current) return
        setFetchError(true)
        if (!savedId) {
          setQuestions([
            'Tell me about yourself and your background.',
            'Why are you interested in this position?',
            'Describe a challenging project you worked on.',
            'How do you handle tight deadlines and pressure?',
            'Where do you see yourself in 5 years?',
            'Tell me about a time you worked in a team.',
            'What is your greatest strength and weakness?',
            'Describe a situation where you showed leadership.',
            'How do you stay updated with industry trends?',
            'Do you have any questions for us?',
          ])
        }
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    }
    startInterview()
    return () => { mountedRef.current = false }
  }, [])

  // 2. Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000)
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRecording])

  // 3. Auto-stop at 4 min + warning at 3:30
  useEffect(() => {
    if (timer >= MAX_TIME && isRecording) handleNextQuestion()
    if (timer >= WARN_TIME && isRecording) setShowWarning(true)
  }, [timer, isRecording])

  // Cleanup: stop camera/mic + totalTimer when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
      if (totalTimerRef.current) { clearInterval(totalTimerRef.current); totalTimerRef.current = null }
    }
  }, [])

  // 4. Start recording
  const startRecording = async () => {
    try {
      setError(null)
      setShowWarning(false)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream

      audioChunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      setTimer(0)
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please allow microphone permissions in your browser settings and try again.')
      } else {
        setError('Failed to access microphone/camera. Please check your devices.')
      }
    }
  }

  // Extract waveform from audio blob for visualization
  const extractWaveform = async (blob, samples = 40) => {
    try {
      const arrayBuffer = await blob.arrayBuffer()
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
      const channel = audioBuffer.getChannelData(0)
      const step = Math.floor(channel.length / samples)
      const result = []
      for (let i = 0; i < samples; i++) {
        let sum = 0
        for (let j = 0; j < step; j++) sum += Math.abs(channel[i * step + j] || 0)
        result.push(Math.min(1, sum / step * 3))
      }
      ctx.close()
      return result
    } catch { return [] }
  }

  // 5. Stop recording → returns blob + waveform
  const stopRecording = () => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current
      if (!recorder || recorder.state === 'inactive') {
        if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
        setIsRecording(false)
        resolve(null)
        return
      }

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
        setIsRecording(false)
        const waveform = await extractWaveform(blob)
        resolve({ blob, waveform })
      }
      recorder.stop()
    })
  }

  // 6. Upload answer
  const uploadAnswer = async (audioBlob, questionIdx) => {
    setUploadRetry(null)
    setUploading(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('audio', audioBlob, `answer_${questionIdx + 1}.webm`)
      formData.append('interviewId', interviewId || '')
      formData.append('questionIndex', questionIdx)

      const res = await fetch('/api/answers', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      return await res.json()
    } catch {
      const key = `answer_backup_${interviewId}_${questionIdx}`
      try { localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), size: audioBlob.size })) } catch {}
      setUploadRetry(questionIdx)
      return null
    } finally {
      setUploading(false)
    }
  }

  const finishInterview = () => {
    if (totalTimerRef.current) { clearInterval(totalTimerRef.current); totalTimerRef.current = null }
    const token = localStorage.getItem('token')
    const id = interviewId
    localStorage.removeItem('interviewId')

    // Navigate immediately
    navigate(`/reports/${id}`)

    // Background: complete interview, calculate results, save data
    fetch(`/api/interviews/${id}/complete`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    }).catch(() => {})

    fetch(`/api/results/calculate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ interviewId: id }),
    })
    .then(r => r.json().catch(() => ({})))
    .then(resultData => {
      fetch(`/api/answers/interview/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      .then(r => r.json().catch(() => []))
      .then(answers => {
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
        saveInterviewResult({
          interviewId: id,
          overallScore: pct,
          technicalScore: technical,
          communicationScore: Math.round(personal * 0.6),
          confidenceScore: Math.round(personal * 0.25),
          stressScore: Math.round(personal * 0.15),
          questions,
          overallAssessment: resultData.feedback || '',
          recommendedTrack: resultData.recommendedTrack || '',
        })
      })
      .catch(() => {})
    })
    .catch(() => {})
  }

  // 7. Next question handler
  const handleNextQuestion = async () => {
    const result = await stopRecording()
    if (result && result.blob && questions[currentIndex]) {
      uploadAnswer(result.blob, currentIndex)
    }
    setAnswers(prev => {
      const u = [...prev]
      u[currentIndex] = result || null
      return u
    })

    if (currentIndex >= questions.length - 1) {
      finishInterview()
      return
    }

    setCurrentIndex(prev => prev + 1)
    setTimer(0)
    audioChunksRef.current = []
    setShowWarning(false)
    await startRecording()
  }

  const currentQuestion = questions[currentIndex] || ''
  const progressPct = Math.min(100, (timer / MAX_TIME) * 100)
  const isLastQuestion = currentIndex >= questions.length - 1

  // Loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F0EFF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <Loader2 size={40} color="#7C3AED" style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ color: '#6B7280', fontSize: 14 }}>Preparing your interview...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Fetch error state
  if (fetchError && questions.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#F0EFF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <AlertTriangle size={40} color="#F59E0B" />
        <span style={{ color: '#111115', fontSize: 16 }}>Failed to load interview questions.</span>
        <button onClick={() => window.location.reload()} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', color: '#fff', border: 'none',
          borderRadius: 999, padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0EFF8', fontFamily: 'Inter, system-ui, sans-serif' }}>

     

      {/* HEADER */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 32px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <span style={{
          background: 'linear-gradient(90deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', fontWeight: 700, fontSize: 18, letterSpacing: '0.03em',
        }}>NEXORA</span>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#F4F3FB', border: '1px solid #a28d8d',
          borderRadius: 999, padding: '6px 16px',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: isRecording ? '#EF4444' : '#22C55E',
            animation: isRecording ? 'pulse 1.4s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#111115' }}>⏱ {formatTime(totalTimer)}</span>
        </div>

        <button
          onClick={async () => {
            await stopRecording()
            if (interviewId) {
              finishInterview()
            } else {
              navigate('/dashboard')
            }
          }}
          style={{
            background: 'linear-gradient( #3A1078, #4C3FC4)',
            color: '#FFFFFF', border: 'none', borderRadius: 999,
            padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(76,63,196,0.35)', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(76,63,196,0.45)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(76,63,196,0.35)' }}
        >
          Finish Interview
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>

        {/* Error banner */}
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
            padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center',
            gap: 8, color: '#B91C1C', fontSize: 13,
          }}>
            <AlertTriangle size={16} />
            <span style={{ flex: 1 }}>{error}</span>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C', fontWeight: 600, fontSize: 12 }}>Dismiss</button>
          </div>
        )}

        {/* Warning banner */}
        {showWarning && (
          <div style={{
            marginBottom: 16, padding: '8px 16px',
            background: '#FFFBEB', border: '1px solid #FDE68A',
            borderRadius: 10, color: '#92400E', fontSize: 12,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <AlertTriangle size={14} color="#F59E0B" />
            30 seconds remaining — recording will stop automatically.
          </div>
        )}

        {/* TWO-COLUMN LAYOUT */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>

          {/* ═══ LEFT COLUMN (60%) ═══ */}
          <div style={{ flex: '3', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* VIDEO CARD */}
            <div style={{
              background: '#FFFFFF', borderRadius: 16, padding: 16,
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                borderRadius: 12, overflow: 'hidden', aspectRatio: '2/1',
                background: '#1A1020', position: 'relative',
              }}>
                <video ref={videoRef} autoPlay muted playsInline style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  display: isRecording ? 'block' : 'none',
                }} />
                {!isRecording && (
                  <div style={{
                    width: '100%', height: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'radial-gradient(circle at 50% 40%, #2a1a3a, #1A1020)',
                  }}>
                    <Camera size={48} color="#4B5563" />
                  </div>
                )}
                {isRecording && (
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    background: '#000000', borderRadius: 999,
                    padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.4s ease-in-out infinite' }} />
                    <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>REC</span>
                  </div>
                )}
              </div>

              {/* Timer bar */}
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>Answer time</span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>{formatTime(timer)} / 4:00</span>
              </div>
              <div style={{ height: 3, borderRadius: 999, background: '#E5E3FA', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  background: timer >= WARN_TIME ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : 'linear-gradient(90deg, #7C3AED, #4F46E5)',
                  width: `${progressPct}%`, transition: 'width 1s linear',
                }} />
              </div>

              {/* Buttons */}
              <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                {isRecording ? (
                  <button onClick={async () => {
                    const result = await stopRecording()
                    audioChunksRef.current = []
                    setShowWarning(false)
                    if (result && result.blob && questions[currentIndex]) {
                      uploadAnswer(result.blob, currentIndex)
                    }
                  }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: '#FEECEC', border: 'none', borderRadius: 9,
                      padding: '11px 20px', color: '#DC2626', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#FDD5D5' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#FEECEC' }}
                  >
                    <Square size={14} /> Stop Recording
                  </button>
                ) : (
                  <button onClick={startRecording}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: 'linear-gradient(135deg, #ed3a3a, #e54646)', border: 'none', borderRadius: 9,
                      padding: '11px 20px', color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <Mic size={14} /> Start Recording
                  </button>
                )}
                <button
                  onClick={handleNextQuestion}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: '#151111', border: 'none', borderRadius: 9,
                    padding: '11px 20px', color: '#FFFFFF', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#8c00ff' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#151111' }}
                >
                  {isLastQuestion ? 'Finish & Submit' : <>Next Question <ArrowRight size={15} /></>}
                </button>
              </div>

              {/* Upload retry */}
              {uploadRetry !== null && uploadRetry === currentIndex && (
                <div style={{
                  marginTop: 10, padding: '8px 12px', background: '#FFFBEB', border: '1px solid #FDE68A',
                  borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#92400E',
                }}>
                  <AlertTriangle size={14} />
                  <span style={{ flex: 1 }}>Upload failed. Saved locally.</span>
                  <button onClick={async () => { const a = answers[currentIndex]; if (a && a.blob) await uploadAnswer(a.blob, currentIndex) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', border: '1px solid #92400E', borderRadius: 6, padding: '3px 8px', color: '#92400E', fontSize: 11, cursor: 'pointer' }}>
                    <RefreshCw size={12} /> Retry
                  </button>
                </div>
              )}
            </div>

            {/* TIMELINE */}
            <div style={{
              background: '#FFFFFF', borderRadius: 16, padding: '20px 24px',
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <LayoutList size={16} color="#3C3489" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111115' }}>Interview Timeline</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {questions.map((q, idx) => {
                  const isCompleted = idx < currentIndex || (idx === currentIndex && answers[idx] != null)
                  const isCurrent = idx === currentIndex
                  return (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '7px 12px', borderRadius: 8,
                      background: isCurrent ? '#EEEDFE' : 'transparent',
                    }}>
                      {isCompleted ? <CheckCircle size={16} color="#22C55E" strokeWidth={2} />
                        : isCurrent ? (
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#3C3489', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="#FFFFFF"><polygon points="8,5 19,12 8,19" /></svg>
                          </div>
                        ) : <Lock size={14} color="#D1D5DB" />}
                      <span style={{
                        fontSize: 13,
                        color: isCompleted ? '#6B7280' : isCurrent ? '#3C3489' : '#D1D5DB',
                        fontWeight: isCurrent ? 600 : 400,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        <span style={{ fontWeight: 700, marginRight: 6 }}>Q{idx + 1}:</span>
                        {q.length > 50 ? q.slice(0, 50) + '...' : q}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ═══ RIGHT COLUMN (40%) ═══ */}
          <div style={{ flex: '2' }}>
            <div style={{
              background: '#FFFFFF', borderRadius: 16, padding: 28,
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.06em', marginBottom: 10 }}>
                Q{currentIndex + 1} OF {questions.length || 10}
              </div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#111115', lineHeight: 1.45, margin: '0 0 20px' }}>
                <span style={{ color: '#3C3489', marginRight: 8 }}>Q{currentIndex + 1}:</span>
                {currentQuestion || `Question ${currentIndex + 1}`}
              </p>

              {/* AI TIP */}
              <div style={{
                background: '#F5F4FD', borderRadius: 12, padding: '14px 16px',
                marginBottom: 20, border: '1px solid #E8E5FA',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <MapPin size={13} color="#7C3AED" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.08em' }}>AI PREPARATION TIP</span>
                </div>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.65, margin: 0 }}>
                  {AI_TIPS[currentIndex] || 'Think carefully about your answer and provide specific examples.'}
                </p>
              </div>

              <div style={{ height: 1, background: '#F0EFF8', margin: '20px 0' }} />

              {/* Recording Sessions */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111115' }}>Recording Sessions</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>You can record up to 2 takes per question.</div>
                  </div>
                  <span style={{
                    background: '#EEEDFE', borderRadius: 999, padding: '4px 12px',
                    fontSize: 11, fontWeight: 600, color: '#3C3489', whiteSpace: 'nowrap',
                  }}>
                    {answers.filter(Boolean).length} of {questions.length || 10} Recorded
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                  {questions.map((_, idx) => {
                    if (idx < currentIndex && answers[idx]) {
                      return (
                        <div key={idx} style={{
                          borderRadius: 12, overflow: 'hidden', border: '1px solid #E8E5F5',
                          width: 80, height: 80, position: 'relative',
                          background: '#F9F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Mic size={24} color="#3C3489" />
                          <div style={{
                            position: 'absolute', top: 6, left: 6,
                            background: '#2D2560', color: '#FFFFFF',
                            fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 999,
                          }}>
                            Q{idx + 1}
                          </div>
                        </div>
                      )
                    }
                    if (idx === currentIndex) {
                      if (answers[idx]) {
                        return (
                          <div key={idx} style={{
                            borderRadius: 12, overflow: 'hidden', border: '1px solid #E8E5F5',
                            width: 80, height: 80, position: 'relative',
                            background: '#F9F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Mic size={24} color="#3C3489" />
                            <div style={{
                              position: 'absolute', top: 6, left: 6,
                              background: '#2D2560', color: '#FFFFFF',
                              fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 999,
                            }}>
                              Q{idx + 1}
                            </div>
                          </div>
                        )
                      }
                      if (isRecording) {
                        return (
                          <div key={idx} style={{
                            borderRadius: 12, border: '1.5px solid #EF4444',
                            width: 80, height: 80, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 4,
                            background: '#FEF2F2',
                          }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.4s ease-in-out infinite' }} />
                            <span style={{ color: '#EF4444', fontSize: 8, fontWeight: 700 }}>REC</span>
                          </div>
                        )
                      }
                      return (
                        <div key={idx}
                          onClick={startRecording}
                          style={{
                            borderRadius: 12, border: '1.5px dashed #C4B5FD',
                            width: 80, height: 80, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 4,
                            cursor: 'pointer', background: '#FAFAFF',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#9B8FE8'; e.currentTarget.style.background = '#F4F2FF' }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C4B5FD'; e.currentTarget.style.background = '#FAFAFF' }}
                        >
                          <Mic size={16} color="#7C3AED" />
                          <span style={{ color: '#3C3489', fontSize: 8, fontWeight: 600 }}>Record</span>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>

                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  padding: '10px 12px', background: '#F9FAFB', borderRadius: 10,
                  marginTop: 14,
                }}>
                  <Info size={13} color="#9CA3AF" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.55 }}>
                    Your most recent take is automatically saved. Previous takes are overwritten when you start a new one.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}