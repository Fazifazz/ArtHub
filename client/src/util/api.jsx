export const apiEndPoints = {
    //user endpoints
    postRegisterData:'/api/user/register',
    postVerifyOtp:'/api/user/verifyOtp',
    postVerifyLogin:'/api/user/verifyLogin',
    postResendOtp:'/api/user/resendOtp',

    //artist endpoints
    postArtistVerifyLogin:'/api/artist/artistVerifyLogin',
    postArtistRegister:'/api/artist/artistRegister',
    getCategories:'/api/artist/getCategories',
    postArtistOtp:'/api/artist/artistOtp',
    ArtistResendOtp:'/api/artist/artistResendOtp',

    //admin endpoints
    postAdminLogin:'/api/admin/postAdminLogin',
    showUsers:'/api/admin/showUsers',
    blockUser:'/api/admin/blockUser',
    showCategories:'/api/admin/showCategories',
    postAddCategory:'/api/admin/AddCategory',
    unlistCategory:'/api/admin/deleteCategory',
    editCategory:'/api/admin/editCategory',
    updateCategory:'/api/admin/updateCategory',
    showPlans:'/api/admin/showPlans',
    postAddPlan:'/api/admin/postAddPlan',
    unlistPlan:'/api/admin/deletePlan',
    editPlan:'/api/admin/editPlan',
    updatePlan:'/api/admin/updatePlan',
    showArtists:'/api/admin/showArtists',
    blockArtist:'/api/admin/blockArtist',

}