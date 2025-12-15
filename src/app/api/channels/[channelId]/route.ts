import { NextResponse } from "next/server";

import { MemberRole } from "@/generated/prisma/enums";
import { GENERAL_CHANNEL_NAME } from "@/lib/constants";
import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { name, type } = await req.json();
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const { channelId } = await params;

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (name === GENERAL_CHANNEL_NAME) {
      return new NextResponse(`Name cannot be "${GENERAL_CHANNEL_NAME}"`, {
        status: 400,
      });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: GENERAL_CHANNEL_NAME,
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const { channelId } = await params;

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: GENERAL_CHANNEL_NAME,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
