import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const sapphireConfig = compat.extends('@sapphire').map(config => {
    if (config.rules && config.rules['@typescript-eslint/no-throw-literal']) {
        const { '@typescript-eslint/no-throw-literal': _, ...rest } = config.rules;
        return {
            ...config,
            rules: {
                ...rest,
                '@typescript-eslint/only-throw-error': 'off' // or whatever value it had, but sapphire turns it off usually or warns. Safe to set off or map value.
            }
        };
    }
    return config;
});

export default [
    ...sapphireConfig,
    {
        rules: {
            '@typescript-eslint/no-base-to-string': 'off'
        }
    }
];
