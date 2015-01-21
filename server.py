#!/usr/bin/python
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import os
import json
import shutil

PORT_NUMBER = 8182

def _deployTree(elem):
    f=[]
    folder = []

    for i in os.walk(elem):
        f.extend(i)
        break
    if len(f)> 0:
    	folder.extend({'title': i,'type': 'folder', 'childNodes':_deployTree(f[0] + '/' + i)} for i in f[1])

    try:
        folder.extend({'title': i, 'type': 'file'} for i in f[2])
    except:
        pass
    return folder

def _createFolder(path):
    os.mkdir(path)

#This class will handles any incoming request from
#the browser 
class myHandler(BaseHTTPRequestHandler):

    #Handler for the GET requests
    def do_GET(self):
        if self.path=="/":
            self.path="/TREE.html"
        if self.path.endswith(".html"):
            mimetype='text/html'
            sendReply = True
        elif self.path.endswith(".jpg"):
            mimetype='image/jpg'
            sendReply = True
        elif self.path.endswith(".gif"):
            mimetype='image/gif'
            sendReply = True
        elif self.path.endswith(".js"):
            mimetype='application/javascript'
            sendReply = True
        elif self.path.endswith(".css"):
            mimetype='text/css'
            sendReply = True
        else:
            mimetype='application/json'
            sendReply = False


        result = {}
        status = 200

        action = self.path.split('=')[0][2:]
        if sendReply == True:
            self.wfile.write(open(self.path[1:]).read())
        else:
            if action == "build":
                folder_path = self.path.split('=')[-1]
                result = {'title': folder_path, 'type': 'folder', 'childNodes': _deployTree(folder_path)}


            elif action == "createfolder":
                folder_path = self.path.split('=')[-1]
                try:
                    os.mkdir(folder_path)
                    result["message"] = "folder created"
                except Exception, e:
                    result["message"] = e.strerror
                    status = 400


            elif action == "deletefolder":
                folder_path = self.path.split('=')[-1]
                try:
                    shutil.rmtree(folder_path)
                    result["message"] = "folder deleted"
                except Exception, e:
                    result["message"] = e.strerror
                    status = 400

            elif action == "renamefolder":
                names = self.path.split('=')[-1].split('&')
                data = '/'.join(names[0].split('/')[0:-1]) + '/' + names[-1]
                try:
                    os.rename(names[0],data)
                    result["message"] = "folder renamed"
                    result["folder"] = data
                except Exception, e:
                    result["message"] = e.strerror
                    status = 400

            elif action == "renamefile":
                names = self.path.split('=')[-1].split('&')
                data = '/'.join(names[0].split('/')[0:-1]) + '/' + names[-1]

                if os.path.isfile(data):
                    result["message"] = 'file exists'
                    status = 400
                else:
                    try:
                        os.rename(names[0],data)
                        result["message"] = "file renamed"
                        result["folder"] = data

                    except Exception, e:
                        result["message"] = e.strerror
                        status = 400
            
            elif action == "createfile":
                file_path = self.path.split('=')[-1]

                try:
                    f = open(file_path, 'r')
                    result["message"] = 'file exists'
                    status = 400
                except IOError:
                    result["message"] = 'file created'
                    f = open(file_path, 'w')
                f.close()

            elif action == 'deletefile':
                file_path = self.path.split('=')[-1]
                try:
                    os.remove(file_path)
                    result["message"] = 'file deleted'
                except Exception, e:
                    result["message"] = e.strerror
                    status = 400


            self.send_response(status)
            self.send_header('Content-type',mimetype)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            if result:
                print action,'////', self.path, '//////', result
                self.wfile.write(json.dumps(result))

        return
        #
        # Send the html message

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