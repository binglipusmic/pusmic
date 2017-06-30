package com.pusmicgame

class DownloadAPKController {

    def index() {
        byte[] content =new File("src/main/webapp/remote-assets/PusmicMobileMahJong-release-signed.apk").getBytes()
        String filename = "PusmicMobileMahJong-release-signed.apk"
        response.contentType = 'application/octet-stream'
        response.setHeader 'Content-disposition', "attachment; filename=\"$filename\""
        response.outputStream << content
        response.outputStream.flush()
    }
}
