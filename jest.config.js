const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "node",
  coverageProvider: "v8",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/emails/",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(react-email|@react-email)/)",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
}

module.exports = createJestConfig(customJestConfig)
