import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import { controller } from "../lib/controller";

type Expense = {
    total: number,
    priority: number
}

type Income = {
    total: number
}

const getExpenses = (client: PrismaClient): RequestHandler =>  
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const expenses = await client.expense.findMany({
            where: {
                userId
            }
        })
        res.json({expenses});
        
    }

const getIncomes = (client: PrismaClient): RequestHandler =>  
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const incomes = await client.income.findMany({
            where: {
                userId
            }
        })
        res.json({incomes});  
    }

const createExpense = (client: PrismaClient): RequestHandler => 
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const {total, priority} = req.body as Expense;

        const newExpense = await client.expense.create({
            data: {
                total, 
                priority,
                userId
            }
        })

        res.json({expense: newExpense})
    }

const createIncome = (client: PrismaClient): RequestHandler => 
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const {total} = req.body as Income;

        const newIncome = await client.income.create({
            data: {
                total,
                userId
            }
        })

        res.json({income: newIncome})
    }



export const budgetController = controller(
    "budget",
    [
        { path: "/expenses", endpointBuilder: getExpenses, method: "get"},
        { path: "/incomes", endpointBuilder: getIncomes, method: "get"},
        { path: "/expenses", method: "post", endpointBuilder: createExpense},
        { path: "/incomes", method: "post", endpointBuilder: createIncome}
    ]
)