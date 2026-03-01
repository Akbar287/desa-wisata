import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/bookings')

app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const { tourId, firstName, lastName, gender, birthYear, birthMonth, birthDay, nationality, email, phoneCode, phoneNumber, adults, children, startDate, endDate, findUs, comments, totalPrice } = body

        if (!tourId || !firstName || !lastName || !gender || !birthYear || !birthMonth || !birthDay || !nationality || !email || !phoneCode || !phoneNumber || !adults || !startDate || !endDate || !findUs) {
            return c.json({ status: 'error', message: 'Data tidak lengkap' }, 400)
        }

        const birthDate = new Date(Number(birthYear), Number(birthMonth) - 1, Number(birthDay))

        const parseIdDate = (s: string): Date => {
            const months: Record<string, number> = { 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mei': 4, 'jun': 5, 'jul': 6, 'agu': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'des': 11 }
            const parts = s.trim().split(/\s+/)
            if (parts.length >= 3) {
                const day = parseInt(parts[0])
                const mon = months[parts[1].toLowerCase().substring(0, 3)] ?? 0
                const year = parseInt(parts[2])
                return new Date(year, mon, day)
            }
            return new Date(s)
        }

        const genderMap: Record<string, string> = { male: 'MALE', female: 'FEMALE' }

        const booking = await prisma.booking.create({
            data: {
                tourId: Number(tourId),
                firstName,
                lastName,
                gender: genderMap[gender] as 'MALE' | 'FEMALE',
                birthDate,
                nationality,
                email,
                phoneCode,
                phoneNumber,
                adults: Number(adults),
                children: Number(children ?? 0),
                startDate: parseIdDate(startDate),
                endDate: parseIdDate(endDate),
                findUs,
                comments: comments || null,
                acceptTerms: true,
                status: 'PENDING',
                totalPrice: Number(totalPrice ?? 0),
            },
        })

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (!existingUser) {
            const user = await prisma.user.create({
                data: {
                    email,
                    name: `${firstName} ${lastName}`,
                    phoneCode,
                    phoneNumber,
                    age: new Date().getFullYear() - birthDate.getFullYear(),
                    gender: genderMap[gender] as 'MALE' | 'FEMALE',
                    nationality,
                    address: email,
                    avatar: '/api/img?id=default.png'
                }
            })

            const role = await prisma.role.findUnique({ where: { name: 'Pengguna' } })
            if (role && user) {
                await prisma.userRole.create({
                    data: { userId: user.id, roleId: role.id }
                })
            }
        }

        return c.json({ status: 'success', message: 'Pemesanan berhasil dibuat', data: { id: booking.id } })
    } catch (err) {
        console.error('Booking error:', err)
        return c.json({ status: 'error', message: 'Gagal membuat pemesanan' }, 500)
    }
})

app.post('/create-payment', async (c) => {
    try {
        const body = await c.req.json()
        const { bookingId, paymentAvailableId, amount } = body

        if (!bookingId || !paymentAvailableId || !amount) {
            return c.json({ status: 'error', message: 'Data tidak lengkap' }, 400)
        }

        const refCode = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

        const check = await prisma.payment.findFirst({
            where: {
                bookingId: Number(bookingId),
                status: 'PENDING',
                amount: Number(amount),
            }
        })

        if (check) {
            await prisma.payment.deleteMany({
                where: {
                    bookingId: Number(bookingId),
                    status: 'PENDING',
                    amount: Number(amount),
                }
            })
        }

        const payment = await prisma.payment.create({
            data: {
                bookingId: Number(bookingId),
                paymentAvailableId: Number(paymentAvailableId),
                amount: Number(amount),
                status: 'PENDING',
                referenceCode: refCode,
            },
            include: { paymentAvailable: true },
        })

        return c.json({ status: 'success', message: 'Pembayaran dibuat', data: payment })
    } catch (err) {
        console.error('Create payment error:', err)
        return c.json({ status: 'error', message: 'Gagal membuat pembayaran' }, 500)
    }
})

app.post('/confirm-payment', async (c) => {
    try {
        const body = await c.req.json()
        const { paymentId, proofOfPayment } = body

        if (!paymentId || !proofOfPayment) {
            return c.json({ status: 'error', message: 'Data tidak lengkap' }, 400)
        }

        const payment = await prisma.payment.update({
            where: { id: Number(paymentId) },
            data: {
                proofOfPayment,
                status: 'PAID',
                paidAt: new Date(),
            },
            include: { paymentAvailable: true },
        })

        await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { status: 'CONFIRMED' },
        })

        return c.json({ status: 'success', message: 'Bukti pembayaran berhasil diupload', data: payment })
    } catch (err) {
        console.error('Confirm payment error:', err)
        return c.json({ status: 'error', message: 'Gagal mengkonfirmasi pembayaran' }, 500)
    }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
