import { Badge } from '@mantine/core';
import {
  IconArchive,
  IconCircleCheck,
  IconCircleMinus,
  IconLock,
  IconPlayerPause,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import {
  ORGANISATION_STATUS_LABELS,
  type OrganisationStatus,
  USER_STATUS_LABELS,
  type UserStatus,
} from '@corecheck/shared';

interface Look {
  color: string;
  icon: ReactNode;
}

const ICON = 14;

const USER_LOOKS: Record<UserStatus, Look> = {
  active: { color: 'green', icon: <IconCircleCheck size={ICON} /> },
  inactive: { color: 'gray', icon: <IconCircleMinus size={ICON} /> },
  locked: { color: 'red', icon: <IconLock size={ICON} /> },
};

const ORGANISATION_LOOKS: Record<OrganisationStatus, Look> = {
  active: { color: 'green', icon: <IconCircleCheck size={ICON} /> },
  suspended: { color: 'orange', icon: <IconPlayerPause size={ICON} /> },
  archived: { color: 'gray', icon: <IconArchive size={ICON} /> },
};

/** Status always carries an icon and words as well as colour (DSH-AC-04, NFR-006). */
const StatusPill = ({ look, label }: { look: Look; label: string }) => (
  <Badge color={look.color} variant="light" leftSection={look.icon} radius="sm">
    {label}
  </Badge>
);

export const UserStatusBadge = ({ status }: { status: UserStatus }) => (
  <StatusPill look={USER_LOOKS[status]} label={USER_STATUS_LABELS[status]} />
);

export const OrganisationStatusBadge = ({
  status,
}: {
  status: OrganisationStatus;
}) => (
  <StatusPill
    look={ORGANISATION_LOOKS[status]}
    label={ORGANISATION_STATUS_LABELS[status]}
  />
);

export const ArchivedBadge = () => (
  <StatusPill
    look={{ color: 'gray', icon: <IconArchive size={ICON} /> }}
    label="Archived"
  />
);
