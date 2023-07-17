import { writeFileSync } from 'fs';
import { createFile } from '../create_file';

export default async (targetPath: string, content: string) => {
    console.log('file saver ', targetPath);
    await createFile(targetPath);
    writeFileSync(targetPath, content, 'utf8');
};