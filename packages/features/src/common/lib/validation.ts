import { utf8ToBytes } from "@noble/hashes/utils"
import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(4, "Password has to be at least 4 characters long")
  .max(48, "Password should be up to 48 characters")
