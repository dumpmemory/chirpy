import { cpDayjs } from '@chirpy-dev/utils';
import * as React from 'react';

import { logger } from '../../utilities';
import { trpcClient } from '../../utilities/trpc-client';
import { useCurrentUser } from '../current-user-context';
import {
  checkServiceWorkerCompatibility,
  urlBase64ToUint8Array,
} from './utilities';

export type RegisterNotificationSubscription = () => Promise<boolean>;
const NOTIFICATION_REGISTER_EXPIRED_AT =
  'chirpy.notification-subscription.expired-at';

export function useRegisterNotificationSubscription(): RegisterNotificationSubscription {
  const { isSignIn } = useCurrentUser();
  const { mutateAsync: registerDevice } =
    trpcClient.notification.register.useMutation();

  // It's safe to register the service worker multiply times
  return React.useCallback(async () => {
    if (!isSignIn) {
      return false;
    }
    if (!checkServiceWorkerCompatibility()) {
      throw new Error(`Service worker not supported`);
    }
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      if (!registration?.pushManager) {
        // Not supported
        return false;
      }
      const expiredData = sessionStorage.getItem(
        NOTIFICATION_REGISTER_EXPIRED_AT,
      );
      if (expiredData && cpDayjs().isBefore(cpDayjs(expiredData))) {
        return false;
      }
      const vapidKey = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID);
      const subscription = await registration.pushManager.subscribe({
        // This means all push events will result in a notification
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      try {
        // Save the subscription details to server
        await registerDevice({
          subscription,
        });
        sessionStorage.setItem(
          NOTIFICATION_REGISTER_EXPIRED_AT,
          // Revalidate in a shorter time,
          // in case the subscription is invalid,
          // e.g. user disabled the permission,
          // or switch to another account
          cpDayjs().add(1, 'd').toISOString(),
        );
        return true;
      } catch (error) {
        sessionStorage.removeItem(NOTIFICATION_REGISTER_EXPIRED_AT);
        logger.warn('Register notification subscription failed', error);
        throw error;
      }
    } catch (error) {
      logger.error('Service worker registration failed', error);
      throw error;
    }
  }, [registerDevice, isSignIn]);
}
