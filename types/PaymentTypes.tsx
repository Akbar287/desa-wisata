export type PaymentMethod = {
    id: number; name: string; accountNumber: string; accountName: string;
    image: string; description: string; type: 'BANK' | 'WALLET' | 'QRIS'; isActive: boolean
}

export type PaymentRecord = {
    id: number; paymentAvailableId: number; bookingId: number; amount: number;
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'; referenceCode: string;
    proofOfPayment: string | null; paidAt: Date | null; cancelledAt: Date | null;
    createdAt: Date; updatedAt: Date;
    paymentAvailable: PaymentMethod
}

export type BookingData = {
    id: number; tourId: number; firstName: string; lastName: string;
    email: string; phoneCode: string; phoneNumber: string; adults: number; children: number;
    startDate: Date | string; endDate: Date | string; totalPrice: number; status: string;
    tour: { id: number; title: string; durationDays: number; price: number; image: string };
    payments: PaymentRecord[];
}