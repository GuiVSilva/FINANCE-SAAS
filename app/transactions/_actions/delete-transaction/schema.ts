import { z } from "zod";

export const deleteTransacitonSchema = z.object({
  transactionId: z.string().uuid(),
});

export type DeleteTransactionSchema = z.infer<typeof deleteTransacitonSchema>;
