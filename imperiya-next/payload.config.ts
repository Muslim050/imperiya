import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { ProfileSeries } from "./collections/ProfileSeries";
import { Services } from "./collections/Services";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — Imperiya CMS",
    },
  },
  collections: [Users, Media, ProfileSeries, Services],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./imperiya.db",
    },
  }),
  localization: {
    locales: [
      { label: "Русский", code: "ru" },
      { label: "O‘zbekcha", code: "uz" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "ru",
    fallback: true,
  },
  sharp,
});
