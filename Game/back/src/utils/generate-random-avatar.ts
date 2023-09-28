import { ConfigService } from '@nestjs/config';

export function generateRandomAvatar(config: ConfigService): string {
  const defaultAvatars = [
    config.get<string>('AVATAR1'),
    config.get<string>('AVATAR2'),
    config.get<string>('AVATAR3'),
    config.get<string>('AVATAR4'),
  ];

  // Generate a random index using Math.random()
  const randomAvatarIndex = Math.floor(Math.random() * defaultAvatars.length);
  const randomAvatar = defaultAvatars[randomAvatarIndex];

  return randomAvatar;
}
