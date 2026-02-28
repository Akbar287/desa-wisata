import { AuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Bycript from 'bcryptjs'
import { Session } from 'next-auth'
import { JWT } from "next-auth/jwt"
import { prisma } from '@/lib/prisma'
import { Role } from '@/generated/prisma/client'

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            type: 'credentials',
            name: 'credentials',
            credentials: {
                username: { label: 'username', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials, req) {
                try {
                    if (!credentials) {
                        throw new Error('No credentials provided')
                    }

                    const userLogin = await prisma.userLogin.findFirst({
                        where: {
                            Username: credentials.username,
                        },
                        select: {
                            Username: true,
                            Password: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    avatar: true,
                                    email: true,
                                    UserRole: {
                                        select: {
                                            role: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    description: true
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    })

                    if (userLogin === null) {
                        throw new Error('User tidak ditemukan')
                    }

                    if (!userLogin.Password) {
                        throw new Error('Password kosong')
                    }
                    const isPasswordValid = await Bycript.compare(
                        credentials.password,
                        userLogin.Password
                    )
                    if (!isPasswordValid) {
                        throw new Error('Password salah')
                    }

                    const user = {
                        id: String(userLogin.user.id),
                        username: userLogin.Username,
                        nama: userLogin.user.name,
                        avatar: userLogin.user.avatar,
                        email: userLogin.user.email,
                        roles: userLogin.user.UserRole.flatMap(
                            (f) => f.role
                        ) as unknown as Role[],
                    }

                    return user
                } catch (error) {
                    if (error instanceof Error) {
                        return Promise.reject(error)
                    }
                    return Promise.reject('An unknown error occurred')
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }: { token: any; user?: any; }) {
            if (user) {
                token.id = user.id
                token.username = user.username
                token.nama = user.nama
                token.name = user.nama
                token.avatar = user.avatar
                token.picture = user.avatar
                token.email = user.email
                token.roles = user.roles
            }
            return token
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            session.user.id = token.id
            session.user.username = token.username
            session.user.nama = token.nama
            session.user.avatar = token.avatar
            session.user.email = token.email
            session.user.roles = token.roles
            return session
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    cookies: {
        sessionToken: {
            name: `desa-wisata-ui.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            },
        },
        callbackUrl: {
            name: `desa-wisata-ui.callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
        csrfToken: {
            name: `desa-wisata-ui.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }
