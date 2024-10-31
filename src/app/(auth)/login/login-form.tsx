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
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema"
import { useToast } from "@/components/hooks/use-toast"
import authApiRequest from "@/apiRequests/auth"
import { useRouter } from "next/navigation"
import { clientSessionToken } from "@/lib/http"
import { handleErrorApi } from "@/lib/utils"
import { useState } from "react"
 
export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: LoginBodyType) {
        if(isLoading) return
        setIsLoading(true)
        try {
        const result = await authApiRequest.login(values);
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
        // const errors = error.payload.errors as { field: string, message: string }[];
        // const status = error.status as number;
        // if(status === 422) {
        //     errors.forEach((error) => {
        //       form.setError(error.field as 'email' | 'password', { type: 'server', message: error.message });
        //     });
        //   }
        // else {
        //     toast({
        //       title: "Lỗi",
        //       description: error.payload.message,
        //       variant: "destructive",
        //     });
        //   }

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
                name="email"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>Email</FormLabel>
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
              <FormMessage />   
              <Button type="submit" className="!mt-8">Đăng nhập</Button>
            </form>
    </Form>
    </div>;
}


