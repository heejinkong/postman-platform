export type Request = {
    id: number
    title: string
    created: number
    updated: number
    author: string
    author_id: number
    parent_id: number
    response: []
}

export const REQUEST_DEFAULT: Request = {
    id: 0,
    title: '',
    created: 0,
    updated: 0,
    author: '',
    author_id: 0,
    parent_id: 0,
    response: []
  }