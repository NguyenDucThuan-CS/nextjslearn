/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { HttpError } from "./http"
import { toast } from "@/components/hooks/use-toast"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const handleErrorApi = ({ error, setError, duration  }: { error: any, setError: UseFormSetError<any>, duration?: number }) => {
  if(error instanceof HttpError && setError) {
    error.payload.errors.forEach((item: any) => {
      setError(item.field, { message: item.message })
    })
  }
  else {
    toast({
      title: 'Lỗi',
      description: error.message,
      variant: 'destructive',
      duration
    })
  }
}
