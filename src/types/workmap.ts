/**
 * Types specific to the WorkMap functionality
 */
import type { BaseComponentProps, WithChildren, WithId } from './common';

/**
 * Goal status values
 * 
 * Progress states:
 * - on_track: Goal is currently in progress and on track
 * - caution/issue: Goal is at risk or needs attention
 * - paused: Goal is temporarily paused
 * - pending: Goal is waiting to start or for approval
 * 
 * Completion states (per goal completion model):
 * - achieved: Goal was fully accomplished (green)
 * - partial: Goal was partially accomplished (amber/yellow)
 * - missed: Goal was not accomplished (red)
 * 
 * Legacy/alternative states:
 * - completed: Legacy term for achieved
 * - dropped: Goal was intentionally abandoned
 */
export type GoalStatus = 
  // Progress states
  | 'on_track' 
  | 'caution'
  | 'issue'
  | 'paused'
  | 'pending'
  // Completion states
  | 'achieved'   // Goal fully accomplished (green)
  | 'partial'    // Goal partially accomplished (amber/yellow)
  | 'missed'     // Goal not accomplished (red)
  // Legacy/alternative states
  | 'completed'  // Legacy term for achieved
  | 'dropped';   // Goal abandoned

/**
 * StatusBadge component props
 */
export interface StatusBadgeProps extends BaseComponentProps {
  status: GoalStatus | string;
}

/**
 * WorkMap entry/row props (basic version)
 */
export interface WorkMapEntryProps extends WithId {
  title: string;
  description?: string;
  status: GoalStatus;
  dueDate?: string | Date;
  owner?: string;
  progress?: number; // 0-100
}

/**
 * Props for WorkMapTable component
 */
export interface WorkMapTableProps extends BaseComponentProps, WithChildren {
  entries?: WorkMapEntryProps[];
  loading?: boolean;
  onEntrySelect?: (entry: WorkMapEntryProps) => void;
}

/**
 * Props for TableRow component
 */
export interface TableRowProps extends BaseComponentProps, WithChildren {
  entry: WorkMapEntryProps;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * Props for ProgressBar component
 */
export interface ProgressBarProps extends BaseComponentProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}
