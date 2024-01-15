import { writeFileSync } from 'fs';
import { createFile } from '../create_file';

export default async (targetPath: string, content: string) => {
    await createFile(targetPath);
    writeFileSync(targetPath, content, 'utf8');
};