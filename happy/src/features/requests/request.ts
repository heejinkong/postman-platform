export type Request = {
    id: number
    title: string
    created: number
    updated: number
    author: string
    author_id: number
    parent_id: number
    method: string
    url: string
    params: {key: string, value: string, desc: string}[]
    header: {key: string, value: string, desc: string}[]
    body: string
    response: {
        statusCode: number
        statusMsg: string
        header: {key: string, value: string, desc: string}[]
        body: string
    }
}

export const REQUEST_DEFAULT: Request = {
    id: 0,
    title: '',
    created: 0,
    updated: 0,
    author: '',
    author_id: 0,
    parent_id: 0,
    method: 'GET',
    url: '',
    params: [],
    header: [],
    body: '',
    response: {
        statusCode: 0,
        statusMsg: '',
        header: [],
        body: '',
    }
  }