import { faker } from "@faker-js/faker";
import { randomUUIDv7 } from "bun";
import { DocumentStatus, DocumentType } from "../../prisma/generated/enums";
import { db } from "./prisma-connection";

const DOCUMENT_TYPES: DocumentType[] = [
  DocumentType.COVER_PAGE,
  DocumentType.TABLE_OF_CONTENTS,
  DocumentType.NARRATIVE,
  DocumentType.TECHNICAL_CONTENT,
  DocumentType.PLAIN_LANGUAGE,
  DocumentType.LEGAL,
  DocumentType.VISUAL,
  DocumentType.FINANCIAL,
  DocumentType.RESEARCH,
  DocumentType.PLANNING,
];

const DOCUMENT_STATUSES: DocumentStatus[] = [
  DocumentStatus.DONE,
  DocumentStatus.IN_PROCESS,
];

async function seedDocumentSections(count = 100) {
  const sections = Array.from({ length: count }, () => ({
    id: randomUUIDv7(),

    header: faker.helpers.arrayElement([
      "Executive Summary",
      "Technical Approach",
      "System Architecture",
      "API Documentation",
      "Database Schema",
      "Risk Management Plan",
      "Testing Methodology",
      "Deployment Strategy",
      "Budget Breakdown",
      "Project Timeline",
    ]),

    type: faker.helpers.arrayElement(DOCUMENT_TYPES),

    status: faker.helpers.arrayElement(DOCUMENT_STATUSES),

    target: faker.number.int({
      min: 1,
      max: 40,
    }),

    limit: faker.number.int({
      min: 0,
      max: 40,
    }),

    reviewer: faker.datatype.boolean(0.8) ? faker.person.fullName() : null,
  }));

  await db.documentSection.createMany({
    data: sections,
  });

  console.log(`✅ Created ${count} document sections`);
}

async function main() {
  console.log("🌱 Seeding database...");

  await db.documentSection.deleteMany();

  await seedDocumentSections(100);

  console.log("🎉 Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
