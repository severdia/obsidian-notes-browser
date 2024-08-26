import { useContext } from "react";
import { pluginContext } from "../utils/pluginContext";
import { Plugin } from "obsidian";

export const usePlugin = (): Plugin | undefined => {
	return useContext(pluginContext);
};
