'use client'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {useForm} from 'react-hook-form'
import {type AdminLoginForm, adminLoginSchema,} from '@/lib/zod-schemas/user.zod-schema'
import {zodResolver} from '@hookform/resolvers/zod'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {PasswordInput} from '@/components/ui/input-password'
import {signIn} from 'next-auth/react'
import {toast} from 'sonner'
import {CustomAuthError} from '@/lib/custom-auth-error'
import {useState} from 'react'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  
  const [loading, setLoading] = useState(false)
  // const [adminLogIn, { isLoading }] = useAdminLogInMutation();
  const form = useForm({
    resolver: zodResolver(adminLoginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: AdminLoginForm) => {
    // try {
    //   await signIn({
    //     data: {
    //       email: data.email,
    //       password: data.password,
    //     },
    //     userType: 'ADMIN',
    //   });
    // } catch (e) {
    //   console.debug('ℹ️ ~ file: login-form.tsx:54 ~ onSubmit ~ e:', e);
    //   if (e instanceof Error) {
    //     toast.error(e.message);
    //   }
    // }
    setLoading(true)
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      user_type: 'ADMIN',
      remember: undefined,
      redirect: false,
      callbackUrl: '/',
    })
    if (result?.error === null) {
      return window.location.replace('/admin/auth')
    }
    console.debug('ℹ️ ~ file: login-form.tsx:70 ~ onSubmit ~ result:', result)
    if (result?.error) {
      form.reset()
      setLoading(false)
      CustomAuthError.handleError(result, toast.error)
    }
  }



  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter admin credentials"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder={'Enter admin password'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full disabled:bg-primary/80">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
