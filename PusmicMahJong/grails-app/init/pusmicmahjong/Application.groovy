package pusmicmahjong

import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.SecurityAutoConfiguration
import org.springframework.boot.autoconfigure.security.SecurityFilterAutoConfiguration
import org.springframework.context.annotation.Configuration



/*
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
@EnableAutoConfiguration

@EnableAutoConfiguration(exclude = [SecurityFilterAutoConfiguration])

@EnableAutoConfiguration(exclude = [SecurityFilterAutoConfiguration])*/
class Application extends GrailsAutoConfiguration {
    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }
}