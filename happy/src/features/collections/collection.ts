export type Collection = {
    id: number
    title: string
    desc: string
    created: number
    updated: number
    author: string
    author_id: number
    parent_id: number
    requests: []
  }
  
  export const COLLECTION_DEFAULT: Collection = {
    id: 0,
    title: '',
    desc: '',
    created: 0,
    updated: 0,
    author: '',
    author_id: 0,
    parent_id: 0,
    requests: []
  }
  