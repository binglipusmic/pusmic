import org.springframework.security.web.access.AccessDeniedHandler
import org.springframework.security.web.csrf.CsrfFilter
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository
import com.pusmicgame.mahjong.WebSocketSecurityConfig
import org.springframework.boot.autoconfigure.security.SecurityFilterAutoConfiguration
// Place your Spring DSL code here
beans = {
    webSocketConfig(com.pusmicgame.mahjong.WebSokecConfig)
   //webSecurityConfiguration(com.pusmicgame.mahjong.WebSocketSecurityConfig)
    securityFilterAutoConfiguration org.springframework.boot.autoconfigure.security.SecurityFilterAutoConfiguration

    //securityChannelInterceptor SecurityChannelInterceptor
    //webSecurityConfig com.pusmicgame.mahjong.WebSecurityConfig
    //RequireCsrfProtectionMatcher
    /*csrfFilter(CsrfFilter, new HttpSessionCsrfTokenRepository()) {
        accessDeniedHandler = ref('AccessDeniedHandler')
        requireCsrfProtectionMatcher = ref('RequireCsrfProtectionMatcher')
    }*/
}
