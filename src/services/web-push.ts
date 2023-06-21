import webpush from 'web-push';


interface Iclient {
  expirationTime: string | null;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
const options = {
  vapidDetails: {
    subject: 'mailto:synapme@gmail.com',
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
  },
};

export const sendNotification = async (
  client: Iclient,
  data: any
): Promise<void> => {
  try {
    await webpush.sendNotification(client, JSON.stringify(data), options);
  } catch (error: any) {
    throw {
      type: 'notification',
      message: 'Notification failed to sent',
    };
  }
};

