import Vue from 'vue'

const host = 'predb.ovh'
const endpoint = host + '/api/v1'

const api = {
  url: 'https://' + endpoint + '/',
  wss: 'wss://' + endpoint + '/ws',

  checkHTTP (res) {
    if (res.status >= 200 && res.status <= 300) {
      return res
    }
  },
  parseJson (res) {
    if (!res) {
      return
    }

    return res.json()
  },
  checkStatus (json) {
    if (!json) {
      return
    }

    if (json.status !== 'success') {
      let err = new Error(json.message.replace('\0', ''))
      err.response = json
      throw err
    }

    return json
  },

  exec (path, params) {
    return Vue.http.get(this.url + path, {params: params})
    .then(this.checkHTTP)
    .then(this.parseJson)
    .then(this.checkStatus)
  },
  websocket () {
    return new WebSocket(this.wss)
  },
  fresh () {
    return this.exec('live', {})
    .then((json) => {
      if (!json) {
        return
      }

      return json.data
    })
  },
  query (queryString, page) {
    const params = {}
    if (queryString) {
      params.q = queryString
    }
    if (page && page !== 1) {
      params.page = page
    }

    return this.exec('', params)
    .then((json) => {
      if (!json) {
        return
      }

      return json.data
    })
  }
}

export default api
