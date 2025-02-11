export type TypeProtocolHandler<T extends string = never> = (
  request: Request,
  params: Record<T, string>
) => Response | Promise<Response>

export type TypeProtocolEventInstance<T extends string = never> = {
  hostname: string
  path: string
  handler: TypeProtocolHandler<T>
}
