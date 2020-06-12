async function test() {
	const Redis = require('ioredis')

	const redis = new Redis({
		port:'6379'
		// password:123456
	})

	await redis.set("c",123)           // 设置key:value
	await redis.setex("d",10,1234)     // 设置有过期时间的key:value
	const keys = await redis.keys("*") // 取出所有key
	const value = await redis.get("c") // 取出key为c的value

	console.log(keys,value)
}

test()
