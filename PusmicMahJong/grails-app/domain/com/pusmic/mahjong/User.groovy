package com.pusmic.mahjong

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='username')
@ToString(includes='username', includeNames=true, includePackage=false)
class User implements Serializable {

	private static final long serialVersionUID = 1

	transient springSecurityService

	String username
	String password
	boolean enabled = true
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired
	//https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID

	//---------------web chat user inof field-------
	/**
	 * {
	 "openid":"OPENID",
	 "nickname":"NICKNAME",
	 "sex":1,
	 "province":"PROVINCE",
	 "city":"CITY",
	 "country":"COUNTRY",
	 "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0",
	 "privilege":[
	 "PRIVILEGE1",
	 "PRIVILEGE2"
	 ],
	 "unionid": " o6_bmasdasdsad6_2sgVt7hMZOPfL"

	 }
     */
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

	String access_token
	String refresh_token







	Set<Role> getAuthorities() {
		UserRole.findAllByUser(this)*.role
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

	static transients = ['springSecurityService']

	static constraints = {
		password blank: false, password: true
		username blank: false, unique: true
	}

	static mapping = {
		password column: '`password`'
	}
}
