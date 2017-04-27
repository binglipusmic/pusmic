package com.pusmicgame.mahjong

import grails.plugin.springwebsocket.GrailsSimpAnnotationMethodMessageHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.config.ChannelRegistration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.MessageHeaderAccessor
import org.springframework.session.ExpiringSession
import org.springframework.session.Session
import org.springframework.session.web.socket.config.annotation.AbstractSessionWebSocketMessageBrokerConfigurer
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.messaging.support.ChannelInterceptorAdapter
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean

import javax.websocket.OnOpen

@Configuration
@EnableWebSocketMessageBroker
class WebSokecConfig extends AbstractSessionWebSocketMessageBrokerConfigurer<ExpiringSession>  {
   def SESSION_ATTR="session"
	def PUBLICIP_ATTR="remoteIpAddress"
	@OnOpen
	public void onWebSocketConnect(Session session) {
		if(session)
		System.Out.println("onWebSocketConnect:"+session.getUserProperties().get("javax.websocket.endpoint.remoteAddress"))
	}
	@Override
	void configureMessageBroker(MessageBrokerRegistry messageBrokerRegistry) {
		messageBrokerRegistry.enableSimpleBroker "/queue", "/topic"
		messageBrokerRegistry.setApplicationDestinationPrefixes "/app"
	}

//    @Override
//    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
//        registration.setSendTimeLimit(15 * 1000).setSendBufferSizeLimit(512 * 1024).setMessageSizeLimit(128*1024);
//    }

	@Override
	void configureStompEndpoints(StompEndpointRegistry stompEndpointRegistry) {
		stompEndpointRegistry.addEndpoint("/stomp").setAllowedOrigins("*").withSockJS()
				.setInterceptors(new HttpSessionIdHandshakeInterceptor())
                .setStreamBytesLimit(512 * 1024)
                .setHttpMessageCacheSize(1000)
                .setDisconnectDelay(30 * 1000)


	}

	@Bean
	GrailsSimpAnnotationMethodMessageHandler grailsSimpAnnotationMethodMessageHandler(
		MessageChannel clientInboundChannel,
		MessageChannel clientOutboundChannel,
		SimpMessagingTemplate brokerMessagingTemplate
	) {
		def handler = new GrailsSimpAnnotationMethodMessageHandler(clientInboundChannel, clientOutboundChannel, brokerMessagingTemplate)
		handler.destinationPrefixes = ["/app"]
		return handler
	}


	@Bean
	public ChannelInterceptorAdapter sessionContextChannelInterceptorAdapter() {
		return new ChannelInterceptorAdapter() {
			@Override
			public Message<?> preSend(Message<?> message, MessageChannel channel) {

				StompHeaderAccessor accessor =
						MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
				if (StompCommand.CONNECT.equals(accessor.getCommand())) {
					//accessor.setHeader()

				}
				Map<String, Object> sessionHeaders = SimpMessageHeaderAccessor.getSessionAttributes(message.getHeaders());
                sessionHeaders.each {k,v->

                    println("sessionHeaders:"+k+"------"+v);

                }
                String sessionId = (String) sessionHeaders.get(SESSION_ATTR);


                String publicIp = (String) sessionHeaders.get(PUBLICIP_ATTR);
                //message.headers.put(PUBLICIP_ATTR,publicIp);
                println "ChannelInterceptorAdapter message getHeaders:"+message.getHeaders()
				if (sessionId != null) {
					/*Session session = sessionRepository.getSession(sessionId);
					if (session != null) {

						sessionRepository.save(session);
					}*/
				}
				return super.preSend(message, channel);
			}
		};
	}




	@Bean
	public ServletServerContainerFactoryBean createWebSocketContainer() {
		ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
		container.setMaxTextMessageBufferSize(8192);
		container.setMaxBinaryMessageBufferSize(8192);
		return container;
	}


	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.setInterceptors(sessionContextChannelInterceptorAdapter());
	}

}
