import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardData, BoardItem, UserProfile } from "@/types";

export default async function DashboardPage() {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) redirect("/sign-in");

    // Sync User to Prisma if not exists
    let dbUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            boards: {
                include: {
                    transactions: true
                }
            }
        }
    });

    if (!dbUser) {
        // Create user in DB
        dbUser = await prisma.user.create({
            data: {
                id: userId,
                email: user.primaryEmail || "",
                plan: 'FREE',
                taxSettings: {
                    firstName: user.displayName || "",
                    lastName: "",
                },
                boards: {
                    create: [
                        { title: 'Income', type: 'INCOME', color: '#2dd4bf' },
                        { title: 'Expenses', type: 'EXPENSE', color: '#f43f5e' }
                    ]
                }
            },
            include: {
                boards: {
                    include: {
                        transactions: true
                    }
                }
            }
        });
    }

    // Transform Prisma data to DashboardData shape
    const incomeBoard = dbUser.boards.find(b => b.type === 'INCOME');
    const expenseBoard = dbUser.boards.find(b => b.type === 'EXPENSE');

    const incomeItems: BoardItem[] = incomeBoard?.transactions.map(t => ({
        id: t.id,
        name: t.title,
        person: t.person,
        status: t.status as any,
        priority: t.priority as any,
        date: t.date.toLocaleDateString(),
        amount: t.amount,
        category: t.category,
        activity: []
    })) || [];

    const expenseItems: BoardItem[] = expenseBoard?.transactions.map(t => ({
        id: t.id,
        name: t.title,
        person: t.person,
        status: t.status as any,
        priority: t.priority as any,
        date: t.date.toLocaleDateString(),
        amount: t.amount,
        category: t.category,
        activity: []
    })) || [];

    const dashboardData: DashboardData = {
        incomeItems,
        expenseItems,
        customBoards: [],
        banks: [],
        chatMessages: [],
        showOnboarding: false
    };

    const userProfile: UserProfile = {
        firstName: (dbUser.taxSettings as any)?.firstName || "",
        lastName: (dbUser.taxSettings as any)?.lastName || "",
        email: dbUser.email,
        initials: "JD",
        tax: (dbUser.taxSettings as any)?.tax || {},
        notifications: (dbUser.taxSettings as any)?.notifications || {},
        security: (dbUser.taxSettings as any)?.security || {},
        settings: { theme: 'dark', currency: 'GBP' }
    };

    return (
        <DashboardLayout
            onLogout={() => { }}
            userPlan={dbUser.plan === 'FREE' ? 'Free' : 'Pro'}
            onUpgrade={() => { }}
            userProfile={userProfile}
            setUserProfile={() => { }}
            dashboardData={dashboardData}
            updateDashboardData={() => { }}
        />
    );
}
