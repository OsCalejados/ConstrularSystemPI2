export type APIErrorResponse = {
  statusCode: number
  message: string | string[]
  error: {
    error: string
    message: string
    statusCode: number
  }
}
