declare module '@cometchat/chat-sdk-react-native' {
  export namespace CometChat {
    // Core types
    export function init(appID: string, appSettings: any): Promise<string>;
    // Update the login function signature to match actual implementation
    export function login(uid: string, authKey: string): Promise<User>;
    export function logout(): Promise<string>;
    export function getLoggedinUser(): Promise<User>;
    export function createUser(user: User, authKey: string): Promise<User>;
    
    export class User {
      constructor(uid: string, name?: string);
      uid: string;
      name?: string;
      avatar?: string;
      status?: string;
      statusMessage?: string;
      role?: string;
      
      static blockedUsersRequestBuilder(): BlockedUsersRequestBuilder;
    }
    
    export class TextMessage {
      constructor(receiverId: string, text: string, receiverType: string);
    }
    
    export class BlockedUsersRequestBuilder {
      build(): BlockedUsersRequest;
      setLimit(limit: number): BlockedUsersRequestBuilder;
      setSearchKeyword(keyword: string): BlockedUsersRequestBuilder;
    }
    
    export class BlockedUsersRequest {
      fetchNext(): Promise<User[]>;
    }
    
    export class UsersRequestBuilder {
      build(): UsersRequest;
      setLimit(limit: number): UsersRequestBuilder;
      setSearchKeyword(keyword: string): UsersRequestBuilder;
    }
    
    export class UsersRequest {
      fetchNext(): Promise<User[]>;
    }
    
    export class ConversationsRequestBuilder {
      build(): ConversationsRequest;
      setLimit(limit: number): ConversationsRequestBuilder;
      setConversationType(type: string): ConversationsRequestBuilder;
    }
    
    export class ConversationsRequest {
      fetchNext(): Promise<Conversation[]>;
    }
    
    export class Conversation {
      conversationId: string;
      conversationType: string;
      conversationWith: User | Group;
      lastMessage: BaseMessage;
      unreadMessageCount: number;
    }
    
    export class BaseMessage {
      id: string;
      sender: User;
      receiverId: string;
      receiverType: string;
      sentAt: number;
      deliveredAt: number;
      readAt: number;
    }
    
    export const RECEIVER_TYPE: {
      USER: string;
      GROUP: string;
    };
  }
}

declare module '@cometchat/chat-uikit-react-native' {
  export namespace CometChatUIKit {
    export class UIKitSettings {
      constructor(config: {
        appId: string;
        region: string;
        authKey: string;
      });
      
      subscribePresenceForAllUsers(): UIKitSettings;
      setAutoEstablishSocketConnection(flag: boolean): UIKitSettings;
    }
    
    export function init(config: UIKitSettings): Promise<string>;
    
    // UI Components
    export class CometChatConversationList extends React.Component<any> {}
    export class CometChatConversations extends React.Component<any> {}
    export class CometChatMessages extends React.Component<any> {}
    export class CometChatUserList extends React.Component<any> {}
    export class CometChatUI extends React.Component<any> {}
  }
}
