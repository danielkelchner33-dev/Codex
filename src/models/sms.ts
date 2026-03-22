// ============================================================
// StagParty.io — SMS Agent Types
// AI Concierge that texts the crew so nobody needs to download an app
// ============================================================

export interface SMSMessage {
  id: string;
  to: string;           // phone number E.164 format
  from: string;         // Twilio number
  body: string;
  partyId: string;
  attendeeId: string;
  type: SMSMessageType;
  status: SMSStatus;
  sentAt: string;
  deliveredAt?: string;
  responseReceived?: string;
}

export type SMSMessageType =
  | "rsvp_invite"       // "Hey Mike, you're invited to Dan's bachelor party..."
  | "rsvp_reminder"     // "Hey Mike, we still need your RSVP..."
  | "vote_request"      // "Quick vote: When should Dan's bachelor party be? Reply 1/2/3"
  | "vote_reminder"     // "Hey, haven't voted yet on..."
  | "payment_request"   // "Your share is $420. Venmo @MikeT-bestman"
  | "payment_reminder"  // "Hey, payment still outstanding..."
  | "itinerary_share"   // "Here's the itinerary for Dan's bachelor party..."
  | "day_of_alert"      // "Ferry leaves in 45 min! Head to the terminal"
  | "custom";           // Best man sends custom message to crew

export type SMSStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "failed"
  | "response_received";

export interface SMSConversation {
  attendeeId: string;
  phone: string;
  messages: SMSMessage[];
  lastMessageAt: string;
  status: "active" | "opted_out";
}

// Templates for the AI concierge
export const SMS_TEMPLATES = {
  rsvp_invite: (groomName: string, bestManName: string, dates: string) =>
    `Hey! ${bestManName} here. You're invited to ${groomName}'s bachelor party ${dates}. Can you make it?\n\nReply:\nY = I'm in\nM = Maybe\nN = Can't make it`,

  vote_request: (question: string, options: string[]) =>
    `Quick vote: ${question}\n\n${options.map((o, i) => `${i + 1}) ${o}`).join("\n")}\n\nReply with your number.`,

  payment_request: (amount: number, venmo: string) =>
    `Your share for the bachelor party is $${amount}. Venmo: ${venmo}\n\nReply PAID when done.`,

  day_of_alert: (message: string) =>
    `🎉 PARTY ALERT: ${message}`,

  itinerary_share: (url: string) =>
    `The itinerary is locked in! Check it out: ${url}`,
} as const;
