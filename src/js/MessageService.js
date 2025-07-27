import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

export default class MessageService {
  constructor(url) {
    this.apiUrl = url;
  }

  //запрос на сервер (получение новых сообщений)
  getNewMessages() {
    return ajax.getJSON(this.apiUrl).pipe(
      map(response => {
        if (response && response.status === 'ok') {
          return response.messages || [];
        }
          return [];
      }),
      catchError(error => {
        console.error('Ошибка при запросе:', error);
        return of([]);
      })
    );
  }
}