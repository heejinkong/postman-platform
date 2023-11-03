import { Box } from '@mui/material'
import HeaderBar from '../../HeaderBar'
import { Outlet } from 'react-router-dom'
import { RefObject, useEffect, useRef } from 'react'
import SideBar from './SideBar'

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
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
          <Box
            sx={{
              width: '20rem',
              borderRight: 1,
              borderColor: 'lightgray'
            }}
          >
            <SideBar />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
