import * as helpers from './helpers'

export default class CacheUtility {
    
    constructor(client) {
        this.client = client
        this.config = client.config.cache
        this.cache = null
    }

    quit() {
        return this.cache.quit()
    }

    create() {
        this.cache = require(this.config.client).createClient({
            host: this.config.host,
            port: this.config.port
        });
        //this.cache.flushall()
    }

    add(key, value, options = {}) {
        let _value = JSON.stringify(value)
        let _exp = options.ttl || this.config.defaultTTL || 300

        this.cache.set(key, _value,'EX',_exp,(err, reply) => {
            if (err){
                helpers.warn(`Cache failed to set value: ${err}`)
            }
        })
    }

    get(key, cb) {
        this.cache.get(key, (err, reply) => {
            console.log(`REDIS READ ${key} ${reply}`)
            if (typeof cb == 'function')
                cb(err, JSON.parse(reply))
        })
    }

    hash(input, options = {}) {
        input = input.replace(/\s/g,'')
        let hash = 0;
        let idx = input.length;
        let char = 0;
    
        while(idx > 0){
          char = input.charCodeAt(idx)
          hash = ((hash << 5) - hash) + char
          hash |= 0
          idx--
        }
    
        return hash
    
      }

}