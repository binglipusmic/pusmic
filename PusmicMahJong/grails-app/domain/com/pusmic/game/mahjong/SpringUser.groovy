package com.pusmic.game.mahjong

import com.pusmicgame.game.GameRound
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='username')
@ToString(includes='username', includeNames=true, includePackage=false)
class SpringUser implements Serializable {

	private static final long serialVersionUID = 1

	transient springSecurityService

	String username
	String password
	boolean enabled = true
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired
    //user online status 0, offline 1,online
    String status="0"
	//--------WebChat User info  field-----------

	String city
	String country
	String language
	String nickname
	String openid
	String province
	String headimgurl
	String unionid
	//1 -man ,2- women
	int sex
   //--------WebChat Oauth field-------------------
	String access_token
	String refresh_token
	String expires_in
	//this field send from Mobile client
	String mobileUserCode
	String mobileUserState

	//---------agent-----------
	String agentLevel


	//-----user game info--------
	int  diamondsNumber
	int  gameCount
	int winCount
	String userCode
	String userType
    //String publicIPAddress
    //String roomNumber


	Set<Role> getAuthorities() {
		//SpringUserRole.findAllBySpringUser(this)*.role
		return SpringUserRole.findAllBySpringUser(this).collect { it.role } as Set
	}

	def beforeInsert() {
		encodePassword()
	}

	def beforeUpdate() {
		if (isDirty('password')) {
			encodePassword()
		}
	}

	protected void encodePassword() {
		password = springSecurityService?.passwordEncoder ? springSecurityService.encodePassword(password) : password
	}

	static hasMany = [gameRound:GameRound,loginUserInfo:LoingUserInfo]
	static transients = ['springSecurityService']

	static constraints = {
		password blank: false, password: true
		username blank: false, unique: true
        gameRound nullable: true
        loginUserInfo nullable: true
		mobileUserCode nullable: true
		mobileUserState nullable: true
        expires_in nullable: true
        agentLevel nullable: true
        diamondsNumber nullable: true
        gameCount nullable: true
        winCount nullable: true
        userCode nullable: true
        userType nullable: true
        //publicIPAddress nullable: true
        //roomNumber nullable: true

	}

	static mapping = {
		password column: '`password`'
	}
}
