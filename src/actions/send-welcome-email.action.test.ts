import type { Mock } from "vitest";
import { resend } from "@/lib/resend/resend-client";
import { sendWelcomeEmailAction } from "./send-welcome-email.action";

vi.mock("@/lib/resend/resend-client", () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
}));

vi.mock("@/env", () => ({
  env: {
    EMAIL_FROM: "from@example.com",
    EMAIL_TO: "to@example.com",
  },
}));

describe("sendWelcomeEmailAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send welcome email successfully", async () => {
    (resend.emails.send as Mock).mockResolvedValue({
      error: null,
    });

    const result = await sendWelcomeEmailAction({ email: "to@example.com" });

    expect(result).toEqual({
      success: true,
    });

    expect(resend.emails.send).toHaveBeenCalledTimes(1);

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "from@example.com",
        to: "to@example.com",
        subject: "Welcome to Next Starter!",
      }),
    );
  });

  it("should return error when email sending fails", async () => {
    const mockError = {
      message: "Failed to send email",
    };

    (resend.emails.send as Mock).mockResolvedValue({
      error: mockError,
    });

    const result = await sendWelcomeEmailAction({ email: "to@example.com" });

    expect(result).toEqual({
      success: false,
      message: "Failed to send email",
    });

    expect(resend.emails.send).toHaveBeenCalledTimes(1);
  });
});
