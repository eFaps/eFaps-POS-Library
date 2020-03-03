import { Injectable } from "@angular/core";
import { StompConfig, StompRService } from "@stomp/ng2-stompjs";

import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
  deps: [ConfigService, StompRService, AuthService]
})
export class MsgService {
  ordersEdited = new Set();

  constructor(
    private configService: ConfigService,
    private stompService: StompRService,
    private authService: AuthService
  ) {
    this.authService.currentEvent.subscribe(() => {
      this.disconnect();
    });
  }

  init() {
    if (!this.stompService.connected()) {
      const stompConfig: StompConfig = {
        url: this.configService.socketUrl,
        headers: {
          login: this.authService.currentUser.token
        },
        heartbeat_in: 0,
        heartbeat_out: 20000,
        reconnect_delay: 5000,
        debug: true
      };
      this.stompService.config = stompConfig;
      this.stompService.initAndConnect();
      this.stompService
        .subscribe("/app/orders/start.edit")
        .subscribe(message => {
          JSON.parse(message.body).forEach(orderId => {
            this.ordersEdited.add(orderId);
          });
        });
      this.stompService
        .subscribe("/topic/orders/start.edit")
        .subscribe(message => {
          this.ordersEdited.add(message.body);
        });
      this.stompService
        .subscribe("/topic/orders/finish.edit")
        .subscribe(message => {
          this.ordersEdited.delete(message.body);
        });
    }
  }

  disconnect() {
    if (this.stompService.connected()) {
      this.stompService.disconnect();
    }
  }

  publishStartEditOrder(orderId: string) {
    this.init();
    this.stompService.publish("/app/orders/start.edit", orderId);
  }

  publishFinishEditOrder(orderId: string) {
    this.init();
    this.stompService.publish("/app/orders/finish.edit", orderId);
  }

  subscribeToCollectOrder(collectOrderId: string) {
    this.init();
    return this.stompService.subscribe(`/topic/collectOrder/${collectOrderId}`);
  }
}
