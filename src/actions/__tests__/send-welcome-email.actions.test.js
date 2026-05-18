/**
 * Tests for sendWelcomeEmailAction
 * 
 * This test suite verifies the welcome email sending functionality
 * using Jest mocks for external dependencies.
 */

// Mock dependencies BEFORE importing the module under test
const mockSend = jest.fn()

jest.mock("@/env", () => ({
  env: {
    EMAIL_FROM: "from@example.com",
    EMAIL_TO: "to@example.com",
    NEXT_PUBLIC_BASE_URL: "https://example.com",
  },
}))

jest.mock("@/lib/resend", () => ({
  resend: {
    emails: {
      send: mockSend,
    },
  },
}))

// Import after all mocks are set up
const { sendWelcomeEmailAction } = require("../send-welcome-email.actions")

describe("sendWelcomeEmailAction", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("successful email sending", () => {
    it("should send a welcome email with correct parameters", async () => {
      mockSend.mockResolvedValue({ error: null })

      const result = await sendWelcomeEmailAction()

      expect(mockSend).toHaveBeenCalledTimes(1)
      
      // Verify the call was made with the correct structure
      const callArgs = mockSend.mock.calls[0][0]
      expect(callArgs).toMatchObject({
        from: "from@example.com",
        to: "to@example.com",
        subject: "Welcome to Next Starter!",
      })
      
      // Verify react prop exists (it's a React component)
      expect(callArgs.react).toBeDefined()
      
      expect(result).toEqual({ success: true })
    })
  })

  describe("error handling", () => {
    it("should return error object when email sending fails", async () => {
      const errorMessage = "Failed to send email"
      mockSend.mockResolvedValue({ error: errorMessage })

      const result = await sendWelcomeEmailAction()

      expect(mockSend).toHaveBeenCalledTimes(1)
      expect(result).toEqual({
        success: false,
        message: errorMessage,
      })
    })

    it("should handle unknown errors", async () => {
      mockSend.mockResolvedValue({ error: "Unknown error occurred" })

      const result = await sendWelcomeEmailAction()

      expect(result.success).toBe(false)
      expect(result.message).toBeDefined()
    })
  })
})
