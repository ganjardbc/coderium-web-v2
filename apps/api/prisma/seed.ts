import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaPg(databaseUrl);
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('Seeding database...');

  // 1. Seed Permissions
  const permissions = [
    { name: 'Manage Users', slug: 'manage_users', description: 'Manage all users' },
    { name: 'Manage All Posts', slug: 'manage_all_posts', description: 'Manage all posts' },
    { name: 'Manage All Playlists', slug: 'manage_all_playlists', description: 'Manage all playlists' },
    { name: 'Manage All Media', slug: 'manage_all_media', description: 'Manage all media' },
    { name: 'View Analytics', slug: 'view_analytics', description: 'View analytics' },
    { name: 'Manage Own Posts', slug: 'manage_own_posts', description: 'Manage own posts' },
    { name: 'Manage Own Playlists', slug: 'manage_own_playlists', description: 'Manage own playlists' },
    { name: 'Manage Own Media', slug: 'manage_own_media', description: 'Manage own media' },
  ];

  const adminPermissions = [
    'manage_users',
    'manage_all_posts',
    'manage_all_playlists',
    'manage_all_media',
    'view_analytics',
  ];

  const authorPermissions = [
    'manage_own_posts',
    'manage_own_playlists',
    'manage_own_media',
  ];

  const createdPermissions: Record<string, string> = {};

  for (const perm of permissions) {
    const created = await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: {},
      create: perm,
    });
    createdPermissions[perm.slug] = created.id;
    console.log(`  Permission: ${perm.slug}`);
  }

  // 2. Seed Roles
  const roles = [
    { name: 'Admin', slug: 'admin', description: 'Administrator with full access' },
    { name: 'Author', slug: 'author', description: 'Content author with access to own content' },
  ];

  const roleIds: Record<string, string> = {};

  for (const role of roles) {
    const created = await prisma.role.upsert({
      where: { slug: role.slug },
      update: {},
      create: role,
    });
    roleIds[role.slug] = created.id;
    console.log(`  Role: ${role.slug}`);
  }

  // 3. Map Roles to Permissions
  for (const permSlug of adminPermissions) {
    const permId = createdPermissions[permSlug];
    if (permId) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roleIds['admin'],
            permissionId: permId,
          },
        },
        update: {},
        create: {
          roleId: roleIds['admin'],
          permissionId: permId,
        },
      });
    }
  }
  console.log('  Admin permissions assigned');

  for (const permSlug of authorPermissions) {
    const permId = createdPermissions[permSlug];
    if (permId) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roleIds['author'],
            permissionId: permId,
          },
        },
        update: {},
        create: {
          roleId: roleIds['author'],
          permissionId: permId,
        },
      });
    }
  }
  console.log('  Author permissions assigned');

  // 4. Seed Users
  const passwordHashAdmin = await bcrypt.hash('Admin@123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@coderium.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@coderium.com',
      passwordHash: passwordHashAdmin,
      status: 'active',
    },
  });
  console.log(`  User: ${adminUser.email}`);

  const passwordHashAuthor = await bcrypt.hash('Author@123', 10);
  const authorUser = await prisma.user.upsert({
    where: { email: 'author@coderium.com' },
    update: {},
    create: {
      name: 'Author User',
      email: 'author@coderium.com',
      passwordHash: passwordHashAuthor,
      status: 'active',
    },
  });
  console.log(`  User: ${authorUser.email}`);

  // 5. Assign Roles to Users
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: roleIds['admin'] } },
    update: {},
    create: { userId: adminUser.id, roleId: roleIds['admin'] },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: authorUser.id, roleId: roleIds['author'] } },
    update: {},
    create: { userId: authorUser.id, roleId: roleIds['author'] },
  });
  console.log('  User roles assigned');

  // 6. Seed Media
  const mediaList = [
    { filename: 'sample-cover-1.jpg', originalName: 'Sample Cover 1', mimeType: 'image/jpeg', size: 102400, url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
    { filename: 'sample-cover-2.jpg', originalName: 'Sample Cover 2', mimeType: 'image/jpeg', size: 204800, url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800' },
    { filename: 'sample-cover-3.jpg', originalName: 'Sample Cover 3', mimeType: 'image/jpeg', size: 307200, url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800' },
  ];
  
  const createdMedia: Record<string, string> = {};
  for (const media of mediaList) {
    const existingMedia = await prisma.media.findFirst({
      where: { filename: media.filename },
    });
    if (!existingMedia) {
      const created = await prisma.media.create({
        data: {
          ...media,
          userId: authorUser.id,
        },
      });
      createdMedia[media.filename] = created.url;
    } else {
      createdMedia[media.filename] = existingMedia.url;
    }
    console.log(`  Media: ${media.filename}`);
  }

  // 7. Seed Posts
  const posts = [
    {
      title: 'Getting Started with Vue 3 Composition API',
      subtitle: 'A complete guide to composition APIs and reactive properties',
      content: 'Vue 3 Composition API introduces a new way of writing components by grouping logical concerns together.\n\n## Why Composition API?\n- Better code reuse\n- Stronger TypeScript support\n- Cleaner code organization\n\nEnjoy building with Vue 3!',
      type: 'article' as const,
      cover: createdMedia['sample-cover-1.jpg'],
      tags: ['vue', 'frontend', 'composition-api'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Building Scalable APIs with NestJS',
      subtitle: 'Create modular, testable, and enterprise-grade backend APIs',
      content: 'NestJS is a progressive Node.js framework for building efficient and scalable server-side applications.\n\n## Core Concepts\n- Modules\n- Controllers\n- Providers/Services\n- Dependency Injection\n\nStart building robust APIs today.',
      type: 'article' as const,
      cover: createdMedia['sample-cover-2.jpg'],
      tags: ['nestjs', 'backend', 'typescript'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Modern CSS Techniques You Should Know',
      subtitle: 'Take your styling skills to the next level with flexbox, grid, and variables',
      content: 'CSS has evolved rapidly. Today we have native nestings, container queries, and subgrids.\n\nStart using modern CSS today!',
      type: 'article' as const,
      cover: createdMedia['sample-cover-3.jpg'],
      tags: ['css', 'styling', 'web-design'],
      isPublished: false,
    },
    {
      title: 'Vue Component Design Patterns',
      subtitle: 'Slides and summaries of the best patterns for component communication',
      content: 'A summary of scoped slots, provide/inject, dynamic components, and renderless components.',
      type: 'carousel' as const,
      tags: ['vue', 'design-patterns', 'carousel'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Full-Stack Deployment Guide',
      subtitle: 'Learn how to deploy your monorepo apps using Docker and Docker Compose',
      content: 'A video guide explaining how to containerize NestJS, Nginx, Nuxt 3, and PostgreSQL database.',
      type: 'video' as const,
      tags: ['deployment', 'docker', 'devops'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'UI Component Library Showcase',
      subtitle: 'A gallery of built-in Vue UI buttons, inputs, and modals',
      content: 'Detailed showcases of the PrimeVue-based Tailwind custom UI components.',
      type: 'stack_gallery' as const,
      tags: ['ui-ux', 'design-system', 'primevue'],
      isPublished: false,
    },
  ];

  const createdPosts: Record<string, string> = {};
  for (const p of posts) {
    const slug = slugify(p.title);
    const created = await prisma.post.upsert({
      where: { slug },
      update: {},
      create: {
        ...p,
        slug,
        userId: authorUser.id,
      },
    });
    createdPosts[p.title] = created.id;
    console.log(`  Post: ${p.title}`);
  }

  // 8. Seed Playlists
  const playlists = [
    {
      title: 'Vue.js Mastery Path',
      description: 'A curated path of posts to master Vue.js framework from options/composition API to design patterns',
      cover: createdMedia['sample-cover-1.jpg'],
      isPublished: true,
    },
    {
      title: 'Backend with NestJS',
      description: 'Step-by-step collection of NestJS articles to master modular server development',
      cover: createdMedia['sample-cover-2.jpg'],
      isPublished: true,
    },
  ];

  const createdPlaylists: Record<string, string> = {};
  for (const pl of playlists) {
    const slug = slugify(pl.title);
    const created = await prisma.playlist.upsert({
      where: { slug },
      update: {},
      create: {
        ...pl,
        slug,
        userId: adminUser.id,
      },
    });
    createdPlaylists[pl.title] = created.id;
    console.log(`  Playlist: ${pl.title}`);
  }

  // 9. Link Posts to Playlists (PlaylistPost)
  const playlistPostLinks = [
    { playlistTitle: 'Vue.js Mastery Path', postTitle: 'Getting Started with Vue 3 Composition API', order: 1 },
    { playlistTitle: 'Vue.js Mastery Path', postTitle: 'Vue Component Design Patterns', order: 2 },
    { playlistTitle: 'Backend with NestJS', postTitle: 'Building Scalable APIs with NestJS', order: 1 },
  ];

  for (const link of playlistPostLinks) {
    const playlistId = createdPlaylists[link.playlistTitle];
    const postId = createdPosts[link.postTitle];

    if (playlistId && postId) {
      await prisma.playlistPost.upsert({
        where: {
          playlistId_postId: {
            playlistId,
            postId,
          },
        },
        update: {},
        create: {
          playlistId,
          postId,
          userId: adminUser.id,
          order: link.order,
        },
      });
    }
  }
  console.log('  Playlists linked to posts successfully');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
