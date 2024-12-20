/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from '@/config'
import { LoginResType } from '@/schemaValidations/auth.schema'
import { normalizePath } from './utils'


const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    [key: string]: string[]
  }
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string,
    [key: string]: any
  }
  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error')
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: 422
  payload: EntityErrorPayload

  constructor({ status, payload }: { status: 422; payload: EntityErrorPayload }) {
    super({ status, payload })
    this.payload = payload
    this.status = status
  }
}

type CustomOptions = Omit<RequestInit, 'body' | 'method'> & {
  body?: any
  baseUrl?: string
}



class SessionToken {
  private token = ''
  get value() {
    return this.token
  }
  set value(token: string) {
    if (typeof window === 'undefined') {
      throw new Error('This method is only supported in the client side')
    }
    this.token = token
  }
}
export const clientSessionToken = new SessionToken()

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined
  const baseHeaders = {
    'Content-Type': 'application/json',
    Authorization: clientSessionToken.value
      ? `Bearer ${clientSessionToken.value}`
      : ''
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì sẽ lấy giá trị mặc định từ envConfig
  // Nếu truyền baseUrl thì sẽ lấy giá trị truyền vào, truyền vào '' thì gọi đến Next.js Server, còn truyền vào endpoint thì gọi đến server khác

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl
  const fulllUrl = url.startsWith('/')
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`
  const res = await fetch(fulllUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    },
    body,
    method
  })
  const payload: Response = await res.json()
  const data = {
    status: res.status,
    payload
  }
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(data as {
        status: 422
        payload: EntityErrorPayload
      })
    }

    else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (typeof window !== 'undefined') {
        await fetch('/api/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ force: true }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        clientSessionToken.value = ''
        location.href = '/login'
      }
    }
    else {
      throw new HttpError(data)
    }
  }

  if(typeof window !== 'undefined') {
    if (['auth/login', 'auth/register'].some(item => item === normalizePath(url))) {
      clientSessionToken.value = (payload as LoginResType).data.token
    } else if ('auth/logout' === normalizePath(url)) {
      clientSessionToken.value = ''
    }
  }
 
  return data
}

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('GET', url, options)
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('DELETE', url, { ...options, body })
  }
}

export default http
