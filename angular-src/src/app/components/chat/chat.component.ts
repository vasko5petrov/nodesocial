import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

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

  constructor(private chatService:ChatService, private authService:AuthService) {}

  sendMessage(){
  	this.messageData = {
  		message: this.message,
  		user: this.user.name
  	}
    this.chatService.sendMessage(this.messageData);
    this.message = '';
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
  	this.chatService.showMessages().subscribe(data => {
  		this.allMessages = data;
  	});
    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
    });
  }
  
  ngOnDestroy() {
  }
}
