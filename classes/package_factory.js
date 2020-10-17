const ComposerPackage = require('./package_php');
const NodePackage = require('./package_node');
 
class PackageFactory {
    create(type) {
        switch (type) {
            case 'php':
                return new ComposerPackage();
 
            case 'node':
                return new NodePackage();

            default:
                {
                    console.log('Unknown package type...');
                }
        }
    }
}
 
module.exports = new PackageFactory();