import {  Request } from './request';

export interface RequestsRepo {
    save(rq: Request): void
    findById(index: number): Request | undefined
    findAll(): Request[]
    deleteById(id: number): void
    count(): number
}