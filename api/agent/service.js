const sites = require('../../mocks/sites.json');

console.log(sites);

module.exports = {
    getAgesntSite: (siteId) => {
        let site = null;
        sites.forEach(_site => {
            if (_site.id === siteId) {
                site = _site;
            } 
        });
        return site;
    }
};