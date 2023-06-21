const strings = {
  ERRORS: {
    BODY_EMPTY: "Request body is empty",
    USER_NOT_EXISTS: "User does not exists!",
    INTERNAL_SERVER_ERROR: "Internal server error!",
    //NEURAL
    NEURAL_GROUP_TITLE_EXISTS: "Neural Group title already exist!",
    NEURAL_GROUP_NOT_EXISTS: "Neural group doesn't exist!",
    NEURAL_GROUP_REQUEST_EXISTS:
      "Neural group invite already sent to this user!",

    NEURAL_GROUP_REQUEST_NOT_EXISTS: "Neural group request doesn't exist!",
    USER_POST_REQUEST_NOT_EXISTS: "Post does not exist!",
  },

  TEXTS: {
    //ACCOUNT
    ACCOUNT_UPDATED: "Account updated successfully",
    ACCOUNT_UPVOTED: "Account upvoted successfully",

    PROFILE_PHOTO_UPDATED: "Profile Photo updated successfully",
    USER_FETCHED: "User fetched successfully",

    //NEURAL
    NEURAL_GROUP_CREATED: "Neural Group created successfully",
    NEURAL_GROUP_REQUEST_SENT: "Neural Group invite sent successfully!",
    NEURAL_GROUP_REQUESTS: "Neural Group requests fetched successfully!",
    NEURAL_GROUP_REQUESTS_DECISION:
      "Neural Group requests updated successfully!",

    //debate

    DEBATE_REQUEST_SENT: "Debate  invite sent successfully!",
  },
  NOTIFICATIONS: {
    neural: {
      CREATE_NEURAL_GROUP: {
        title: "Neural Group ",
        message: "Neural Group created successfully!",
      },
    },
    neural_request: {
      CREATE_NEURAL_REQUEST: {
        title: "Neural Group Request",
        message: "You are invited to neural group! ",
      },
    },
    user: {
      UPVOTE: {
        title: "Upvote Profile",
        message: "Your profile is upvoted ",
      },
    },
    debate: {
      CREATE: {
        title: "Debate Request",
        message: "Debate Request sent successfully",
      },
    },
  },

  STATUS: {
    ACTIVE: "active",
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    INACTIVE: "inactive",
    UNAPPROVED: "unapproved",
    APPROVED: "approved",
    COMPLETED: "completed",
    INCOMPLETE: "incomplete",
    INPROGRESS: "inprogress",
  },

  STATUS_CODE: {
    NOT_FOUND: 404,
    EXISTS: 400,
    INTERNAL_SERVER_ERROR: 500,
    SUCCESS: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
  },
};

export default strings;
