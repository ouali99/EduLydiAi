import { inngest } from "./client";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const CreateNewUser = inngest.createFunction(
  { id: "create-new-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    const {user} = event.data
    //Get event data
    const result = await step.run(
      "check User and create New if Not in DB",
      async () => {
        // Vérifie si l'utilisateur existe déjà, sinon l'ajoute à la DB
        const result = await db
          .select()
          .from(USER_TABLE)
          .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));

        if (result?.length === 0) {
          // Ajouter à la base de données
          const userResponse = await db
            .insert(USER_TABLE)
            .values({
              name: user?.fullName,
              email: user?.primaryEmailAddress?.emailAddress,
            })
            .returning({ id: USER_TABLE.id });
            return userResponse;
        }
        return result
      }
    )
    return 'User Created'
  }
  //Step is to send Welcome Email notification

  //step to send Email notification after 3 days once user join it
)
