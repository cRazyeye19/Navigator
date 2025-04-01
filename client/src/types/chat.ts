import { Task } from "./tasks";

export interface ChatPanelProps {
  isPanelVisible: boolean;
  panelWidth: number;
  activeChatTab: string;
  setActiveChatTab: (tab: string) => void;
  task: Task | null;
  tasks: Task[];
  setIsPanelVisible: (visible: boolean) => void;
}

export interface ChatTabsProps {
  activeChatTab: string;
  setActiveChatTab: (tab: string) => void;
}

export interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPanelVisible: boolean;
  setIsPanelVisible: (visible: boolean) => void;
  // task: Task | null;
  tasks: Task[];
}

export interface ChatContentProps {
  // task: Task | null;
  tasks: Task[];
}

export interface ChatInputProps {
  task: Task | null;
}
