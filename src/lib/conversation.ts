import type { Conversation } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

const findConversation = async (
  memberOneId: Conversation["memberOneId"],
  memberTwoId: Conversation["memberTwoId"]
) => {
  try {
    return await prisma.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

const createNewConversation = async (
  memberOneId: Conversation["memberOneId"],
  memberTwoId: Conversation["memberTwoId"]
) => {
  try {
    return await prisma.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

const getOrCreateConversation = async (
  memberOneId: Conversation["memberOneId"],
  memberTwoId: Conversation["memberTwoId"]
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }

  return conversation;
};

export { getOrCreateConversation };
