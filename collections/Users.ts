import type { CollectionConfig } from "payload";

/** Admin users. Payload requires at least one auth collection. */
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
