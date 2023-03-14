import userResolvers from './user'
import merge from 'lodash.merge'
import conversationResolvers from './conversations'

const resolvers = merge({}, userResolvers, conversationResolvers)


 

export default resolvers
