import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    description: z.string(),
    status: z.enum(['upcoming', 'completed', 'cancelled']),
  }),
});

const roster = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/roster' }),
  schema: z.object({
    callsign: z.string(),
    realName: z.string().optional(),
    role: z.string(),
    loadout: z.string(),
    joinedDate: z.coerce.date().optional(),
    active: z.boolean(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    eventRef: z.string().optional(),
    summary: z.string(),
    photos: z.array(z.string()).optional(),
  }),
});

export const collections = { events, roster, gallery };
