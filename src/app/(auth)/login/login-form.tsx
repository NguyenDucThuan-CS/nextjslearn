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

import envConfig from "@/config"

 
export default function LoginForm() {
    const { toast } = useToast();
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: LoginBodyType) {
        try {
        console.log('vadaasasalues', values)
        await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (res) => {
            console.log('res', res)
            const payload = await res.json();
            const data = {
              status: res.status,
              payload: payload
            }
            console.log('datalllll', data)
            toast({
              description: data.payload.message,
            });
            if(!res.ok) {
              throw data;
            }
            return data;
        });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        console.log('error', error)
        const errors = error.payload.errors as { field: string, message: string }[];
        const status = error.status as number;
        if(status === 422) {
            errors.forEach((error) => {
              form.setError(error.field as 'email' | 'password', { type: 'server', message: error.message });
            });
          }
        else {
            toast({
              title: "Lỗi",
              description: error.payload.message,
              variant: "destructive",
            });
          }
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


