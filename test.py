"""import os

def find_tree(folder, folder_path):

    f=[]
    current_folder = []
    for i in os.walk(folder_path):
        f.extend(i)
        print f, '222222222'
        break
    try:
        current_folder.extend({'title': i,'type': 'folder', 'childNodes':[]} for i in f[1])
        folder.extend({'title': i,'type': 'folder', 'childNodes':[]} for i in f[1])
    except:
        pass
    try:
        folder.extend({'title': i, 'type': 'file'} for i in f[2])
    except:
        pass
    file_path = f[0]
    #folder.extend(d)
    print folder
    for obj  in current_folder:
            print obj, '234'
            foldername = file_path + '/' + obj['title']
            print 333333333
            find_tree(folder,foldername)
            folder[folder.index(obj)] = find_tree(folder,foldername)
    return folder

find_tree([],'/home/user/projects/Tests')"""
# import os
#
# def find_tree(folder_path):
#     print folder_path
#     f=[]
#     folder = []
#
#     for i in os.walk(folder_path):
#         f.extend(i)
#         break
#     folder.extend({'title': i,'type': 'folder', 'childNodes':find_tree(f[0] + '/' + i)} for i in f[1])
#
#     try:
#         folder.extend({'title': i, 'type': 'file'} for i in f[2])
#     except:
#         pass
#     return folder
#
# s = find_tree('/home/user/projects/Tests')
#
# print s[0]["childNodes"][1]
# import os
# import time
# import grp
# import pwd
# result = {}
# path = "/home/user/projects/Tests/34"
# (mode, ino, dev, nlink, uid, gid, size, atime, mtime, ctime) = os.stat(path)
# print os.stat(path)
# result['create_time'] =  time.ctime(mtime)
# result['user'] = pwd.getpwuid(uid)[0]
# result['group'] = grp.getgrgid(gid)[0]
# result['size'] = size
# # result['folders'] = 0
# # result['files'] = 0
# # for (name,directories,files) in os.walk(path):
# #     print (name,directories,files)
# #     if directories:
# #         result['folders']+=len(directories)
# #     if files:
# #         count = 0
# #         for i in files:
# #             if i.endswith('~'):
# #                 continue
# #             #print count
# #             count+=1
# #
# #         result['files'] +=count
# # #print result['files']
# # result  = {"folders": 283, "group": "root", "create_time": "Wed Jan 21 23:59:04 2015", "user": "root", "files": 3338, "size": 12288}
# str = ''
# for i in result:
#     str+="<span><b>{0}</b>: {1}</span>".format(i.replace('_', ' '), result[i])
# print str
import os
from multiprocessing import Process
def f(name):
    os.system('gedit')
def g(name):
    os.system('google-chrome')
processes =[]
p = Process(target=f, args=('bob',))
p.start()
processes.append(p)
p = Process(target=g, args=('bob',))
p.start()
for p in processes:
    p.join()
