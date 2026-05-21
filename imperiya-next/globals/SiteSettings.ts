import type { GlobalConfig } from "payload";

/**
 * Single-instance settings the client edits most often: contacts, hero copy,
 * footer tagline. All text fields are localized (RU/UZ/EN).
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: { group: "Контент" },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Контакты",
          fields: [
            {
              name: "phone",
              type: "text",
              required: true,
              defaultValue: "+998 99 400 40 40",
            },
            {
              name: "email",
              type: "email",
            },
            {
              name: "address",
              type: "text",
              localized: true,
              defaultValue:
                "Таш. область, Янгиюльский район, ул. Тахтакуприк, 18 А",
            },
            {
              name: "mapQuery",
              type: "text",
              admin: {
                description: "Text used to build the Yandex/Google map link.",
              },
              defaultValue: "Янгиюльский район, улица Тахтакуприк, 18А",
            },
            {
              name: "schedule",
              type: "text",
              localized: true,
              defaultValue: "Ежедневно 9:00 — 20:00",
            },
          ],
        },
        {
          label: "Hero",
          fields: [
            {
              name: "heroTitle1",
              type: "text",
              localized: true,
              defaultValue: "Окна нового",
            },
            {
              name: "heroTitle2",
              type: "text",
              localized: true,
              defaultValue: "поколения",
            },
            {
              name: "heroSubtitle",
              type: "text",
              localized: true,
              defaultValue:
                "Энергоэффективность, тишина и комфорт в каждом доме.",
            },
          ],
        },
        {
          label: "Социальные сети",
          fields: [
            { name: "telegram", type: "text" },
            { name: "instagram", type: "text" },
            { name: "youtube", type: "text" },
          ],
        },
        {
          label: "О компании",
          fields: [
            {
              name: "aboutTagline",
              type: "textarea",
              localized: true,
              defaultValue:
                "Производим окна, двери и фасадные системы под ключ в Узбекистане с 2010 года.",
            },
          ],
        },
      ],
    },
  ],
};
