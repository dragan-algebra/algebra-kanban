import { currentUser } from "@clerk/nextjs/server"; 
import { db } from "@/lib/db";

export const syncUser = async () => {
  const user = await currentUser();

  // Check if user exists and has at least one email address
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return null;
  }

  const email = user.emailAddresses[0].emailAddress;

  let name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (!name) {
    name = email.split("@")[0];
  }

  // Create if not exists, Update if exists
  const dbUser = await db.user.upsert({
    where: { email },
    update: {
      name,
      image: user.imageUrl,
    },
    create: {
      id: user.id, 
      email,
      name,
      image: user.imageUrl,
    },
  });

  return dbUser;
};
