class PackageFile {
    constructor(name) {
        this.name = name + '-' + Math.random().toString(36).substring(2, 15);
    }

    showInfo() {
        console.log(`I'm ${this.name}`)
    }

    getPackageFileName(){
        return this.packageFileName;
    }

    getPacketObject(){
        return this.packetObject;
    }


}

module.exports = PackageFile;