import TelegramBot, { Chat, Message } from 'node-telegram-bot-api';
import { Environment } from './environment';
import { timer } from 'rxjs';


export class PersonalBot {
    telegramBot: TelegramBot;
    chats: { [key: number]: Chat };

    constructor(environment: Environment) {
        this.telegramBot = new TelegramBot(environment?.token, { polling: true });
        this.chats = {};
    }

    setup() {
        this.telegramBot.on('message', (msg: Message) => {
            const chat = msg.chat;

            switch (msg?.text) {
                case 'add':
                    if (!this.chats[chat.id]) {
                        this.chats[chat.id] = chat;
                        this.sendMessage(chat.id, 'You have subscribed to \'PersonalBot\'.');
                    } else {
                        this.sendMessage(chat.id, 'Cannot subscribe. Reason: already subscribed.');
                    }
                    break;
                case 'remove':
                    if (this.chats[chat.id]) {
                        delete this.chats[chat.id];
                        this.sendMessage(chat.id, 'You have been removed of PersonalBot\'s subscriptions.');
                    } else {
                        this.sendMessage(chat.id, 'Cannot remove subscription. Reason: not subscribed.');
                    }
                    break;
                default:
                    this.processCommand(chat.id, msg?.text);
                    break;
            }
        });

        this.taskNotify();
    }

    processCommand(chatId: number, command: string | undefined) {
        if (!this.chats[chatId]) {
            this.sendMessage(chatId, `Cannot exexute command '${command}'. Reason: not subscribed.`);
            return;
        }

        const chat = this.chats[chatId];

        switch (command) {
            case 'name':
                this.sendMessage(chatId, `Your name is: '${chat.first_name}'.`)
                break;
            default:
                this.sendMessage(chatId, `Cannot exexute command '${command}'. Reason: no such command.`);
                break;
        }
    }

    sendMessage(chatId: number, message: string) {
        this.telegramBot.sendMessage(chatId, message);
    }

    taskNotify() {
        timer(0, 5000).subscribe(() => {
            for (const prop in this.chats) {
                if (this.chats.hasOwnProperty(prop)) {
                    const chatId = +prop;
                    this.sendMessage(chatId, "You are receiving this message because you have subscribed. Cancel your subscription to stop receiving.");
                }
            }
        });
    }
}
