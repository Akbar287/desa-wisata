import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/bookings')

app.get('/', async (c) => {
    try {
        const page = Math.max(1, Number(c.req.query('page')) || 1)
        const limit = Math.min(50, Math.max(1, Number(c.req.query('limit')) || 10))
        const search = c.req.query('search')?.trim() || ''
        const skip = (page - 1) * limit

        const where = search ? {
            OR: [
                { firstName: { contains: search, mode: 'insensitive' as const } },
                { lastName: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
            ],
        } : {}

        const [data, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true, firstName: true, lastName: true, email: true, status: true,
                    startDate: true, endDate: true, totalPrice: true, adults: true, children: true,
                    createdAt: true,
                    tour: { select: { title: true } },
                },
            }),
            prisma.booking.count({ where }),
        ])

        const totalPages = Math.ceil(total / limit)
        return c.json({
            status: 'success',
            data,
            pagination: { page, limit, total, totalPages, hasPrevPage: page > 1, hasNextPage: page < totalPages },
        })
    } catch (err) {
        console.error('Booking list error:', err)
        return c.json({ status: 'error', message: 'Gagal memuat data' }, 500)
    }
})

app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const { tourId, firstName, lastName, gender, birthYear, birthMonth, birthDay, nationality, email, phoneCode, phoneNumber, adults, children, startDate, endDate, findUs, comments, totalPrice, type } = body

        if (!tourId || !firstName || !lastName || !gender || !birthYear || !birthMonth || !birthDay || !nationality || !email || !phoneCode || !phoneNumber || !adults || !startDate || !endDate || !findUs || !type) {
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

        let bookingData: any = {
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
        }

        if (type === 'tour') {
            const tour = await prisma.tour.findFirst({ where: { id: Number(tourId) } })
            if (!tour) return c.json({ status: 'error', message: 'Tour tidak ditemukan' }, 404)
            bookingData.tourId = tour.id
        } else if (type === 'destinasi') {
            const dest = await prisma.destination.findFirst({ where: { id: Number(tourId) } })
            if (!dest) return c.json({ status: 'error', message: 'Destinasi tidak ditemukan' }, 404)
            bookingData.destinationId = dest.id
        } else if (type === 'wahana') {
            const wahana = await prisma.wahana.findFirst({ where: { id: Number(tourId) } })
            if (!wahana) return c.json({ status: 'error', message: 'Wahana tidak ditemukan' }, 404)
            bookingData.wahanaId = wahana.id
        } else {
            return c.json({ status: 'error', message: 'Type tidak valid' }, 400)
        }

        const booking = await prisma.booking.create({
            data: bookingData,
        });

        const existingUser = await prisma.user.findUnique({ where: { email } });
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
            });

            const role = await prisma.role.findUnique({ where: { name: 'Pengguna' } })
            if (role && user) {
                await prisma.userRole.create({
                    data: { userId: user.id, roleId: role.id }
                });
            }
        }

        return c.json({ status: 'success', message: 'Pemesanan berhasil dibuat', data: { id: booking.id } });
    } catch (err) {
        console.error('Booking error:', err);
        return c.json({ status: 'error', message: 'Gagal membuat pemesanan' }, 500);
    }
});

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

const handler = handle(app)

export const GET = (req: Request) => handler(req)
export const POST = (req: Request) => handler(req)
export const PUT = (req: Request) => handler(req)
export const DELETE = (req: Request) => handler(req)
