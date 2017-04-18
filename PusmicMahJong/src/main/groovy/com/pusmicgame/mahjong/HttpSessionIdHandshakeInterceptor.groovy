package com.pusmicgame.mahjong

import grails.web.servlet.mvc.GrailsHttpSession
import org.grails.web.util.WebUtils
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.http.server.ServletServerHttpRequest
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.server.HandshakeInterceptor

import javax.servlet.http.HttpSession
import com.pusmicgame.mahjong.Utils

/**
 * Created by prominic2 on 16/12/25.
 */
class HttpSessionIdHandshakeInterceptor implements HandshakeInterceptor {
    def SESSION_ATTR = "session"
    def PUBLICIP_ATTR = "remoteIpAddress"
    def myUtils = new Utils()

    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes)
            throws Exception {
        if (request instanceof ServletServerHttpRequest) {

            def session = getSession()
            //println "HttpSessionIdHandshakeInterceptor:::"+request.getServletRequest().getUserPrincipal().name



            request.headers.set("user-agent","")
            request.getHeaders().each { k, v ->

                println "31:${k}-----${v}"

            }



            def ip = myUtils.fixTheWebsokectRemoteIp(request.getRemoteAddress().toString())

            if (ip) {
                session.public_ip = ip
                println "request:" + session.public_ip
            }
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            // HttpSession session = servletRequest.getServletRequest().getSession(false);
            if (session != null) {
                attributes.put(SESSION_ATTR, session.getId());
                attributes.put(PUBLICIP_ATTR, ip);
                println "SESSION_ATTR:" + session.getId()
                //WebUtils.retrieveGrailsWebRequest().se=session
            }

            //println "SESSION_ATTR:"+session.getId()
        }
        return true;
    }

    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception ex) {


    }

    public static GrailsHttpSession getSession() {
        return WebUtils.retrieveGrailsWebRequest().getSession();
    }
}
