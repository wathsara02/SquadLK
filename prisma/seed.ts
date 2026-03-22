import { PrismaClient, Role, District, Platform, PlayStyle, Language, ProfileVisibility, MessagePermission } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const gamesData = [
    {
        name: 'Valorant',
        slug: 'valorant',
        category: 'FPS',
        ranks: [
            { label: 'Iron', tier: 'Iron', sortPriority: 10 },
            { label: 'Bronze', tier: 'Bronze', sortPriority: 20 },
            { label: 'Silver', tier: 'Silver', sortPriority: 30 },
            { label: 'Gold', tier: 'Gold', sortPriority: 40 },
            { label: 'Platinum', tier: 'Platinum', sortPriority: 50 },
            { label: 'Diamond', tier: 'Diamond', sortPriority: 60 },
            { label: 'Ascendant', tier: 'Ascendant', sortPriority: 70 },
            { label: 'Immortal', tier: 'Immortal', sortPriority: 80 },
            { label: 'Radiant', tier: 'Radiant', sortPriority: 90 },
        ]
    },
    {
        name: 'PUBG Mobile',
        slug: 'pubg-mobile',
        category: 'Battle Royale',
        ranks: [
            { label: 'Bronze', sortPriority: 10 },
            { label: 'Silver', sortPriority: 20 },
            { label: 'Gold', sortPriority: 30 },
            { label: 'Platinum', sortPriority: 40 },
            { label: 'Diamond', sortPriority: 50 },
            { label: 'Crown', sortPriority: 60 },
            { label: 'Ace', sortPriority: 70 },
            { label: 'Ace Master', sortPriority: 80 },
            { label: 'Conqueror', sortPriority: 90 },
        ]
    },
    {
        name: 'Call of Duty Mobile',
        slug: 'cod-mobile',
        category: 'FPS',
        ranks: [
            { label: 'Rookie', sortPriority: 10 },
            { label: 'Veteran', sortPriority: 20 },
            { label: 'Elite', sortPriority: 30 },
            { label: 'Pro', sortPriority: 40 },
            { label: 'Master', sortPriority: 50 },
            { label: 'Grand Master', sortPriority: 60 },
            { label: 'Legendary', sortPriority: 70 },
        ]
    },
    {
        name: 'EA Sports FC',
        slug: 'ea-fc',
        category: 'Sports',
        ranks: [
            { label: 'Division 10', sortPriority: 10 },
            { label: 'Division 5', sortPriority: 50 },
            { label: 'Division 1', sortPriority: 90 },
            { label: 'Elite', sortPriority: 100 },
        ]
    },
    {
        name: 'Dota 2',
        slug: 'dota-2',
        category: 'MOBA',
        ranks: [
            { label: 'Herald', sortPriority: 10 },
            { label: 'Guardian', sortPriority: 20 },
            { label: 'Crusader', sortPriority: 30 },
            { label: 'Archon', sortPriority: 40 },
            { label: 'Legend', sortPriority: 50 },
            { label: 'Ancient', sortPriority: 60 },
            { label: 'Divine', sortPriority: 70 },
            { label: 'Immortal', sortPriority: 80 },
        ]
    },
    {
        name: 'CS2',
        slug: 'cs2',
        category: 'FPS',
        ranks: [
            { label: 'Silver I', tier: 'Silver', sortPriority: 10 },
            { label: 'Gold Nova I', tier: 'Gold Nova', sortPriority: 30 },
            { label: 'Master Guardian I', tier: 'Master Guardian', sortPriority: 50 },
            { label: 'Global Elite', tier: 'Global Elite', sortPriority: 100 },
        ]
    },
    {
        name: 'Fortnite',
        slug: 'fortnite',
        category: 'Battle Royale',
        ranks: [
            { label: 'Bronze', sortPriority: 10 },
            { label: 'Silver', sortPriority: 20 },
            { label: 'Gold', sortPriority: 30 },
            { label: 'Platinum', sortPriority: 40 },
            { label: 'Diamond', sortPriority: 50 },
            { label: 'Elite', sortPriority: 60 },
            { label: 'Champion', sortPriority: 70 },
            { label: 'Unreal', sortPriority: 80 },
        ]
    }
];

const districts = Object.values(District);
const languages = Object.values(Language);
const platforms = Object.values(Platform);
const playStyles = Object.values(PlayStyle);

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems<T>(arr: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function main() {
    console.log('Starting seed...');

    // 1. Create Games and Ranks
    for (const gData of gamesData) {
        const game = await prisma.game.upsert({
            where: { slug: gData.slug },
            update: {},
            create: {
                name: gData.name,
                slug: gData.slug,
                category: gData.category,
                rankDefinition: {
                    create: {
                        isFreeText: false,
                        options: {
                            create: gData.ranks.map(r => ({
                                label: r.label,
                                tier: (r as any).tier || null,
                                sortPriority: r.sortPriority
                            }))
                        }
                    }
                }
            }
        });
        console.log(`Created game: ${game.name}`);
    }

    // 2. Create Admin Users
    const passwordHash = await bcrypt.hash('password123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@squadfinder.lk' },
        update: {},
        create: {
            email: 'admin@squadfinder.lk',
            username: 'admin',
            displayName: 'System Admin',
            passwordHash,
            role: Role.SUPER_ADMIN,
            district: District.COLOMBO,
            languages: [Language.ENGLISH, Language.SINHALA],
        }
    });

    // 3. Create 25 Users
    const games = await prisma.game.findMany({ include: { rankDefinition: { include: { options: true } } } });

    console.log('Creating 25 random seeded users...');
    for (let i = 1; i <= 25; i++) {
        const user = await prisma.user.upsert({
            where: { email: `player${i}@test.com` },
            update: {},
            create: {
                email: `player${i}@test.com`,
                username: `gamer_tag_${i}`,
                displayName: `Player ${i}`,
                passwordHash,
                district: randomItem(districts),
                languages: randomItems(languages, 1, 2),
                platforms: randomItems(platforms, 1, 2),
                playStyles: randomItems(playStyles, 1, 3),
                profileVisibility: ProfileVisibility.PUBLIC,
                allowMessagesFrom: MessagePermission.ANYONE,
            }
        });

        // Assign 1-3 games per user
        const selectedGames = randomItems(games as any[], 1, 3);
        for (const game of selectedGames) {
            const opts = game.rankDefinition?.options || [];
            const rank = opts.length > 0 ? randomItem(opts).label : 'Unranked';

            await prisma.userGameProfile.upsert({
                where: { userId_gameId: { userId: user.id, gameId: game.id } },
                update: {},
                create: {
                    userId: user.id,
                    gameId: game.id,
                    inGameName: `ProGamer_${i}_${game.slug}`,
                    platform: randomItem(user.platforms),
                    rank: rank,
                    lookingForTeam: Math.random() > 0.5,
                }
            });
        }
    }

    console.log('Seed completed successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
