package com.pusmic.game.mahjong

import grails.gorm.DetachedCriteria
import groovy.transform.ToString

import org.apache.commons.lang.builder.HashCodeBuilder

@ToString(cache=true, includeNames=true, includePackage=false)
class SpringUserRoleGroup implements Serializable {

	private static final long serialVersionUID = 1

	SpringUser springUser
	RoleGroup roleGroup

	@Override
	boolean equals(other) {
		if (other instanceof SpringUserRoleGroup) {
			other.springUserId == springUser?.id && other.roleGroupId == roleGroup?.id
		}
	}

	@Override
	int hashCode() {
		def builder = new HashCodeBuilder()
		if (springUser) builder.append(springUser.id)
		if (roleGroup) builder.append(roleGroup.id)
		builder.toHashCode()
	}

	static SpringUserRoleGroup get(long springUserId, long roleGroupId) {
		criteriaFor(springUserId, roleGroupId).get()
	}

	static boolean exists(long springUserId, long roleGroupId) {
		criteriaFor(springUserId, roleGroupId).count()
	}

	private static DetachedCriteria criteriaFor(long springUserId, long roleGroupId) {
		SpringUserRoleGroup.where {
			springUser == SpringUser.load(springUserId) &&
			roleGroup == RoleGroup.load(roleGroupId)
		}
	}

	static SpringUserRoleGroup create(SpringUser springUser, RoleGroup roleGroup) {
		def instance = new SpringUserRoleGroup(springUser: springUser, roleGroup: roleGroup)
		instance.save()
		instance
	}

	static boolean remove(SpringUser u, RoleGroup rg) {
		if (u != null && rg != null) {
			SpringUserRoleGroup.where { springUser == u && roleGroup == rg }.deleteAll()
		}
	}

	static int removeAll(SpringUser u) {
		u == null ? 0 : SpringUserRoleGroup.where { springUser == u }.deleteAll()
	}

	static int removeAll(RoleGroup rg) {
		rg == null ? 0 : SpringUserRoleGroup.where { roleGroup == rg }.deleteAll()
	}

	static constraints = {
		springUser validator: { SpringUser u, SpringUserRoleGroup ug ->
			if (ug.roleGroup?.id) {
				SpringUserRoleGroup.withNewSession {
					if (SpringUserRoleGroup.exists(u.id, ug.roleGroup.id)) {
						return ['userGroup.exists']
					}
				}
			}
		}
	}

	static mapping = {
		id composite: ['roleGroup', 'springUser']
		version false
	}
}
