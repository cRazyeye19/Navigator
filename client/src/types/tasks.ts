import React from "react";

export interface AutomationTask {
  id: number;
  icons: React.ReactNode;
  text: string;
}

export interface Task {
  id: string;
  sessionId: string;
  userId: string;
  userEmail: string;
  displayName: string;
  photoUrl: string;
  task: string;
  status: string;
  result: string;
  createdAt: any;
  updatedAt: any;
  startedAt: any;
  completedAt: any;
}
