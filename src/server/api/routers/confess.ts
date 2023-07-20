/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { string, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const confessRouter = createTRPCRouter({
  getInfinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const data = await ctx.prisma.confess.findMany({
        where: {
          user: {
            id: ctx.session.user.id,
          },
        },
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [
          {
            createdAt: "desc",
          },
          {
            id: "desc",
          },
        ],
        select: {
          id: true,
          message: true,
          author: {
            select: {
              name: true,
              username: true,
              image: true,
            },
          },
          createdAt: true,
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return {
        confessions: data.map((confess) => ({
          id: confess.id,
          message: confess.message,
          author: {
            name: (confess.author && confess.author.name) ?? "Anonymous",
            username: (confess.author && confess.author.username) ?? "",
            image: confess.author && confess.author.image,
          },
          createdAt: confess.createdAt,
        })),
        nextCursor,
      };
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.confess.findMany({
      where: {
        user: {
          id: ctx.session.user.id,
        },
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(({ input: { username }, ctx }) => {
      return ctx.prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          name: true,
          image: true,
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        message: z.string(),
        sendAsAnon: z.boolean(),
        user: z.string(),
      })
    )
    .mutation(async ({ input: { message, sendAsAnon = true, user }, ctx }) => {
      const userData = await ctx.prisma.user.findUnique({
        where: {
          username: user,
        },
        select: {
          id: true,
        },
      });

      if (!userData) throw new Error("User data not found");

      const confess = await ctx.prisma.confess.create({
        data: {
          message,
          userId: userData.id,
          authorId: !sendAsAnon ? ctx.session?.user.id : null,
        },
      });

      return confess;
    }),
});
