export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = `http://165.245.177.103${url.pathname}${url.search}`;

    const init = {
      method: request.method,
      headers: request.headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
      redirect: 'manual',
    };

    const response = await fetch(target, init);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  },
};
