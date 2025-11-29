import { auth, currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/prisma";

const initialProfile = async () => {
  const { isAuthenticated, userId, redirectToSignIn } = await auth();
  const user = await currentUser();

  if (!isAuthenticated || !user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: { userId },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};

export { initialProfile };
