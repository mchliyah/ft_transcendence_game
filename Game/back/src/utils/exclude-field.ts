import { User } from '@prisma/client';
export function exclude(user: User, field: keyof User): User {
  const res = Object.entries(user)
    .map(([key, val]: [string, string]) =>
      key !== field
        ? {
            [key]: val,
          }
        : undefined,
    )
    .filter((field) => field !== undefined);

  return Object.assign({}, ...res);
}
