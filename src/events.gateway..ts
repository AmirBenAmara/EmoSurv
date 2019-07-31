import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
  afterInit(server: any): any {
    return undefined;
  }

  handleConnection(client: any): any {
    return undefined;
  }

  @SubscribeMessage('events')
  onEvent(client, data): WsResponse<any> {
    const event = 'events';
    console.log('events', data, data , data);
    const response = {
      ping: data,
      pongg: new Date(),
    };

    return { event, data: response };
  }
}
