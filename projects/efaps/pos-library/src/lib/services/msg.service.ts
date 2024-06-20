import { Injectable } from "@angular/core";
import { RxStompConfig } from "@stomp/rx-stomp";

import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { RxStompService } from "./rx-stomp.service";

@Injectable({
  providedIn: "root",
  deps: [ConfigService, RxStompService, AuthService],
})
export class MsgService {
  ordersEdited = new Set();

  constructor(
    private configService: ConfigService,
    private stompService: RxStompService,
    private authService: AuthService,
  ) {
    this.authService.currentEvent.subscribe(() => {
      this.disconnect();
    });
  }

  init() {
    if (!this.stompService.connected()) {
      const stompConfig: RxStompConfig = {
        brokerURL: this.configService.socketUrl,
        connectHeaders: {
          login: this.authService.currentUser.tokens.accessToken,
        },
        heartbeatIncoming: 0,
        heartbeatOutgoing: 20000,
        reconnectDelay: 5000,
        debug: (str) => {
          console.log(new Date(), str);
        },
      };
      this.stompService.configure(stompConfig);
      this.stompService.activate();
      this.stompService.watch("/app/orders/start.edit").subscribe((message) => {
        JSON.parse(message.body).forEach((orderId) => {
          this.ordersEdited.add(orderId);
        });
      });
      this.stompService
        .watch("/topic/orders/start.edit")
        .subscribe((message) => {
          this.ordersEdited.add(message.body);
        });
      this.stompService
        .watch("/topic/orders/finish.edit")
        .subscribe((message) => {
          this.ordersEdited.delete(message.body);
        });
    }
  }

  disconnect() {
    if (this.stompService.connected()) {
      this.stompService.deactivate();
    }
  }

  publishStartEditOrder(orderId: string) {
    this.init();
    this.stompService.publish({
      destination: "/app/orders/start.edit",
      body: orderId,
    });
  }

  publishFinishEditOrder(orderId: string) {
    this.init();
    this.stompService.publish({
      destination: "/app/orders/finish.edit",
      body: orderId,
    });
  }

  subscribeToCollectOrder(collectOrderId: string) {
    this.init();
    return this.stompService.watch(`/topic/collectOrder/${collectOrderId}`);
  }
}
