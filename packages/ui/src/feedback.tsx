import { Alert, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconCheck,
  IconInbox,
  IconX,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import type { ApiError } from '@corecheck/shared';

export const notifySuccess = (message: string): void => {
  notifications.show({
    color: 'green',
    icon: <IconCheck size={18} />,
    message,
  });
};

export const notifyError = (error: ApiError): void => {
  notifications.show({
    color: 'red',
    icon: <IconX size={18} />,
    title: 'That did not work',
    message: error.requestId
      ? `${error.message} (Reference ${error.requestId.slice(0, 8)})`
      : error.message,
  });
};

/**
 * Shows field errors next to their inputs (VAL-002) and anything else as a
 * notification. Field names follow the API's dotted paths.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showApiErrors = (
  form: UseFormReturnType<any>,
  error: ApiError,
): void => {
  if (error.fieldErrors?.length) {
    form.setErrors(
      Object.fromEntries(
        error.fieldErrors.map((item) => [item.field, item.message]),
      ),
    );
    return;
  }
  notifyError(error);
};

export const ErrorAlert = ({
  error,
  title = 'Could not load this',
}: {
  error: ApiError;
  title?: string;
}) => (
  <Alert color="red" icon={<IconAlertTriangle size={18} />} title={title}>
    {error.message}
    {error.requestId && (
      <Text size="xs" c="dimmed" mt={4}>
        Reference {error.requestId.slice(0, 8)}
      </Text>
    )}
  </Alert>
);

/** Explains why a list is empty and offers the next step (LST-005). */
export const EmptyState = ({
  title,
  message,
  action,
}: {
  title: string;
  message?: string;
  action?: ReactNode;
}) => (
  <Stack align="center" gap="xs" py="xl">
    <ThemeIcon variant="light" size={48} radius="xl" color="gray">
      <IconInbox size={26} />
    </ThemeIcon>
    <Title order={4} ta="center">
      {title}
    </Title>
    {message && (
      <Text c="dimmed" ta="center" maw={420}>
        {message}
      </Text>
    )}
    {action}
  </Stack>
);

interface ConfirmOptions {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
}

export const confirmAction = ({
  title,
  message,
  confirmLabel,
  danger,
  onConfirm,
}: ConfirmOptions): void => {
  modals.openConfirmModal({
    title,
    children:
      typeof message === 'string' ? <Text size="sm">{message}</Text> : message,
    labels: { confirm: confirmLabel, cancel: 'Cancel' },
    confirmProps: { color: danger ? 'red' : undefined },
    onConfirm: () => void onConfirm(),
  });
};
