package com.pusmic.game.mahjong

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='name')
@ToString(includes='name', includeNames=true, includePackage=false)
class RoleGroup implements Serializable {

	private static final long serialVersionUID = 1

	String name

	Set<Role> getAuthorities() {
		//RoleGroupRole.findAllByRoleGroup(this)*.role
		RoleGroupRole.findAllByRoleGroup(this).collect { it.role } as Set
	}

	static constraints = {
		name blank: false, unique: true
	}

	static mapping = {
		cache true
	}
}
