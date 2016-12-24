package com.pusmicgame.mahjong

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.SecurityAutoConfiguration
import org.springframework.boot.autoconfigure.security.SecurityProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer
import org.springframework.messaging.simp.SimpMessageType
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.security.SecurityFilterAutoConfiguration
import org.springframework.security.web.csrf.CsrfFilter

//import org.springframework.security.messaging
/**
 * Created by prominic2 on 16/12/24.
 */
/*@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebSecurity*/

class WebSocketSecurityConfig extends WebSecurityConfigurerAdapter {




    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //http.csrf().;
        //http.csrf().disable();
        //http.httpBasic()
        //http.authorizeRequests().anyRequest().authenticated()
        http.addFilterAfter(new CsrfTokenGeneratorFilter(), CsrfFilter.class)
                .authorizeRequests()
                .antMatchers("/scripts/**", "/styles/**", "/font/**", "/fonts/**").permitAll()
                .antMatchers("/**").authenticated()
                .and()
                .formLogin()
                .loginPage("/login").permitAll();
    }

    @Autowired
    void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser("user").password("password").roles("USER")
    }
}
