import { RefObject, useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import HeaderBar from './components/HomeHeaderBar'

export default function HomeLayout() {
  const headerBarRef = useRef<HTMLDivElement>(null)
  const contentsBodyRef = useRef<HTMLDivElement>(null)

  const handleResize = (
    headerRef: RefObject<HTMLDivElement>,
    bodyRef: RefObject<HTMLDivElement>
  ) => {
    if (headerRef.current && bodyRef.current) {
      const headerHeight = headerRef.current.offsetHeight
      bodyRef.current.style.height = `calc(100vh - ${headerHeight}px)`
    }
  }

  useEffect(() => {
    handleResize(headerBarRef, contentsBodyRef)
  }, [headerBarRef, contentsBodyRef])

  return (
    <Box>
      <Box ref={headerBarRef}>
        <HeaderBar />
      </Box>
      <Box ref={contentsBodyRef}>
        <Outlet />
      </Box>
    </Box>
  )
}
