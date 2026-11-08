import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * useBlockBrowserNavigation
 * ==========================
 *
 * Prevents the user from navigating Back/Forward using the browser buttons
 * on onboarding pages.
 *
 * -------- Idea --------
 * We don't use pushState (to avoid polluting the history stack). Instead:
 *   - on popstate (Back/Forward) we call history.go(1) to push back
 *   - if the URL matches the original, do nothing (avoid infinite loop)
 *   - beforeunload to handle Refresh
 *
 * -------- goBack() --------
 * The hook exposes goBack() for the page's Back button:
 *   - blockedRef = false (lets the next popstate through)
 *   - calls navigate(-1) from react-router
 *   - works because no pushState interferes
 *
 * -------- Optional confirm --------
 *  const { goBack } = useBlockBrowserNavigation({ message: 'Please complete the steps in order' })
 *  If you pass a message, it asks window.confirm before allowing exit.
 *  If the user chooses Cancel, the hook pushes them back to the page.
 *
 * -------- StrictMode --------
 * The cleanup removes the listeners and no pushState accumulates.
 * No infinite loop and no duplicate entries in history.
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

      // If URL changed (browser Back/Forward) - push back
      if (newUrl !== url) {
        window.history.go(1)
      }

      // Optional: ask the user
      if (message) {
        if (!window.confirm(message)) {
          return // Cancel -> stay
        }
        // OK -> allow leaving
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
