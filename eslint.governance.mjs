/**
 * Preset ESLint Flat Config — Governança AI-Era (Sentinel v2.0)
 * Importe ou espelhe estas regras no eslint.config.mjs do projeto para impedir
 * acúmulo e mistura de funções antes mesmo do commit.
 */

export const sentinelGovernanceRules = {
  'complexity': ['warn', { max: 10 }],
  'max-depth': ['warn', { max: 3 }],
  'max-params': ['warn', 3],
  'max-lines-per-function': [
    'warn',
    { max: 85, skipBlankLines: true, skipComments: true },
  ],
  'max-lines': [
    'warn',
    { max: 350, skipBlankLines: true, skipComments: true },
  ],
};

export default [
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    rules: sentinelGovernanceRules,
  },
];

