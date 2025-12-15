import { NextResponse } from "next/server";

import { MemberRole } from "@/generated/prisma";
import { GENERAL_CHANNEL_NAME } from "@/lib/constants";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    if (name === GENERAL_CHANNEL_NAME) {
      return new NextResponse(`Name cannot be "${GENERAL_CHANNEL_NAME}"`, {
        status: 400,
      });
    }

    const server = await db.server.update({
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
          create: {
            profileId: profile.id,
            name,
            type,
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
