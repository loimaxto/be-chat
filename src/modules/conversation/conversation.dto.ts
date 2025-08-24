import { z } from "zod";

export const createConversationSchema = z
  .object({
    name: z.string().default(""),
    isGroup: z.boolean().default(false),
    groupMemberIds: z.array(z.string().trim()).min(1, "At least one other participant is required."),
  })
  .refine(
    (data) => {
      if (!data.isGroup && data.groupMemberIds.length !== 1) {
        return false;
      }
      return true;
    },
    {
      message: "A non-group conversation must have exactly one other participant.",
      path: ["groupMemberIds"], // Field to which the error is attached
    }
  );

export type CreateConversationDto = z.infer<typeof createConversationSchema>;
