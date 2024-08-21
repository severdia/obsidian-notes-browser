import { useContext } from "react";
import { AppContext } from "../utils/appContext";
import { App } from "obsidian";

export const useApp = (): App | undefined => {
	return useContext(AppContext);
};
