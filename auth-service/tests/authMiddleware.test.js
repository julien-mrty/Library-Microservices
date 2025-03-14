const { authenticateToken } = require('../src/middlewares/authMiddleware');
const tokenUtils = require('../src/utils/tokenUtils');

jest.mock('../src/utils/tokenUtils');

describe('Authentication Middleware', () => {
  const mockRequest = (headers = {}) => ({
    header: jest.fn(key => headers[key]), // Fix: Implement header method
    user: null
  });

  const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  });

  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    tokenUtils.verifyToken.mockImplementation(() => ({ userId: 1, username: 'testuser' }));
  });

  it('should allow access with valid token', () => {
    const req = mockRequest({ Authorization: 'Bearer valid-token' }); // Use Authorization key
    const res = mockResponse();

    authenticateToken(req, res, next);

    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ userId: 1, username: 'testuser' });
  });

  it('should deny access with invalid token', () => {
    const req = mockRequest({ Authorization: 'Bearer invalid-token' });
    const res = mockResponse();

    tokenUtils.verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
  });

  it('should require access token', () => {
    const req = mockRequest(); // No headers
    const res = mockResponse();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access token required' });
  });
});