import httpProxy from '@fastify/http-proxy'

export default async function (app) {
  app.register(httpProxy, {
    upstream: 'http://regina.plt.local',
    prefix: '/regina',
    rewritePrefix: '',
    globalAgent: true
  })

  app.register(httpProxy, {
    upstream: 'http://web.plt.local',
    prefix: '/web',
    rewritePrefix: '/web',
    globalAgent: true
  })
}
