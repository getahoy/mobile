import { Uniwind } from "uniwind";
import { readAppearance } from "./storage/appearanceStorage";

// Before the root renders; iOS repaints the native splash in this theme at once.
Uniwind.setTheme(readAppearance());
