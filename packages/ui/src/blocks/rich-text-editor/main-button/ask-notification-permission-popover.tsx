import * as React from 'react';

import {
  Button,
  Heading,
  Popover,
  IPopoverButtonProps,
  Text,
} from '../../../components';

export interface IAskNotificationPermissionPopoverProps {
  onClickAskNextTime: () => void;
  onClickSure: () => void;
  buttonProps: Omit<IPopoverButtonProps, 'children'>;
  children: React.ReactNode;
}

export function AskNotificationPermissionPopover({
  onClickAskNextTime,
  onClickSure,
  buttonProps,
  children,
}: IAskNotificationPermissionPopoverProps): JSX.Element {
  return (
    <Popover>
      <Popover.Button {...buttonProps} className="!py-2">
        {children}
      </Popover.Button>
      <Popover.Panel autoClose={false} placement="topEnd">
        <section className="w-64">
          <Heading as="h5" className="font-bold">
            Get notification for replies
          </Heading>
          <Text size="sm" className="mt-2" variant="secondary">
            Get a push notification if there is a reply to your comment
          </Text>
          <div className="mt-5 space-x-2">
            <Button size="sm" onClick={onClickAskNextTime}>
              Ask next time
            </Button>
            <Button size="sm" variant="primary" onClick={onClickSure}>
              Sure
            </Button>
          </div>
        </section>
      </Popover.Panel>
    </Popover>
  );
}
