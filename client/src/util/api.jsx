export const apiEndPoints = {
    //user endpoints
    postRegisterData:'/api/user/register',
    postVerifyOtp:'/api/user/verifyOtp',
    postVerifyLogin:'/api/user/verifyLogin',
    postResendOtp:'/api/user/resendOtp',
    forgetVerifyEmail:'/api/user/verifyEmail',
    updatePassword:'/api/user/updatePassword',
    getAllPosts:'/api/user/getAllPosts',
    likePost:'/api/user/likePost',
    unLikePost:'/api/user/unLikePost',
    comment:'/api/user/comment',
    updateUserProfile:'/api/user/updateUserProfile',
    getAllArtists:'/api/user/getAllArtists',
    followArtist:'/api/user/followArtist',
    unFollowArtist:'/api/user/unFollowArtist',
    getArtistAllposts:'/api/user/getArtistAllposts',
    getAllBanners:'/api/user/getAllBanners',
    getComments:'/api/user/getComments',

    //artist endpoints
    postArtistVerifyLogin:'/api/artist/artistVerifyLogin',
    postArtistRegister:'/api/artist/artistRegister',
    getCategories:'/api/artist/getCategories',
    postArtistOtp:'/api/artist/artistOtp',
    ArtistResendOtp:'/api/artist/artistResendOtp',
    forgetArtistVerifyEmail:'/api/artist/artistVerifyEmail',
    artistUpdatePassword:'/api/artist/artistUpdatePassword',
    getPlansAvailable:'/api/artist/getPlansAvailable',
    subscribePlan:'/api/artist/subscribePlan',
    verifyPayment:'/api/artist/verifyPayment',
    uploadPost:'/api/artist/uploadPost',
    getMyPosts:'/api/artist/getMyPosts',
    deletePost:'/api/artist/deletePost',
    editArtistProfile:'/api/artist/editArtistProfile',
    getPostComments:'/api/artist/getPostComments',
    replyUserComment:'/api/artist/replyUserComment',
    deleteReply:'/api/artist/deleteReply',

    //admin endpoints
    postAdminLogin:'/api/admin/postAdminLogin',
    showUsers:'/api/admin/showUsers',
    blockUser:'/api/admin/blockUser',
    showCategories:'/api/admin/showCategories',
    postAddCategory:'/api/admin/AddCategory',
    unlistCategory:'/api/admin/deleteCategory',
    updateCategory:'/api/admin/updateCategory',
    showPlans:'/api/admin/showPlans',
    postAddPlan:'/api/admin/postAddPlan',
    unlistPlan:'/api/admin/deletePlan',
    updatePlan:'/api/admin/updatePlan',
    showArtists:'/api/admin/showArtists',
    approveArtist:'/api/admin/approveArtist',
    blockArtist:'/api/admin/blockArtist',
    showBanners:'/api/admin/showBanners',
    addBanner:'/api/admin/addBanner',
    deleteBanner:'/api/admin/deleteBanner',
    updateBanner:'/api/admin/updateBanner',
    getSubscriptionHistory:'/api/admin/getSubscriptionHistory',

}