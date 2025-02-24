import clsx from 'clsx';
import * as React from 'react';

import { Heading } from '../../components';
import { gradient } from '../../styles/common';

export type PageTitleProps = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<'div'>
>;

export function PageTitleDeprecated({
  children,
  className,
  ...restProps
}: PageTitleProps): JSX.Element {
  return (
    <div className={clsx('w-fit space-y-4', className)} {...restProps}>
      <Heading
        as="h1"
        className="w-fit !text-display-md font-bold !leading-none"
      >
        {children}
      </Heading>
      <div className={clsx('h-1 w-11 rounded', gradient)} />
    </div>
  );
}

export function PageTitle({
  children,
  className,
  ...restProps
}: PageTitleProps): JSX.Element {
  return (
    <div className={clsx('mb-6 w-fit', className)} {...restProps}>
      <Heading className="font-semibold">{children}</Heading>
    </div>
  );
}
