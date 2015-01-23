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
from TREE.Views import Views

print dir(Views)
print Views.__file__
