export interface IResponse<T = unknown> {
  data: T
  statusCode: number
  message: string
}
