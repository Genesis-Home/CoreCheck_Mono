'use client';

import { Button, Stack, Text } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { z } from 'zod';
import {
  type ApiError,
  changePinSchema,
  type MeResponse,
} from '@corecheck/shared';
import { CodeInput, showApiErrors } from '@corecheck/ui';
import { useChangePinMutation } from '../lib/api';

const formSchema = changePinSchema
  .and(z.object({ confirmPin: z.string() }))
  .refine((values) => values.confirmPin === values.newPin, {
    path: ['confirmPin'],
    message: 'The two new PINs do not match.',
  });

/** Replaces the current PIN; used for the forced first change and from the profile. */
export function ChangePinForm({
  onChanged,
  temporary,
}: {
  onChanged: (me: MeResponse) => void;
  temporary: boolean;
}) {
  const [changePin, { isLoading }] = useChangePinMutation();
  const form = useForm({
    initialValues: { currentPin: '', newPin: '', confirmPin: '' },
    validate: schemaResolver(formSchema, { sync: true }),
  });

  const submit = form.onSubmit(async ({ currentPin, newPin }) => {
    const result = await changePin({ currentPin, newPin });
    if (result.error) {
      showApiErrors(form, result.error as ApiError);
      return;
    }
    form.reset();
    onChanged(result.data);
  });

  return (
    <form onSubmit={submit} noValidate>
      <Stack gap="md">
        <CodeInput
          secret
          label={temporary ? 'Temporary PIN' : 'Current PIN'}
          {...form.getInputProps('currentPin')}
        />
        <CodeInput
          secret
          label="New PIN"
          description="Six digits. Avoid repeated digits and sequences such as 123456."
          {...form.getInputProps('newPin')}
        />
        <CodeInput
          secret
          label="Confirm new PIN"
          {...form.getInputProps('confirmPin')}
        />
        <Text size="xs" c="dimmed">
          Never share your PIN. CoreCheck staff will never ask for it.
        </Text>
        <Button type="submit" loading={isLoading}>
          {temporary ? 'Set my PIN' : 'Change PIN'}
        </Button>
      </Stack>
    </form>
  );
}
