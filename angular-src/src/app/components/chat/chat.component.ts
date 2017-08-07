import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

import * as $ from 'jquery';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  messages = [];
  connection;
  message;
  allMessages;
  user;
  messageData;

  constructor(
      private chatService:ChatService, 
      private authService:AuthService, 
      private flashMessage: FlashMessagesService
    ) {}

  sendMessage(){
    if(this.message) {
      this.messageData = {
        message: this.message,
        user: this.user.name
      } 
      this.chatService.sendMessage(this.messageData);
      this.message = '';
    } else {
      this.flashMessage.show('Please type a message!', {cssClass: 'alert-danger', timeout: 3000});
    }
    
  }
  clearMessages() {
    this.chatService.clearMessages();
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });
    $(document).ready(function(){
      $('#messages').animate({scrollTop: $('#messages').get(0).scrollHeight}, 1000);
    });
    this.chatService.showMessages().subscribe(data => {
      this.allMessages = data;
        $(document).ready(function(){
          $('#messages').animate({scrollTop: $('#messages').get(0).scrollHeight}, 1000);
        });
    });
    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
        $(document).ready(function(){
          $('#messages').animate({scrollTop: $('#messages').get(0).scrollHeight}, 1000);
        });
    });
  }
  
  ngOnDestroy() {
  }
}
