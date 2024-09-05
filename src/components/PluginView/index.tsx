import { TreeView } from "components/TreeView";
import { NotesView } from "components/NotesView";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

export function PluginUI() {
  return (
    <PanelGroup
      direction="horizontal"
      autoSaveId="persistence"
      className="onb-fixed onb-w-full !onb-top-0 !onb-left-0 onb-h-full"
    >
      <Panel defaultSize={50} minSize={40}>
        <TreeView />
      </Panel>
      <PanelResizeHandle className="onb-w-[var(--divider-width)] onb-bg-[var(--divider-color)]" />
      <Panel defaultSize={50} minSize={20}>
        <NotesView />
      </Panel>
    </PanelGroup>
  );
}
