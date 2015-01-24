#!/usr/bin/python
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import json
import sys
import os
from Views import Views




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
    elif action == 'infofolder':
        result = Views.infoFolder(path)
    elif action == 'infofile':
        result = Views.infoFile(path)
    elif action == 'openfile':
        result = Views.openFile(path)

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

def Create_server(port):
    try:
        #Create a web server and define the handler to manage the
        #incoming request
        server = HTTPServer(('', port), myHandler)
        print 'Started httpserver on port ' , port

        #Wait forever for incoming htto requests
        server.serve_forever()

        string  = "google-chrome http://localhost:{}/".format(sys.argv[1])
        os.system(string)
    except KeyboardInterrupt:
        print '^C received, shutting down the web server'
        server.socket.close()

def Open_browser(name, port):
    string  = "{0} http://localhost:{1}/".format(name, port)
    os.system(string)

from multiprocessing import Process
if __name__ == "__main__":

    # try:
    #     #Create a web server and define the handler to manage the
    #     #incoming request
    #     server = HTTPServer(('', int(sys.argv[1])), myHandler)
    #     print 'Started httpserver on port ' , sys.argv[1]
    #
    #     #Wait forever for incoming htto requests
    #     server.serve_forever()
    #     #os.system("google-chrome localhost:{}".format(sys.argv[1]))
    #     string  = "google-chrome http://localhost:{}/".format(sys.argv[1])
    #     os.system(string)
    # except KeyboardInterrupt:
    #     print '^C received, shutting down the web server'
    #     server.socket.close()
    processes =[]
    p = Process(target=Create_server, args=(int(sys.argv[2]),))
    p.start()
    processes.append(p)
    p = Process(target=Open_browser, args=(sys.argv[1],sys.argv[2]))
    p.start()
    for p in processes:
        p.join()
