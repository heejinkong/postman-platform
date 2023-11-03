export type Workspace = {
  id: number
  title: string
  desc: string
  created: number
  updated: number
  author: string
  author_id: number
  collections: []
}

export const WORKSPACE_DEFAULT: Workspace = {
  id: 0,
  title: '',
  desc: '',
  created: 0,
  updated: 0,
  author: '',
  author_id: 0,
  collections: []
}
