export const apiEndPoints = {
  //user endpoints
  postRegisterData: "/api/user/register",
  postVerifyOtp: "/api/user/verifyOtp",
  postVerifyLogin: "/api/user/verifyLogin",
  postResendOtp: "/api/user/resendOtp",
  forgetVerifyEmail: "/api/user/verifyEmail",
  updatePassword: "/api/user/updatePassword",
  getAllFollowingPosts: "/api/user/getAllFollowingPosts",
  getAllPosts: "/api/user/getAllPosts",
  likePost: "/api/user/likePost",
  unLikePost: "/api/user/unLikePost",
  comment: "/api/user/comment",
  updateUserProfile: "/api/user/updateUserProfile",
  getAllArtists: "/api/user/getAllArtists",
  followArtist: "/api/user/followArtist",
  unFollowArtist: "/api/user/unFollowArtist",
  getArtistAllposts: "/api/user/getArtistAllposts",
  getAllBanners: "/api/user/getAllBanners",
  getComments: "/api/user/getComments",
  checkRole: "api/user/checkRole",
  getCurrentUser: "api/user/getCurrentUser",
  getArtistFollowers: "api/user/getArtistFollowers",
  getUserFollowings: "api/user/getUserFollowings",
  getArtistsFollowed: "api/user/getArtistsFollowed",
  getChatMessages: "api/user/getChatMessages",
  sendNewMessage: "api/user/sendNewMessage",
  getUserAllNotifications: "api/user/getUserAllNotifications",
  clearUserAllNotifications: "api/user/clearUserAllNotifications",
  deleteUserNotification: "api/user/deleteUserNotification",
  userNotificationsCount: "api/user/userNotificationsCount",
  addRatingToArtist: "api/user/addRatingToArtist",
  chechUserRating: "api/user/chechUserRating",
  deleteComment: "api/user/deleteComment",

  //artist endpoints
  postArtistVerifyLogin: "/api/artist/artistVerifyLogin",
  postArtistRegister: "/api/artist/artistRegister",
  getCategories: "/api/artist/getCategories",
  postArtistOtp: "/api/artist/artistOtp",
  ArtistResendOtp: "/api/artist/artistResendOtp",
  forgetArtistVerifyEmail: "/api/artist/artistVerifyEmail",
  artistUpdatePassword: "/api/artist/artistUpdatePassword",
  getPlansAvailable: "/api/artist/getPlansAvailable",
  subscribePlan: "/api/artist/subscribePlan",
  verifyPayment: "/api/artist/verifyPayment",
  uploadPost: "/api/artist/uploadPost",
  getMyPosts: "/api/artist/getMyPosts",
  deletePost: "/api/artist/deletePost",
  editArtistProfile: "/api/artist/editArtistProfile",
  getPostComments: "/api/artist/getPostComments",
  replyUserComment: "/api/artist/replyUserComment",
  deleteReply: "/api/artist/deleteReply",
  getAllMessagedUsers: "/api/artist/getAllMessagedUsers",
  getPrevMessages: "/api/artist/getPrevMessages",
  sendArtistNewMsg: "/api/artist/sendArtistNewMsg",
  getArtistNotifications: "/api/artist/getArtistNotifications",
  deleteNotification: "/api/artist/deleteNotification",
  clearArtistAllNotifications: "/api/artist/clearArtistAllNotifications",
  getArtistNotificationCount: "/api/artist/getArtistNotificationCount",
  getMySubscriptions: "/api/artist/getMySubscriptions",
  getFollowersInArtistSide: "api/artist/getFollowersInArtistSide",

  getArtistBanners: "/api/artist/getArtistBanners",
  getRatedUsers: "/api/artist/getRatedUsers",
  checkArtistBlocked: "/api/artist/checkArtistBlocked",

  //admin endpoints
  postAdminLogin: "/api/admin/postAdminLogin",
  showUsers: "/api/admin/showUsers",
  blockUser: "/api/admin/blockUser",
  showCategories: "/api/admin/showCategories",
  postAddCategory: "/api/admin/AddCategory",
  unlistCategory: "/api/admin/deleteCategory",
  updateCategory: "/api/admin/updateCategory",
  showPlans: "/api/admin/showPlans",
  postAddPlan: "/api/admin/postAddPlan",
  unlistPlan: "/api/admin/deletePlan",
  updatePlan: "/api/admin/updatePlan",
  showArtists: "/api/admin/showArtists",
  approveArtist: "/api/admin/approveArtist",
  blockArtist: "/api/admin/blockArtist",
  showBanners: "/api/admin/showBanners",
  addBanner: "/api/admin/addBanner",
  deleteBanner: "/api/admin/deleteBanner",
  updateBanner: "/api/admin/updateBanner",
  getSubscriptionHistory: "/api/admin/getSubscriptionHistory",
  getDashboardDatas: "/api/admin/getDashboardDatas",
};
