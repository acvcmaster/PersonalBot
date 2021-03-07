import fs from 'fs';
import { Environment } from './environment';
import { PersonalBot } from './personalbot';

fs.readFile('env.json', (err, buffer) => {
    if (err) {
        throw err;
    }

    const json: string = buffer.toString('utf-8');
    const env: Environment = JSON.parse(json);

    const bot = new PersonalBot(env);
    bot.setup();
});
