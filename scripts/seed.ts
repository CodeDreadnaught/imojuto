import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { requireEnv } from "@/lib/env";
import { RequestCategory, Role, User } from "@/models";
import { slugify } from "@/lib/utils";

const roles = [
  {
    name: "student_staff",
    label: "Student/Staff",
    permissions: ["request:create", "request:read:own", "request:reopen:own"],
  },
  {
    name: "maintenance_officer",
    label: "Maintenance Officer",
    permissions: ["request:read:assigned", "request:update_status"],
  },
  {
    name: "admin",
    label: "Administrator",
    permissions: [
      "request:read:all",
      "request:assign",
      "request:reopen:any",
      "category:manage",
      "user:manage",
      "activity:read",
      "activity:export",
    ],
  },
] as const;

const categories = [
  "Electrical",
  "Plumbing",
  "Furniture",
  "Internet",
  "Classroom Equipment",
  "Hostel Maintenance",
];

async function seed() {
  await connectDb();

  const roleDocs = await Promise.all(
    roles.map((role) =>
      Role.findOneAndUpdate({ name: role.name }, role, {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
      }),
    ),
  );

  await Promise.all(
    categories.map((name) =>
      RequestCategory.findOneAndUpdate(
        { slug: slugify(name) },
        { name, slug: slugify(name), isActive: true },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
      ),
    ),
  );

  const adminRole = roleDocs.find((role) => role.name === "admin");
  if (!adminRole) {
    throw new Error("Admin role was not created");
  }

  const passwordHash = await bcrypt.hash(String(requireEnv("ADMIN_SEED_PASSWORD")), 12);
  await User.findOneAndUpdate(
    { email: String(requireEnv("ADMIN_SEED_EMAIL")).toLowerCase() },
    {
      name: "System Administrator",
      email: String(requireEnv("ADMIN_SEED_EMAIL")).toLowerCase(),
      passwordHash,
      roleId: adminRole._id,
      isActive: true,
    },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
  );

  console.log("Seed complete");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
