const postModel = require('../models/post')


async function getAllPosts(req, res){

    const allPosts = await postModel.find({}).populate([{path: 'author'}, {path: 'comments.commentAuthor'}])
    const documentCount = await postModel.countDocuments({})
    if(allPosts.length === 0){  // if there is no data in DB (ie. 'allPosts' is empty)
        res.send('<h3 style="text-align:center; font-size: 2.5em; color:blue"><i>The Social Network</i></h3> <p>All posts will appear here, no new posts for now. </p>')
    } else {

        const data = {    // combining data fetched from DB and flash message into one single object so that it can be passed to view
            blogs: allPosts,
            currentUser: req.session.user
        }
        res.render('postsTemplate', {data: data})
    }

}


function showBlogCreationPage(req, res) {

    res.render('createBlogPage')

}


async function createNewPost(req, res) {

    try {
        const newPost = new postModel({title: req.body.title, content: req.body.content, author: req.session.user.userId, thumbnail: req.file.filename})
        
        await newPost.save() 
        
        req.flash('success', 'Blog uploaded successfully')

        res.redirect('/post')  
    }
    catch(error){
        req.flash('failure', 'Cannot upload your blog, try again later')

        res.redirect('/post')
    }
}


async function deletePost(req, res) {
    
    try{
        const postIdToRemove = req.params.blogId;
        const originalBlog = await postModel.findById(req.params.blogId)

        // checking whether current user is the author of the blog or whether the request is made by an admin
        if((originalBlog.author._id.toString() === req.session.user.userId) || (req.session.user.role === 'admin')) {

            const deletedPost = await postModel.findByIdAndDelete(postIdToRemove)

            req.flash('success', 'Blog deleted successfully')
            
            // redirecting based on role
            const role = req.session.user.role
            role === 'admin'? res.redirect('/admin/blogInfo'): res.redirect('/post')

        }else{
            req.flash('failure', 'Cannot delete blog, try again later')

            res.redirect('/post')
        }
        
    }
    catch(error){
        req.flash('failure', 'Cannot delete blog, try again later')

        res.redirect('/post')
    }

}


async function showBlogEditPage(req, res) {

    try{

        const blogIdToDelete = req.params.blogId

        const entireBlog = await postModel.findById(blogIdToDelete)

        res.render('editBlogPage', {previousBlog: entireBlog})

    }catch(error){

        req.flash('failure', 'Cannot display blog editing page, try again later')

        res.redirect('/post')

    }

}



async function updatePost(req, res) {

    try{
        
        const newData = req.body
        const updatedBlogThumbnail = req.file.filename  // fetching thumbnail name from the file object added to the request object by multer
        newData.thumbnail = updatedBlogThumbnail // adding thumbnail field to the new data
        const previousData = await postModel.findById(req.params.blogId)

        // checking whether current user is the author of the blog or whether the request is made by an admin
        if((previousData.author._id.toString() === req.session.user.userId) || (req.session.user.role === 'admin')) {

            const updatedData = await postModel.findByIdAndUpdate(req.params.blogId, newData, {new: true})

            req.flash('success', 'Blog updated successfully')
            
            //redirecting based on role
            const role = req.session.user.role
            role === 'admin'? res.redirect('/admin/blogInfo'): res.redirect('/post')

        } else {

            req.flash('info', "Warning: You cannot modify someone else's blog")

            res.redirect('/post')

        }

    }
    catch(error){
        req.flash('failure', 'Blog edit failed, try again later')

        res.redirect('/post')
    }

}



async function likeBlog(req, res) {

    try{

        const blogId = req.params.blogId
        const currentUserId  = req.session.user.userId

        const blogDetails = await postModel.findById(blogId)

        const hasLiked = blogDetails.likes.includes(currentUserId)

        if(hasLiked) {

            await postModel.findByIdAndUpdate(blogId, {$pull: {likes: currentUserId}})

        } else {

            await postModel.findByIdAndUpdate(blogId, {$addToSet: {likes: currentUserId}})

        }
        
        res.status(200).send('--Message From Sever-- Like Operation Successfull!👍')


    }catch(error) {


    }

}


async function addComment(req, res) {

    try{

        const commentContent = req.body.comment
        const blogId = req.params.blogId
        const commentAuthor = req.session.user.userId


       await postModel.findByIdAndUpdate(blogId, {$addToSet: {comments: {commentAuthor:commentAuthor, content: commentContent } } })

        req.flash('success', 'Comment Added')

        res.redirect('/post')
    }
    catch(error){

        req.flash('failure', 'Cannot upload comment, try again later')

        res.redirect('/post')
    }

}


function displayMyAccountPage(req, res) {

    res.render('accountInfo_user')
}


// exporting all methods
module.exports = {
    getAllPosts,
    createNewPost,
    deletePost,
    showBlogEditPage,
    updatePost,
    showBlogCreationPage,
    likeBlog,
    addComment,
    displayMyAccountPage
}
