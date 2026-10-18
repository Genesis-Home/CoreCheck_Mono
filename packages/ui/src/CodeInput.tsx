import { Input, PinInput } from '@mantine/core';
import type { ReactNode } from 'react';

/**
 * A row of digit boxes for PINs and authenticator codes. Each box is named
 * for screen readers ("PIN digit 1 of 6"), not just the group (NFR-006).
 */
export const CodeInput = ({
  label,
  description,
  error,
  length = 6,
  secret = false,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  error?: ReactNode;
  length?: number;
  /** Hide the digits (PINs); one-time codes stay visible. */
  secret?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) => (
  <Input.Wrapper label={label} description={description} error={error} required>
    <PinInput
      length={length}
      type="number"
      mask={secret}
      oneTimeCode={!secret}
      value={value}
      onChange={onChange}
      error={!!error}
      mt={6}
      getInputProps={(index) => ({
        'aria-label': `${label} digit ${index + 1} of ${length}`,
      })}
    />
  </Input.Wrapper>
);
