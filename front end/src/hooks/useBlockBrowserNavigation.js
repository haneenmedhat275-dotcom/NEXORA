import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * useBlockBrowserNavigation
 * ==========================
 *
 * يمنع المستخدم من الرجوع للتلف أو التقدم للأمام  باستخدام أزرار Back/Forward
 * بتاعة المتصفح في صفحات الـ onboarding.
 *
 * -------- الفكرة --------
 * مش بنستخدم pushState (عشان نتفادى تلويث الـ history stack). بداله:
 *   - على popstate (Back/Forward) بنعمل history.go(1) نرجع تاني
 *   - لو URL مطابق للاصلي، مبنعملش حاجة (عشان نتجنب الـ infinite loop)
 *   - beforeunload لو ضغط Refresh
 *
 * -------- goBack() --------
 * الـ hook بيديك goBack() عشان تستخدمه في زرار "Back" بتاع الصفحة:
 *   - blockedRef = false (يسيب الـ popstate القادم يعدي)
 *   - يعمل navigate(-1) من react-router
 *   - عادي يشتغل لأن مفيش pushState يزاحم
 *
 * -------- Confirm اختياري --------
 *  const { goBack } = useBlockBrowserNavigation({ message: 'من فضلك أكمل الخطوات بالترتيب' })
 *  لو حطيت message، قبل ما يسمح بالخروج هيسأل window.confirm.
 *  لو المستخدم إختار Cancel، hook بيرجعه تاني للصفحة.
 *
 * -------- StrictMode --------
 * الـ cleanup بيمسح الـ listeners ومفيش pushState يتراكم.
 * مفيش infinite loop ولا duplicate entries في الـ history.
 */

export default function useBlockBrowserNavigation(options = {}) {
  const { message = '' } = options
  const navigate = useNavigate()
  const blockedRef = useRef(true)
  const urlRef = useRef(window.location.href)
  const popstateRef = useRef(null)
  const beforeunloadRef = useRef(null)

  useEffect(() => {
    const url = urlRef.current
    blockedRef.current = true

    const handlePopState = () => {
      if (!blockedRef.current) return

      const newUrl = window.location.href

      // لو الـ URL اتغير (المتصفح عمل Back/Forward) — نرجعه تاني
      if (newUrl !== url) {
        window.history.go(1)
      }

      // اختياري: نسأل المستخدم
      if (message) {
        if (!window.confirm(message)) {
          return // Cancel → نقعد مكاننا
        }
        // OK → نسمحله يخرج
        blockedRef.current = false
        window.removeEventListener('popstate', popstateRef.current)
        window.removeEventListener('beforeunload', beforeunloadRef.current)
        window.history.back()
      }
    }

    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }

    popstateRef.current = handlePopState
    beforeunloadRef.current = handleBeforeUnload

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      blockedRef.current = false
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [message])

  const goBack = useCallback(() => {
    blockedRef.current = false
    navigate(-1)
  }, [navigate])

  return { goBack }
}
