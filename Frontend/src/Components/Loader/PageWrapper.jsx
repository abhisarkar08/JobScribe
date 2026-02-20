import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import Skeleton from "./Skeleton"

const NO_SKELETON = ["/login", "/register"]

const PageWrapper = ({ children }) => {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  const shouldSkip =
    NO_SKELETON.includes(location.pathname) ||
    location.pathname === "*"

  useEffect(() => {
    if (shouldSkip) return

    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [location.pathname])

  if (loading) {
    return <Skeleton />
  }

  return children
}

export default PageWrapper