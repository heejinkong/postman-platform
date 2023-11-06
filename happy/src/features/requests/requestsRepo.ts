import {  Request } from './request';

export interface RequestsRepo {
    save(rq: Request): void
    findById(index: number): Request | undefined
    findAll(): Request[]
    deleteByRequestId(id: number): void
    count(): number
}