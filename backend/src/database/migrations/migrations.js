import { migration001 } from "./001_initial_schema.js";
import { migration002 } from "./002_seed_authorization.js";

export const migrations = [migration001, migration002];
