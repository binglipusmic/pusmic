
// Added by the Spring Security Core plugin:
grails.plugin.springsecurity.userLookup.userDomainClassName = 'com.pusmic.game.mahjong.SpringUser'
grails.plugin.springsecurity.userLookup.authorityJoinClassName = 'com.pusmic.game.mahjong.SpringUserRole'
grails.plugin.springsecurity.authority.className = 'com.pusmic.game.mahjong.Role'
//grails.plugin.springsecurity.authority.groupAuthorityNameField = 'authoritie'
grails.plugin.springsecurity.useRoleGroups = false

grails.plugin.springsecurity.ui.register.defaultRoleNames = ['ROLE_USER']
grails.plugin.springsecurity.securityConfigType ="Annotation"

// Define the behavior for unmapped URLs.  See:  http://grails-plugins.github.io/grails-spring-security-core/guide/requestMappings.html
// Set rejectIfNoRule to true to return a "Sorry you are not authorized to view this page" message
grails.plugin.springsecurity.rejectIfNoRule = false
// Set rejectIfNoRule=false and rejectPublicInvoications=true to throw an
// Exception for unmapped pages.  This is more convenient for debugging.
grails.plugin.springsecurity.fii.rejectPublicInvocations = true

//grails.plugin.springsecurity.securityConfigType = "InterceptUrlMap"
grails.plugin.springsecurity.securityConfigType = "Annotation"
grails.plugin.springsecurity.logout.postOnly = false


grails.plugin.springsecurity.controllerAnnotations.staticRules = [
	[pattern: '/',               access: ['permitAll']],
	[pattern: '/error',          access: ['permitAll']],
	[pattern: '/index',          access: ['permitAll']],
	[pattern: '/index.gsp',      access: ['permitAll']],
	[pattern: '/shutdown',       access: ['permitAll']],
	[pattern: '/assets/**',      access: ['permitAll']],
	[pattern: '/**/js/**',       access: ['permitAll']],
	[pattern: '/**/css/**',      access: ['permitAll']],
	[pattern: '/**/images/**',   access: ['permitAll']],
	[pattern: '/**/favicon.ico', access: ['permitAll']],
	[pattern: '/**/autoconfig', access: ['permitAll']],
		//autoconfig
    [pattern: '/csrf/**', access: ['permitAll']],
    [pattern: '/login/**', access: ['permitAll']],
    [pattern: '/logout/**', access: ['permitAll']],
	[pattern: '/faPai/**', access: ['IS_AUTHENTICATED_REMEMBERED']],
    [pattern: '/admin/**', access: ['ROLE_ADMIN']],
	[pattern: '/stomp/**', access: ['ROLE_ADMIN']]
	//[pattern: '/faPai/**', access: 'ROLE_ADMIN']
		//ROLE_USER
]

grails.plugin.springsecurity.filterChain.chainMap = [
	[pattern: '/assets/**',      filters: 'none'],
	[pattern: '/**/js/**',       filters: 'none'],
	[pattern: '/**/css/**',      filters: 'none'],
	[pattern: '/**/images/**',   filters: 'none'],
	[pattern: '/**/favicon.ico', filters: 'none'],
	[pattern: '/**',             filters: 'JOINED_FILTERS']
]

