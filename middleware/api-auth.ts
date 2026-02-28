import { getToken } from 'next-auth/jwt'
import { MiddlewareHandler } from 'hono'
import { NextRequest } from 'next/server'

export const withApiAuth: MiddlewareHandler = async (c, next) => {
    const req = c.req.raw as NextRequest

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: 'desa-wisata-ui.session-token',
    })

    if (!token) {
        return c.json({ message: 'Unauthorized' }, 401)
    }

    c.set('token', token)

    await next()
}
