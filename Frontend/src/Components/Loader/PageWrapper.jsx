// src/Components/Loader/PageWrapper.jsx
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import Skeleton from "./Skeleton"

const NO_SKELETON = ["/login", "/register"]

const PageWrapper = ({ children }) => {
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  const shouldSkip =
    NO_SKELETON.includes(location.pathname) ||
    location.pathname === "*"

  useEffect(() => {
    if (shouldSkip) {
      setLoading(false)
      return
    }

    setLoading(true)

    // 🔥 very small guaranteed delay (UX polish)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 80)

    return () => clearTimeout(timer)
  }, [location.pathname])

  if (loading) {
    return <Skeleton />
  }

  return children
}

export default PageWrapper