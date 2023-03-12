import { envParseString } from '@skyra/env-utilities';
import { getRootData } from '@sapphire/pieces';
import { join } from 'node:path';

export const mainFolder = getRootData().root;
export const rootFolder = join(mainFolder, '..');

export const OWNER = envParseString('OWNER');
export const dev = envParseString('NODE_ENV') !== 'production';
