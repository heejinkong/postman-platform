import { RequestsRepo } from "./requestsRepo";
import { Request } from "./request";


export class MemoryRequestsRepo implements RequestsRepo {

  _data: {
    sequence: number
  Requests: Request[]
  } = { sequence: 0, Requests: [] }
    // addRequestToWorkspace: any;
  

  //data 
  data(d: { sequence: number; Requests: Request[] }): MemoryRequestsRepo {
    this._data = d
    return this
  }

  save(rq: Request): void {
    rq.id = this._data.sequence++
    this._data.Requests.push(rq)
  }
  findById(id: number): Request | undefined {
    return this._data.Requests.find((rq) => rq.id === id)
  }
  findAll(): Request[] {
    return this._data.Requests
  }
  deleteByRequestId(id: number): void {
    this._data.Requests = this._data.Requests.filter((rq) => rq.id !== id)
  }
  count(): number {
    return this._data.Requests.length
  }
  update(rq: Request) {
    console.log(this._data.Requests)
    const index = this._data.Requests.findIndex((_rq) => _rq.id === rq.id)
    console.log(index)
    if (index === -1) {
      return
    }
    this._data.Requests[index] = rq
    console.log(this._data.Requests)
  }
}