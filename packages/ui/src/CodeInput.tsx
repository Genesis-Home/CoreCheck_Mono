'use client';

import { Box, Group, Input, PinInput, UnstyledButton } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { type ReactNode, useId, useState } from 'react';
import { COLORS } from './theme';

/**
 * Digit boxes in the CoreCheck Figma style: two groups of three split by a
 * dash, entered digits in blue on a blue outline, empty boxes showing a pale
 * 0. Sizes scale with the screen so six boxes always fit.
 */
const CODE_CSS = `
.cc-code { --s: clamp(42px, 11.5vw, 62px); --g: 10px; --sep: 30px;
  position: relative; display: inline-block; max-width: 100%; }
.cc-code .mantine-PinInput-root { gap: var(--g); flex-wrap: nowrap; }
.cc-code .mantine-PinInput-pinInput { width: var(--s); flex: none; }
.cc-code .mantine-PinInput-pinInput:nth-of-type(3) { margin-right: var(--sep); }
.cc-code input { width: var(--s); height: var(--s); min-height: var(--s);
  border-radius: 10px; border: 1.5px solid #E3E8EF; background: #fff;
  font-size: calc(var(--s) * 0.5); font-weight: 500; line-height: 1;
  color: var(--mantine-color-brand-6); padding: 0; text-align: center;
  transition: border-color 120ms ease, box-shadow 120ms ease; }
.cc-code input::placeholder { color: #D0D5DD; opacity: 1; }
.cc-code input:not(:placeholder-shown) { border-color: var(--mantine-color-brand-5); }
.cc-code input:focus { border-color: var(--mantine-color-brand-6);
  box-shadow: 0 0 0 3px var(--mantine-color-brand-1); outline: none; }
.cc-code[data-error] input { border-color: var(--mantine-color-red-6); }
.cc-code-dash { position: absolute; width: 14px; height: 2px; border-radius: 2px;
  background: #D0D5DD; top: calc(var(--s) / 2 - 1px);
  left: calc(3 * var(--s) + 2 * var(--g) + (var(--g) + var(--sep)) / 2 - 7px); }
`;

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
  /** Hide the digits (PINs), with a control to show them; one-time codes stay visible. */
  secret?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const [shown, setShown] = useState(false);
  const id = useId();
  const masked = secret && !shown;
  return (
    <Input.Wrapper
      label={label}
      description={description}
      error={error}
      required
      id={id}
    >
      <style>{CODE_CSS}</style>
      <Box className="cc-code" data-error={error ? true : undefined}>
        <PinInput
          length={length}
          type="number"
          mask={masked}
          oneTimeCode={!secret}
          value={value}
          onChange={onChange}
          error={!!error}
          placeholder="0"
          getInputProps={(index) => ({
            'aria-label': `${label} digit ${index + 1} of ${length}`,
          })}
        />
        {length === 6 && <span className="cc-code-dash" aria-hidden />}
      </Box>
      {secret && (
        <Group justify="flex-end" mt={10}>
          <UnstyledButton
            onClick={() => setShown((value) => !value)}
            aria-pressed={shown}
            fz="sm"
            fw={500}
            c={COLORS.muted}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            {shown ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            {shown ? `Hide ${label}` : `Show ${label}`}
          </UnstyledButton>
        </Group>
      )}
    </Input.Wrapper>
  );
};
