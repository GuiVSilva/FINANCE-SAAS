"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { addTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface AddTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const addTransaction = async (params: AddTransactionParams) => {
  addTransactionSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Não autorizado");
  }

  if (params.id) {
    await db.transaction.update({
      where: {
        id: params.id,
      },
      data: { ...params, userId },
    });
  } else {
    await db.transaction.create({
      data: { ...params, userId },
    });
  }

  revalidatePath("/transactions");
};
