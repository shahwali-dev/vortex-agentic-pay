export interface Permission {
  id: string;
  name: string;
  description: string;
}

export const defaultPermissions: Permission[] = [
  { id: 'read', name: 'Read', description: 'Read access' },
  { id: 'write', name: 'Write', description: 'Write access' },
  { id: 'pay', name: 'Pay', description: 'Payment access' },
];
