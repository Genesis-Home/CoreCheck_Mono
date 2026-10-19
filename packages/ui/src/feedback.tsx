import { Alert, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { modals } from '@mantine/modals';
import { IconAlertTriangle, IconInbox } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import type { ApiError } from '@corecheck/shared';

/**
 * Toasts as on CoreStock (react-toastify, top right, closing on their own),
 * coloured like the CoreCheck Figma: pale tint, matching border and text.
 */
const TOAST_CSS = `
:root {
  --toastify-color-success: #ECFDF3;
  --toastify-text-color-success: #067647;
  --toastify-color-progress-success: #17B26A;
  --toastify-color-error: #FEF3F2;
  --toastify-text-color-error: #B42318;
  --toastify-color-progress-error: #F04438;
  --toastify-color-info: #EFF8FF;
  --toastify-text-color-info: #175CD3;
  --toastify-color-progress-info: #2E90FA;
  --toastify-color-warning: #FFFAEB;
  --toastify-text-color-warning: #B54708;
  --toastify-color-progress-warning: #F79009;
  --toastify-font-family: inherit;
  --toastify-toast-min-height: 52px;
}
.Toastify__toast { border-radius: 10px; font-size: 14px; font-weight: 500;
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.08); }
.Toastify__toast--success { border: 1px solid #75E0A7; }
.Toastify__toast--error { border: 1px solid #FDA29B; }
.Toastify__toast--info { border: 1px solid #84CAFF; }
.Toastify__toast--warning { border: 1px solid #FEC84B; }
.Toastify__toast-icon svg { fill: currentColor; }
.Toastify__close-button { color: currentColor; opacity: 0.7; align-self: center; }
.Toastify__progress-bar--wrp { height: 3px; }
`;

/** Mount once near the root of each app. */
export const Toaster = () => (
  <>
    <style>{TOAST_CSS}</style>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnHover
      pauseOnFocusLoss
      draggable
      theme="colored"
      transition={Slide}
    />
  </>
);

export const notifySuccess = (message: string): void => {
  toast.success(message);
};

export const notifyInfo = (message: string): void => {
  toast.info(message);
};

// The reference helps support trace a server fault; expected refusals
// (wrong PIN, no permission) read better without it.
const errorText = (error: ApiError): string =>
  error.requestId && (error.statusCode >= 500 || error.statusCode === 0)
    ? `${error.message} (Reference ${error.requestId.slice(0, 8)})`
    : error.message;

export const notifyError = (error: ApiError): void => {
  // One toast per message: a retried action does not stack duplicates.
  toast.error(errorText(error), { toastId: `error:${errorText(error)}` });
};

/**
 * Shows field errors next to their inputs (VAL-002). The toast for the failure
 * comes from actionToasts. Field names follow the API's dotted paths.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showApiErrors = (
  form: UseFormReturnType<any>,
  error: ApiError,
): void => {
  if (!error.fieldErrors?.length) return;
  form.setErrors(
    Object.fromEntries(
      error.fieldErrors.map((item) => [item.field, item.message]),
    ),
  );
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
