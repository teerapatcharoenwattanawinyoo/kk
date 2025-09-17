import { z } from "zod";

export const teamFileSchema = z.custom<File>(
  (val) => {
    if (!val) return true;
    if (!(val instanceof File)) return false;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (!validTypes.includes(val.type)) return false;
    if (val.size > 10 * 1024 * 1024) return false;

    return true;
  },
  {
    message:
      "File must be a valid image (PNG, JPG, JPEG) or PDF, and less than 10MB",
  }
);

export type TeamFile = z.infer<typeof teamFileSchema>;
