import { describe, expect, it } from 'vitest';
import { authenticateDemoUser } from '../../context/AuthContext';

describe('authenticateDemoUser', () => {
  it('maps demo credentials to the matching RBAC role', () => {
    const response = authenticateDemoUser('jordan@acme.com', 'demo1234');

    expect(response.accessToken).toBe('demo-local-pm-u3');
    expect(response.user.role).toBe('PM');
    expect(response.user.orgId).toBe('org1');
  });

  it('accepts case-insensitive demo emails', () => {
    const response = authenticateDemoUser('ALEX@GENQUE.IO', 'demo1234');

    expect(response.user.role).toBe('SA');
  });

  it('rejects invalid demo credentials', () => {
    expect(() => authenticateDemoUser('jordan@acme.com', 'wrongpassword')).toThrow(
      /invalid demo credentials/i,
    );
  });
});
