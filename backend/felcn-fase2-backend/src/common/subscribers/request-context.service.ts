import { Injectable } from '@nestjs/common'
import { AsyncLocalStorage } from 'async_hooks'

@Injectable()
export class RequestContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>()

  run(callback: () => void) {
    this.asyncLocalStorage.run(new Map(), callback)
  }

  set(key: string, value: any) {
    const store = this.asyncLocalStorage.getStore()
    store?.set(key, value)
  }

  get(key: string) {
    return this.asyncLocalStorage.getStore()?.get(key)
  }
}