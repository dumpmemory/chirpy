import * as RadixSelect from '@radix-ui/react-select';
import clsx from 'clsx';
import { m } from 'framer-motion';
import React from 'react';

import {
  disabled,
  borderHover,
  easeInOutTransition,
  focusRing,
} from '../../styles/common';
import { easeInOut } from '../animation';
import { IconChevronDown, IconChevronUp, IconCheck } from '../icons';

export type SelectProps = RadixSelect.SelectProps &
  Pick<RadixSelect.SelectTriggerProps, 'placeholder'> & {
    className?: string;
    onChange?: RadixSelect.SelectProps['onValueChange'];
  };

const _Select = React.forwardRef(function SelectComponent(
  props: SelectProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  return (
    <RadixSelect.Root
      {...props}
      onValueChange={props.onValueChange ?? props.onChange}
    >
      <RadixSelect.Trigger
        asChild
        className="bg-gray-0 transition duration-150 ease-in-out data-[placeholder]:font-normal data-[placeholder]:text-gray-900"
        ref={forwardedRef}
      >
        <button
          className={clsx(
            props.className,
            props.disabled && disabled,
            'inline-flex w-full touch-none select-none items-center justify-between border py-2.5 px-3.5 font-medium text-gray-1200 shadow-xs',
            !props.disabled && borderHover,
            focusRing,
            'focus-visible:border-primary-800',
            easeInOutTransition,
            'rounded-lg',
          )}
        >
          <RadixSelect.Value placeholder={props.placeholder} />
          <RadixSelect.Icon>
            <IconChevronDown size={20} />
          </RadixSelect.Icon>
        </button>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content asChild>
          <m.div {...easeInOut}>
            <RadixSelect.ScrollUpButton className="flex items-center justify-center text-gray-1200">
              <IconChevronUp />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport className="rounded-lg bg-gray-100 p-2 shadow-lg dark:bg-gray-300">
              {props.children}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton className="flex items-center justify-center text-gray-1200">
              <IconChevronDown />
            </RadixSelect.ScrollDownButton>
          </m.div>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
});

const SelectItem = React.forwardRef(
  (
    {
      children,
      className,
      ...props
    }: React.ComponentProps<typeof RadixSelect.Item>,
    forwardedRef: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <RadixSelect.Item
        ref={forwardedRef}
        className={clsx(
          className,
          'relative flex items-center justify-start rounded-md px-3.5 py-2.5 font-medium text-gray-1200 focus:bg-gray-300 dark:focus:bg-gray-500',
          'data-[disabled]:opacity-50',
          'select-none focus:outline-none',
        )}
        {...props}
      >
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        <RadixSelect.ItemIndicator className="absolute right-2 inline-flex items-center text-primary-900">
          <IconCheck size={20} />
        </RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    );
  },
);

SelectItem.displayName = 'Select.Item';
export const Select = Object.assign(_Select, {
  Item: SelectItem,
});
