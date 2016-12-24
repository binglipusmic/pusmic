package com.pusmic.game.mahjong
import grails.plugin.springsecurity.annotation.Secured
import org.springframework.security.web.csrf.CsrfToken
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository

@Secured(['ROLE_ADMIN'])
class AdminController {
    String eol = System.getProperty("line.separator", "\n");
    def index() {
        def g=""
        request.each {k,v->

            g=g+ "${k}---->${v}"+"<br>"

        }

        request.headerNames.each{k->

            println "${k}"

        }
        CsrfToken token2 = new HttpSessionCsrfTokenRepository().loadToken(request);
        CsrfToken token = (CsrfToken) session.getAttribute(CsrfToken.class.getName());
        CsrfToken _csrf1 = (CsrfToken) session.getAttribute("CsrfToken");
        CsrfToken _csrf2 = (CsrfToken) session.getAttribute("_csrf");
        def ip = request.getRemoteAddr()
        println "token:"+token.toString()
        println "token2:"+token2.toString()
        println "_csrf1:"+_csrf1
        println "_csrf2:"+_csrf2
        println "cookie:"+request.getHeader("cookie")
        println request?._csrf?.token
        render g
    }
}
