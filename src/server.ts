import fastify from "fastify";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import { generateSlug } from "./utils/generate-slug";

const app = fastify();

const prisma = new PrismaClient({
  log: ["query"],
});

app.get("/", async (request, reply) => {
  return { message: "Hello World" };
});

app.post("/events", async (request, reply) => {
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable(),
  })

  const { title, details, maximumAttendees } = createEventSchema.parse(request.body);

  const slug = generateSlug(title);

  const eventWithSameSlug = await prisma.event.findUnique({
    where: { slug }
  })

  if (eventWithSameSlug !== null) {
    throw new Error("An event with the same title already exists");
  }



  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug
    }
  })

  return { eventId: event.id };
});

app.listen({ port: 3333 }).then(() => {
  console.log("Server is running on port 3333");
});