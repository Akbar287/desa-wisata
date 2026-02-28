'use client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { LogInIcon } from 'lucide-react'
import {
    LoginFormValidation,
    LoginSkemaValidation,
} from '@/validation/LoginValidation'
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"


export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {
    const { data: session } = useSession()
    const searchParam = useSearchParams()
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    const form = useForm<LoginFormValidation>({
        resolver: zodResolver(LoginSkemaValidation),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginFormValidation) => {
        setLoading(true)
        const result = await signIn('credentials', {
            username: data.username,
            password: data.password,
            redirect: false,
            callbackUrl: searchParam.get('callbackUrl') || '/',
        })

        if (result?.error) {
            setErrorMessage(result.error)
            setLoading(false)
        }

        if (result?.ok) {
            // router.push(searchParam.get('callbackUrl') || '/')
            setErrorMessage(null)
            window.location.href = searchParam.get('callbackUrl') || '/'
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (searchParam.get('msg')) {
            setErrorMessage(searchParam.get('msg') as string)
        }
        if (session) {
            window.location.href = searchParam.get('callbackUrl') || '/'
        }
    }, [])

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-xl font-bold">
                                Selamat Datang di Sistem Desa Manuk Jaya
                            </h1>
                        </div>
                        {errorMessage && (
                            <Alert
                                variant="destructive"
                                className="bg-transparent border-red-500 "
                            >
                                <LogInIcon className="h-4 w-4" />
                                <AlertTitle className="font-semibold text-red-500">
                                    Kesalahan
                                </AlertTitle>
                                <AlertDescription className="text-red-500">
                                    {errorMessage}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="flex flex-col gap-6">
                            <Controller
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Nama Pengguna</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                readOnly={loading}
                                                {...field}
                                            />
                                        </FieldContent>
                                        <FieldDescription>
                                            Nama Pengguna Terdiri dari 6-16
                                            Karakter
                                        </FieldDescription>
                                        <FieldError />
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Kata Sandi</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                readOnly={loading}
                                                {...field}
                                                type="password"
                                            />
                                        </FieldContent>
                                        <FieldDescription>
                                            Kata Sandi Terdiri dari 8-16
                                            Karakter
                                        </FieldDescription>
                                        <FieldError />
                                    </Field>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="mr-2 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                            >
                                {loading ? 'Loading' : 'Login'}
                            </Button>
                        </div>
                    </div>
                </FieldGroup>
            </form>
        </div>
    )
}
