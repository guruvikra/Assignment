
import fs from 'fs';
import path from 'path';

console.log(process.cwd())
const logFilePath = path.join(process.cwd(), 'log', 'task-log.txt'); // Adjust the path as needed


export async function logTaskCompletion(user_id) {
    const message = `${user_id} - task completed at - ${new Date().toISOString()}\n`;
    console.log(message.trim());
    fs.appendFile(logFilePath, message, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}