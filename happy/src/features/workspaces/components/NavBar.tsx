import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

export default function NavBar() {
  return (
    <div role="presentation">
      <Breadcrumbs separator=">" aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/workspaces/0">
          My Workspace
        </Link>
        <Link underline="hover" color="inherit" href="/workspaces/0/collections/0">
          My Collection
        </Link>
        <Link underline="hover" color="inherit" href="/workspaces/0/collections/0/requests/0">
          My Request
        </Link>
      </Breadcrumbs>
    </div>
  )
}
