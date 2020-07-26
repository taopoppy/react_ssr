// 统一在和session的redis中的数据前面添加一个前缀
function getRedisSessionId(sid) {
  return `ssid:${sid}`
}



class RedisSessionStore {
  // 接收一个redis的client去操作redis
  constructor(client) {
    this.client = client
  }

  // 获取Redis中存储的session数据
  async get(sid) {
    console.log('get session', sid)
    const id = getRedisSessionId(sid)
    const data = await this.client.get(id)
    if (!data) {
      return null
    }
    try {
      const result = JSON.parse(data)
      return result
    }catch (err) {
      console.error('redis get failed:', err)
    }
  }

  // 存储session数据到redis(ttl为过期时间)
  // 外界使用应该使用毫秒，而redis中需要传入秒
  async set(sid, sess, ttl) {
    console.log('set session', sid)
    const id = getRedisSessionId(sid)
    if(typeof ttl === 'number') {
      ttl = Math.ceil(ttl / 1000)
    }
    try {
      const sessStr = JSON.stringify(sess)
      if(ttl) { // 有过期时间
        await this.client.setex(id, ttl, sessStr)
      } else { // 无过期时间
        await this.client.set(id, sessStr)
      }
    } catch (err) {
      console.error('redis set failed:',err)
    }
  }

  // 从redis当中删除某个session
  async destroy(sid) {
    console.log('destroy session', sid)
    const id = getRedisSessionId(sid)
    await this.client.del(id)
  }
}

module.exports = RedisSessionStore