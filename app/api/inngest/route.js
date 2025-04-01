import { serve } from "inngest/next";
import {
  inngest,
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
} from "@/config/innjest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // <-- This is where you'll always add all your functions
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
  ],
});
