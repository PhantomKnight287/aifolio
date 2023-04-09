import { SUPABASE_KEY, SUPABASE_URL } from "@/constants";
import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient<Database>(SUPABASE_URL!, SUPABASE_KEY!);
