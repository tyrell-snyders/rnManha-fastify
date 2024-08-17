import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';

export const getAvatar = (seed: string) => {
    //Create user avatar
    const avatar = createAvatar(adventurer, {
        seed,
        backgroundType: ["gradientLinear","solid"],
        backgroundRotation: [0, 360],
        earrings: ["variant01","variant02","variant03"]
    });

    return avatar.toDataUri();
}
