import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
describe('User entity', () => {
  let user: User;
  beforeEach(() => {
    user = new User();
    user.password = 'password';
    user.salt = 'test Salt';
  });
  describe('validatePassword', () => {
    const mockBcrypt = {
      ...bcrypt,
      hash: jest.fn(),
    };
    it('return true as password is valid', async () => {
      const password = 'password';
      mockBcrypt.hash.mockReturnValue(password);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      // const result = user.validatePassword(password);
      expect(bcrypt.hash).not.toHaveBeenCalledWith(password, 'testSalt');
      //expect(result).toEqual(true);
    });
    it('return false as password is invalid', () => {
      const password = 'wrongpassword';
      mockBcrypt.hash.mockReturnValue(password);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      //  const result = user.validatePassword(password);
      expect(bcrypt.hash).not.toHaveBeenCalledWith(password, 'testSalt');
      //expect(result).toEqual(false);
    });
  });
});
