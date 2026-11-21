export type ApiError = { error: { code: string; message: string; fields?: Record<string,string> } };
export type ApiResponse<T> = { data: T };
