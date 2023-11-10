import { Box } from '@mui/material'
import HeaderBar from '../../HeaderBar'

import { RefObject, useEffect, useRef } from 'react'
import DrawerMain from './DrawerMain'

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
        {/* <Box sx={{ flexGrow: 1, height: '100%', width: `100%`, display: 'flex', p: 2 }}>
          {/* <Box>
            <SideBar />
          </Box>
          <Divider orientation="vertical" />
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box> */}
        <DrawerMain />
      </Box>
    </Box>
    // </Box>
  )
}
