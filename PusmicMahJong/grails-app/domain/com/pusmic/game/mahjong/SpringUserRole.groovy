package com.pusmic.game.mahjong

import grails.gorm.DetachedCriteria
import groovy.transform.ToString

import org.apache.commons.lang.builder.HashCodeBuilder

@ToString(cache=true, includeNames=true, includePackage=false)
class SpringUserRole implements Serializable {

	private static final long serialVersionUID = 1

	SpringUser springUser
	Role role

	@Override
	boolean equals(other) {
		if (other instanceof SpringUserRole) {
			other.springUserId == springUser?.id && other.roleId == role?.id
		}
	}

	@Override
	int hashCode() {
		def builder = new HashCodeBuilder()
		if (springUser) builder.append(springUser.id)
		if (role) builder.append(role.id)
		builder.toHashCode()
	}

	static SpringUserRole get(long springUserId, long roleId) {
		criteriaFor(springUserId, roleId).get()
	}

	static boolean exists(long springUserId, long roleId) {
		criteriaFor(springUserId, roleId).count()
	}

	private static DetachedCriteria criteriaFor(long springUserId, long roleId) {
		SpringUserRole.where {
			springUser == SpringUser.load(springUserId) &&
			role == Role.load(roleId)
		}
	}

	static SpringUserRole create(SpringUser springUser, Role role) {
		def instance = new SpringUserRole(springUser: springUser, role: role)
		instance.save()
		instance
	}

	static boolean remove(SpringUser u, Role r) {
		if (u != null && r != null) {
			SpringUserRole.where { springUser == u && role == r }.deleteAll()
		}
	}

	static int removeAll(SpringUser u) {
		u == null ? 0 : SpringUserRole.where { springUser == u }.deleteAll()
	}

	static int removeAll(Role r) {
		r == null ? 0 : SpringUserRole.where { role == r }.deleteAll()
	}

	static constraints = {
		role validator: { Role r, SpringUserRole ur ->
			if (ur.springUser?.id) {
				SpringUserRole.withNewSession {
					if (SpringUserRole.exists(ur.springUser.id, r.id)) {

						return ['userRole.exists']
					}
				}
			}
		}
	}

	static mapping = {
		id composite: ['springUser', 'role']
		version false
	}
}
