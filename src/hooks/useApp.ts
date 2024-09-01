import { useContext } from "react";
import { PluginContext } from "utils";
import { App } from "obsidian";

export const useApp = (): App | undefined => {
  return useContext(PluginContext)?.app;
};
