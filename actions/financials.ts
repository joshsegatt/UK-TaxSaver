'use server';

import { stackServerApp } from '@/stack';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Ratelimit (if env vars are present, otherwise mock or skip)
// Assuming user has Upstash, if not we might need to handle gracefully or throw.
// For now, we'll wrap it.
const ratelimit = process.env.UPSTASH_REDIS_REST_URL
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, '10 s'),
        analytics: true,
    })
    : null;

const TransactionSchema = z.object({
    boardId: z.string(),
    amount: z.number(),
    status: z.enum(['DONE', 'REVIEW', 'PENDING']),
    date: z.string().transform((str) => new Date(str)),
    category: z.string().min(1),
    title: z.string().min(1),
});

export async function addTransaction(data: z.infer<typeof TransactionSchema>) {
    const user = await stackServerApp.getUser();
    const userId = user?.id;
    if (!userId) throw new Error("Unauthorized");

    if (ratelimit) {
        const { success } = await ratelimit.limit(userId);
        if (!success) throw new Error("Rate limit exceeded");
    }

    const validated = TransactionSchema.parse(data);

    // Verify board belongs to user
    const board = await prisma.board.findUnique({
        where: { id: validated.boardId },
    });

    if (!board || board.userId !== userId) {
        throw new Error("Board not found or unauthorized");
    }

    await prisma.transaction.create({
        data: {
            boardId: validated.boardId,
            amount: validated.amount,
            status: validated.status,
            date: validated.date,
            category: validated.category,
            title: validated.title,
        },
    });

    // Audit Log
    await prisma.auditLog.create({
        data: {
            userId,
            action: `Added transaction to board ${validated.boardId}`,
            ipAddress: '0.0.0.0', // In real app, get from headers
        }
    });

    revalidatePath('/dashboard');
}

const TaxProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    taxCode: z.string().regex(/^[0-9]{4}[LMNPTY]$|^BR$|^D0$/, "Invalid Tax Code").optional(),
    // Add other fields
});

export async function updateTaxProfile(data: z.infer<typeof TaxProfileSchema>) {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) throw new Error("Unauthorized");

    const validated = TaxProfileSchema.parse(data);

    await prisma.user.update({
        where: { id: userId },
        data: {
            taxSettings: validated as any // JSON type
        }
    });

    revalidatePath('/dashboard');
}
