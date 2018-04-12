module.exports = {
    
    email: function(input){
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(input.match(regex) != null){
            return true
        } else {
            return false
        }
    },
    
    ethAddress: function(input){
        
        if(typeof input != 'string' || input.length !== 42) return false
        input = input.toLowerCase()

        var regex = /0x([0-f]+)/
        
        if(input.match(regex) != null){
            return true
        } else {
            return false
        }
    }
    
}