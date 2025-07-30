
import { TicketStatus } from './types';

export const STATUS_WORKFLOW = [
  TicketStatus.Open,
  TicketStatus.InProgress,
  TicketStatus.Review,
  TicketStatus.Testing,
  TicketStatus.Done,
];

// In a real app, these would be 2 minutes (120000 ms).
// Using shorter times for demonstration purposes.
export const STATUS_PROGRESSION_TIMES: { [key in TicketStatus]?: number } = {
  [TicketStatus.Open]: 20000, // 20 seconds
  [TicketStatus.InProgress]: 20000, // 20 seconds
  [TicketStatus.Review]: 20000, // 20 seconds
  [TicketStatus.Testing]: 20000, // 20 seconds
};

export const STATUS_COLORS: { [key in TicketStatus]: string } = {
    [TicketStatus.Open]: 'bg-status-open',
    [TicketStatus.InProgress]: 'bg-status-progress',
    [TicketStatus.Review]: 'bg-status-review',
    [TicketStatus.Testing]: 'bg-status-testing',
    [TicketStatus.Done]: 'bg-status-done',
};

export const STATUS_TEXT_COLORS: { [key in TicketStatus]: string } = {
    [TicketStatus.Open]: 'text-status-open',
    [TicketStatus.InProgress]: 'text-status-progress',
    [TicketStatus.Review]: 'text-status-review',
    [TicketStatus.Testing]: 'text-status-testing',
    [TicketStatus.Done]: 'text-status-done',
};