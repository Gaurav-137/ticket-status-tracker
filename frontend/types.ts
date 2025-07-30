
export enum TicketStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Review = 'Review',
  Testing = 'Testing',
  Done = 'Done',
}

export interface StatusHistory {
  status: TicketStatus;
  timestamp: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  history: StatusHistory[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}