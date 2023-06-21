export interface ErrorResponse {
  error: boolean;
  message: string;
  data: [] | any;
}

export interface CreateAccountRequestBody {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  dataOfBirth: string;
  gender: string;
  background: {
    stem: string;
    technologyEthicsBeliefs: string;
  };
  profileImageUrl: string;
  password: string;
}

export interface LoginAccountRequestBody {
  email: string;
  password: string;
}

export interface VerifyAccountRequestBody {
  email: string;
  verificationCode: string;
}

export interface ForgotPasswordLinkRequestBody {
  email: string;
}

export interface ForgotPasswordRequestBody {
  code: string;
  password: string;
}

export interface Response {
  statusCode: number;
  message: string;
  data?: [] | any;
}

export interface NotificationBodyRequest {
  title: string;
  payload: { [key: string]: any };
  receiversID: string[];
}

export interface FriendRequestBodyRequest {
  receiverID: string;
  payload: { [key: string]: any };
}

export interface SubscribeBodyRequest {
  expirationTime: string | null;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface CreatePostRequestBody {
  authorId: string;
  content: string;
  media: {
    images: string[];
    videos: string[];
  };
}

export interface CreateCommentRequestBody {
  postId: string;
  createdAt: string;
  authorId: string;
  content: string;
  receiverId: string;
}

export interface SharePostRequestBody {
  postId: string;
  authorId: string;
  description: string;
  createdAt: string;
  receiverId: string;
  payload: { [key: string]: any };
}

export interface UpVoteCommentRequestBody {
  commentId: string;
  createdAt: string;
  userId: string;
  receiverId: string;
  payload: { [key: string]: any };
}

export interface UpVoteSharedPostRequestBody {
  sharedPostId: string;
  userId: string;
  createdAt: string;
  receiverId: string;
  payload: { [key: string]: any };
}

export interface UpVotePostRequestBody {
  userId: string;
  postId: string;
  createdAt: string;
  receiverId: string;
  payload: { [key: string]: any };
}

//update account
export interface UpdateAccountRequestBody {
  user_name: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  background: {
    stem: string;
    technologyEthicsBeliefs: string;
  };
}
//update profile image
export interface UpdateProfileImageRequestBody {
  profile_image_url: string;
}

//update account
export interface NeuralRequestDecisionRequestBody {
  decision: string;
  neural_requests_id: string;
}

//create neural
export interface CreateNeuralRequestBody {
  title: string;
  description: string;
  leader_id: string;
}
//create neural requests
export interface CreateNeuralRequestsBody {
  neural_id: string;
  user_id: string;
}

//upvote user profile
export interface UpvoteUserRequestsBody {
  count: number;
}
//create debate
export interface CreateDebateRequestBody {
  topic: string;
  description: string;
  opponent_id: string;
  affirmative: string;
  negative: string;
}
