import { genertsteNotesAIModel } from "@/configs/AiModel";
import { inngest } from "./client";
import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE, USER_TABLE, STUDY_TABLE } from "@/configs/schema";
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

export const GenerateNotes = inngest.createFunction(
  { id: "generate-course" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { course } = event.data

    // Generate Notes for each chapter with AI
    const notesResult = await step.run('Generate Chapter Notes', async () => {
      const Chapters = course?.courseLayout?.chapters;
      let index = 0;
      for (const chapter of Chapters) {
        const PROMPT = `Generate exam material detail content for each chapter, make sure to include all topic points in the content. Add relevant emojis to titles and sections. Make content engaging and visually appealing. Return in HTML format without HTML, Head, Body tags, but include these style elements:
        - Main titles (h3) should have emojis and be in blue (#1a365d)
        - Subtitles (h4) should have relevant emojis and be in dark gray (#2d3748)
        - Code examples should be in monospace font with light gray background
        - Important points should be highlighted
        The chapter: ${JSON.stringify(chapter)}`;        const result = await genertsteNotesAIModel.sendMessage(PROMPT);
        const aiResponse = result.response.text()

        await db.insert(CHAPTER_NOTES_TABLE).values({
          chapterId: index,
          courseId: course?.courseId,
          notes: aiResponse
        })
        index += 1;
    };
    return 'Complited'
  })

  //Update status to "ready"
  const updateCourseStatusResult = await step.run('Update Course Status to Ready', async () => {
    const result = await db.update(STUDY_TABLE)
                          .set({ status: 'Ready' })
                          .where(eq(STUDY_TABLE.courseId, course?.courseId));
    return 'Success'
  })
})