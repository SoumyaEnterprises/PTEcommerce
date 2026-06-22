// To go live with Supabase later:
//   1. Create `supabase-adapter.ts` implementing the `DataAdapter` interface
//      from `./adapter` against real tables (see README.md for schema).
//   2. Replace the import below.
// Nothing else in the app imports `mock-adapter` directly, so this is the
// only line that needs to change.

import { mockAdapter } from "./mock-adapter";
import type { DataAdapter } from "./adapter";

export const dataAdapter: DataAdapter = mockAdapter;

export type { DataAdapter, PaginatedResult } from "./adapter";
