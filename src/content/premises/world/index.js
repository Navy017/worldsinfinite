// Every premise of this family. Split in two lists so two writers never edit the same file.
import { PREMISES as A } from "./index_a.js";
import { PREMISES as B } from "./index_b.js";
export const PREMISES = [...A, ...B];
