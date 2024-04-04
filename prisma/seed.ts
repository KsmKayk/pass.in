import { prisma } from '../src/lib/prisma';

async function seed() {
  await prisma.event.create({
    data: {
      id: "fc735d86-b05b-4a92-b7a0-710eb5762bc8",
      title: "My first event",
      details: "This is my first event",
      maximumAttendees: 10,
      slug: "my-first-event"
    }
  });
}

seed().then(() => {
  console.log("Seed complete");
  prisma.$disconnect()
});