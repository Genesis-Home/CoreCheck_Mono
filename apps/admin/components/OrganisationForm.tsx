'use client';

import {
  Button,
  Fieldset,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { FormEvent } from 'react';

export interface OrganisationValues {
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  country: string;
  timeZone: string;
  seatLimit: number | string;
  startsOn: string;
  expiresOn: string;
  firstAdmin?: { firstName: string; lastName: string; email: string };
}

/** Every IANA zone the browser knows; fixed for the page's lifetime. */
const TIME_ZONES: string[] = (() => {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return ['UTC', 'Europe/London'];
  }
})();

/** The organisation fields of IAD-002, shared by create and edit. */
export function OrganisationForm({
  form,
  onSubmit,
  submitLabel,
  loading,
  withFirstAdmin,
}: {
  form: UseFormReturnType<OrganisationValues>;
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  loading: boolean;
  withFirstAdmin?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <Stack>
        <Fieldset legend="Organisation">
          <Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label="Organisation name"
                required
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Industry"
                required
                {...form.getInputProps('industry')}
              />
            </SimpleGrid>
            <Textarea
              label="Address"
              required
              autosize
              minRows={2}
              {...form.getInputProps('address')}
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label="Country"
                required
                {...form.getInputProps('country')}
              />
              <Select
                label="Time zone"
                description="Due dates, expiry and audit times use this zone."
                data={TIME_ZONES}
                searchable
                required
                {...form.getInputProps('timeZone')}
              />
            </SimpleGrid>
          </Stack>
        </Fieldset>
        <Fieldset legend="Primary contact">
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <TextInput
              label="Name"
              required
              {...form.getInputProps('contactName')}
            />
            <TextInput
              label="Email"
              type="email"
              required
              {...form.getInputProps('contactEmail')}
            />
            <TextInput
              label="Telephone"
              required
              {...form.getInputProps('contactPhone')}
            />
          </SimpleGrid>
        </Fieldset>
        <Fieldset legend="Account">
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <NumberInput
              label="User seat limit"
              min={1}
              required
              {...form.getInputProps('seatLimit')}
            />
            <TextInput
              label="Account start date"
              type="date"
              required
              {...form.getInputProps('startsOn')}
            />
            <TextInput
              label="Account expiry date"
              type="date"
              required
              {...form.getInputProps('expiresOn')}
            />
          </SimpleGrid>
        </Fieldset>
        {withFirstAdmin && (
          <Fieldset legend="First Organisation Admin">
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <TextInput
                label="First name"
                required
                {...form.getInputProps('firstAdmin.firstName')}
              />
              <TextInput
                label="Last name"
                required
                {...form.getInputProps('firstAdmin.lastName')}
              />
              <TextInput
                label="Email (optional)"
                type="email"
                {...form.getInputProps('firstAdmin.email')}
              />
            </SimpleGrid>
          </Fieldset>
        )}
        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
