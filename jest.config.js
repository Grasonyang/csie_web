module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/resources/js/__tests__/setup.ts'],
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/resources/js/$1',
    },
    testMatch: [
        '<rootDir>/resources/js/**/__tests__/**/*.test.{ts,tsx}',
        '<rootDir>/resources/js/**/*.test.{ts,tsx}',
    ],
    collectCoverageFrom: [
        'resources/js/**/*.{ts,tsx}',
        '!resources/js/**/__tests__/**',
        '!resources/js/**/*.d.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
};
