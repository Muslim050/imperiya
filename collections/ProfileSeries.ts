import type { CollectionConfig } from "payload";

/**
 * Series of window profiles (Thermo 70, Engelberg 7000, BCF 48, ...).
 * Specs & images per the TZ ("характеристики и картинки скину файлом")
 * are filled in by the client through the admin.
 */
export const ProfileSeries: CollectionConfig = {
  slug: "profile-series",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "slug"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "Display name, e.g. Thermo 70" },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "URL slug. Becomes /profile/<slug>. Use lowercase letters and hyphens.",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "pvc",
      options: [
        { label: "ПВХ профили", value: "pvc" },
        { label: "Фасадные системы", value: "facade" },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { description: "Cover image shown in the series grid." },
    },
    {
      name: "description",
      type: "richText",
      localized: true,
      admin: { description: "Specs and details, shown on the detail page." },
    },
  ],
};
