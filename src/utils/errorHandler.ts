import { ApiRequestError } from "../services/api";
export function getErrorMessage(error:unknown,fallback="Something went wrong. Please try again."){if(error instanceof ApiRequestError)return error.message;if(error instanceof Error&&error.message)return error.message;return fallback;}
export function isUnauthorized(error:unknown){return error instanceof ApiRequestError&&error.status===401;}
