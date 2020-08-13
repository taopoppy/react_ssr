const axios = require('axios')
const config = require('../config.js')
const { client_id, client_secret,request_token_url } = config.github

module.exports = (server) => {
  server.use( async (ctx, next)=> {
    if(ctx.path === '/auth') { // 如果是localhost:3001/auth就处理
      const code = ctx.query.code
      if(!code) {
        ctx.body = 'code not exist'
        return
      }
      // code如果存在就要去根据code和client_id、client_secret去请求github生成tokne
      const result = await axios({
        method: 'POST',
        url: request_token_url,
        data: {
          client_id,
          client_secret,
          code
        },
        headers: {
          'Accept': 'application/json'
        }
      })
      console.log(result.status,result.data)


      // 判断请求是否成功
      // 如果code二次使用，github也会返回200，所以要排除这种情况
      if(result.status === 200 &&(result.data && !result.data.error)) {
        ctx.session.githubAuth = result.data

        // 拿到token我们就用token去请求一下用户信息
        const { access_token, token_type } = result.data

        const userInfoResp = await axios({
          method: 'GET',
          url:'https://api.github.com/user',
          headers: {
            'Authorization': `${token_type} ${access_token}`
          }
        })
        // console.log('userInfoResp',userInfoResp)
        ctx.session.userInfo = userInfoResp.data


        ctx.redirect('/')
      } else {
        const errorMsg = result.data && result.data.error
        ctx.body = `request token failed ${errorMsg}`
      }


    } else {
      await next()  // 其他不是/auth不经过这层处理
    }
  })

  server.use( async (ctx, next)=> {
    const path = ctx.path
    const method = ctx.method
    if(path === '/logout' && method === 'POST') {
      ctx.session = null
      ctx.body = `logout success`
    } else {
      await next()
    }
  })
}