"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RegisterBody, RegisterBodyType } from "@/schemaValidations/auth.schema"

import { useRouter } from "next/navigation"
import authApiRequest from "@/apiRequests/auth"
import { useToast } from "@/components/hooks/use-toast"
import { clientSessionToken } from "@/lib/http"
import { handleErrorApi } from "@/lib/utils"
import { useState } from "react"
export default function Register() {
  const router = useRouter();   
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: ""
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: RegisterBodyType) {
        if(isLoading) return
        setIsLoading(true)
        try {
          const result = await authApiRequest.register(values);
          toast({
                  description: result.payload.message,
          });
  
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const resultFromNextServer = await authApiRequest.auth({ sessionToken: result.payload.data.token });
  
         clientSessionToken.value = result.payload.data.token;
         router.push('/me');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          handleErrorApi({ error, setError: form.setError })
        } finally {
          setIsLoading(false)
        }
      }
    
    return <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-[700px]">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="!mt-8">Đăng ký</Button>
            </form>
    </Form>
    </div>;
}


