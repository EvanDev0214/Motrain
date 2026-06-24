export const registerSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['nickname', 'email', 'password', 'confirmPassword'],
    properties: {
      nickname: {
        type: 'string',
        example: 'John'
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com'
      },
      password: {
        type: 'string',
        example: 'password123'
      },
      confirmPassword: {
        type: 'string',
        example: 'password123'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      message: {
        type: 'string',
        example: 'Verification email sent'
      },
      data: {
        type: 'object',
        properties: {
          userId: {
            type: 'string'
          },
          email: {
            type: 'string',
            example: 'user@example.com'
          },
          createdAt: {
            type: 'string',
            example: '2026-06-22T00:00:00.000Z'
          }
        }
      }
    }
  }
};

export const verifyEmailOtpSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['email', 'otp'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com'
      },
      otp: {
        type: 'string',
        example: '054920'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      message: {
        type: 'string',
        example: 'Email verified successfully'
      }
    }
  }
};

export const resendEmailOtpSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      message: {
        type: 'string',
        example: 'If this email is registered, a verification code has been sent'
      }
    }
  }
};

export const loginSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com'
      },
      password: {
        type: 'string',
        example: 'password123'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      message: {
        type: 'string',
        example: 'Login account successfully'
      },
      data: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          }
        }
      }
    }
  }
};

export const refreshTokenSchema: SwaggerSchema = {
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      message: {
        type: 'string',
        example: 'Token refreshed successfully'
      },
      data: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          }
        }
      }
    }
  }
};
