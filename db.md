<!--
collection : posts
Add new post
id *
title *
slug *
image *
createAt *
userID *
hot: bool
categoryID
status : 1(approved) 2(pending) 3(rejected) *
content *

category : title ,id ,slug

user :
    +id
    +displayName
    +email
    +password
    +avatar
    +status(active, pending, ban)
    +role(Admin, Mod, User)
 -->
