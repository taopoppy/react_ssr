const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const session = require('koa-session')
const RedisSessionStore = require('./server/session-store.js')
const Redis = require('ioredis')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const auth = require('./server/auth.js')
const githubapi = require('./server/api.js')


// 创建redis的client（全部使用默认配置）
const redis = new Redis()

app.prepare().then(()=> {
	const server = new Koa()
	const router = new Router()

	server.keys = ['Taopoppy develop Github App'] // 设置一个给cookie加密的字符串
	const SESSION_CONFIG = {
		key: 'jid', // cookie的key
		// maxAge: 60*1000, // 一分钟的过期时间（默认是86400000为一天）
		store: new RedisSessionStore(redis)
	}

	server.use(session(SESSION_CONFIG,server))

	// 配置github OAuth登录，其auth函数必须在session后面
	auth(server)

	// 配置github代理请求
	githubapi(server)

	router.get('/a/:id', async (ctx) => {
		const id = ctx.params.id
		await handle(ctx.req, ctx.res, {
			pathname: '/a',
			query: {
				id
			}
		})
		ctx.respond = false
	})

	router.get('/api/user/info', async ctx => {
		const user = ctx.session.userInfo
		if(!user) {
			ctx.status = 401
			ctx.body = 'Need Login'
		} else {
			ctx.body = user
			ctx.set('Content-Type', 'application/json')
		}
	})


	server.use(router.routes())

	server.use(async (ctx, next) => {
		ctx.req.session = ctx.session
		await handle(ctx.req, ctx.res)
		ctx.respond = false
	})

	server.listen(3001, ()=> {
		console.log("koa server listening on 3001")
	})
})