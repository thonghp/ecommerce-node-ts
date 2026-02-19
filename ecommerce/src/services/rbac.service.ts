import RESOURCE from '~/models/resource.model'
import ROLE from '~/models/role.model'

const createResource = async ({ name = 'profile', slug = 'p00001', description = '' }) => {
  try {
    // 1. check name or slug exists
    // 2. new resource
    const resource = await RESOURCE.create({
      src_name: name,
      src_slug: slug,
      src_description: description
    })

    return resource
  } catch (error) {
    return error
  }
}

const resourceList = async ({ userId = 0, limit = 10, offset = 0, search = ' ' }) => {
  try {
    // 1. check admin ? middleware function
    // 2. get list of resource
    const resources = await RESOURCE.aggregate([
      {
        $project: {
          _id: 0,
          name: '$src_name',
          slug: '$src_slug',
          description: '$src_description',
          resourceId: '$_id',
          createdAt: 1
        }
      }
    ])

    return resources
  } catch (error) {
    return []
  }
}

const createRole = async ({
  name = 'shop',
  slug = 's00001',
  description = 'extend from shop or user',
  grants = []
}) => {
  try {
    // 1. check role exists
    // 2. new role
    const role = await ROLE.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants
    })

    return role
  } catch (error) {
    return error
  }
}

// userId = 0 là admin
const roleList = async ({ userId = 0, limit = 10, offset = 0, search = ' ' }) => {
  try {
    // 1. check userId
    // 2. list roles
    const roles = await ROLE.aggregate([
      {
        $unwind: '$rol_grants'
      },
      {
        $lookup: {
          from: 'resources',
          localField: 'rol_grants.resource',
          foreignField: '_id',
          as: 'resource'
        }
      },
      {
        $unwind: '$resource'
      },
      {
        $project: {
          _id: 0,
          role: '$rol_name',
          resource: '$resource.src_name',
          action: '$rol_grants.action',
          attributes: '$rol_grants.attributes'
        }
      },
      {
        $unwind: '$action'
      }
    ])

    return roles
  } catch (error) {
    return []
  }
}

export { createResource, createRole, resourceList, roleList }
