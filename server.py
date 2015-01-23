#!/usr/bin/python
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import json

from TREE.Views import Views

PORT_NUMBER = 8183


def view(action, path):
    result = {}
    if action == "build":
        result = Views.buildTree(path)

    elif action == "createfolder":
        result = Views.createFolder(path)

    elif action == "deletefolder":
        result = Views.deleteFolder(path)

    elif action == "renamefolder":
        result = Views.renameFolder(path)

    elif action == "renamefile":
        result = Views.renameFile(path)

    elif action == "createfile":
        result = Views.createFile(path)

    elif action == 'deletefile':
        result = Views.deleteFile(path)

    return result

#This class will handles any incoming request from
#the browser 
class myHandler(BaseHTTPRequestHandler):

    #Handler for the GET requests
    def do_GET(self):

        if self.path=="/":
            self.path="/Templates/main.html"
            sendReply = "Pages"

        if self.path.endswith(".html"):
            mimetype='text/html'
            sendReply = "Pages"
        elif self.path.endswith(".jpg"):
            mimetype='image/jpg'
            sendReply = "Pages"
        elif self.path.endswith(".gif"):
            mimetype='image/gif'
            sendReply = "Pages"
        elif self.path.endswith(".js"):
            mimetype='application/javascript'
            sendReply = "Pages"
        elif self.path.endswith(".css"):
            mimetype='text/css'
            sendReply = "Pages"
        elif self.path.endswith(".ico"):
            mimetype = "image/x-icon"
            sendReply = False
        else:
            mimetype='application/json'
            sendReply = 'JSON'

        result = {}
        result["status"] = 200
        action = self.path.split('=')[0][2:]

        if sendReply == "Pages":
            self.wfile.write(open(self.path[1:]).read())

        elif sendReply == "JSON":
            result = view(action,self.path)
            self.send_response(result["status"])
            self.send_header('Content-type',mimetype)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            del result["status"]

            if result:
                self.wfile.write(json.dumps(result))

        return

try:
    #Create a web server and define the handler to manage the
    #incoming request
    server = HTTPServer(('', PORT_NUMBER), myHandler)
    print 'Started httpserver on port ' , PORT_NUMBER

    #Wait forever for incoming htto requests
    server.serve_forever()

except KeyboardInterrupt:
    print '^C received, shutting down the web server'
    server.socket.close()