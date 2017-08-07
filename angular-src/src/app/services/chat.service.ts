import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
  private url = 'http://localhost:8080';
  private socket;
  
  sendMessage(messageData){
    this.socket.emit('add-message', messageData);    
  }

  clearMessages() {
    this.socket.emit('clear');
  }
  
  showMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('output', (data) => {
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })
    return observable;
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }  
}