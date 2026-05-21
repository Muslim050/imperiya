import type { CollectionConfig } from "payload";

/** Service tiles shown in the "Наши услуги" section. */
export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order"],
  },
  defaultSort: "order",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Smaller numbers appear first.",
      },
    },
  ],
};
