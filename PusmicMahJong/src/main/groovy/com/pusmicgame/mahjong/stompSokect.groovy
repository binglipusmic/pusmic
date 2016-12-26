package com.pusmicgame.mahjong

import org.grails.web.util.WebUtils
import org.springframework.messaging.simp.SimpMessageHeaderAccessor

import javax.servlet.ServletContext
import javax.servlet.http.HttpSession
import javax.websocket.EndpointConfig
import javax.websocket.OnMessage
import javax.websocket.OnOpen
import javax.websocket.Session
import javax.websocket.server.ServerEndpoint

/**
 * Created by prominic2 on 16/12/26.
 */
@ServerEndpoint(value="/stomp", configurator=ServletAwareConfig.class)
class stompSokect {
    private EndpointConfig config;
    def PUBLICIP_ATTR="remoteIpAddress"
    @OnOpen
    public void onOpen(Session websocketSession, EndpointConfig config) {
        this.config = config;
    }

    @OnMessage
    public void onMessage(String message) {
        HttpSession httpSession = (HttpSession) config.getUserProperties().get("httpSession");
        ServletContext servletContext = httpSession.getServletContext();
        Map<String, Object> sessionHeaders = SimpMessageHeaderAccessor.getSessionAttributes(message.getHeaders());
        String publicIp = (String) sessionHeaders.get(PUBLICIP_ATTR);
        httpSession.setAttribute("public_ip",publicIp)
        //WebUtils.retrieveGrailsWebRequest().session=httpSession
        sessionHeaders.each {k,v->
            println "stompSokect:${k}-->${v}"

        }


        // ...
    }
}
