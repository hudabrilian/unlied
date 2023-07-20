import { profileFormSchema } from "~/components/settings/profile-form";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        username: true,
        name: true,
        email: true,
        image: true,
      },
    });
  }),
  update: protectedProcedure
    .input(profileFormSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: input,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Username already exists",
            });
          }
        }
      }
    }),
});
