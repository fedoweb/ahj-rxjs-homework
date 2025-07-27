import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import MessageService from './MessageService';

export default class MessageWidget {
  constructor(container) {
    this.container = container;
    this.service = null;
    this.POOL_INTERVAL = 10000;
    this.obs$ = null;

    this.init();
  }

  init() {
    this.service = new MessageService('http://localhost:3000/messages/unread');
    this.startPolling();
  }

  startPolling() {
    //делаем запрос на сервер с интервалом
    this.obs$ = interval(this.POOL_INTERVAL).pipe(
      startWith(0),
      switchMap(() => this.service.getNewMessages())
    );
    
    //подписываемся на поток
    this.obs$.subscribe({
      next: messages => this.handleMessages(messages), //обработка сообщений
      error: err => console.log(err)
    });
  }

  handleMessages(messages) {
    messages.forEach(message => {
      this.renderMessage(message);
    });
  }

  renderMessage(message) {
    console.log(message);
    const body = this.container.querySelector('.messages_body');
    const row = document.createElement('tr');
    row.classList.add('message_item')

    row.innerHTML = this.getMessage(message);
    body.insertBefore(row, body.firstChild);
  }

  getMessage(message) {
    return `
      <td>${message.from}</td>
      <td class="subject">${this.formatSubject(message.subject)}</td>
      <td class="timestamp">${this.formatDate(message.received)}</td>
    `;
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${hours}:${minutes} ${day}.${month}.${year}`;
  }

  formatSubject(subject) {
    return subject.length > 15 
      ? subject.substring(0, 15) + '...' 
      : subject;
  }
}