-- Seed data: 12 realistic contests for launch
-- Run after schema.sql

insert into contests (title, brand, description, prize, deadline, category, source_platform, source_url, thumbnail_url, featured, status, approved) values

(
  'Create a 30-Second Ad for Our New Running Shoe',
  'Apex Athletics',
  'We are looking for video creators to produce a 30-second commercial for our upcoming running shoe. Your ad should capture energy, movement, and the spirit of pushing limits. Style: cinematic or fast-cut. Must include product footage (we will ship you a sample pair).',
  '$1,000 cash',
  (current_date + interval '21 days')::date,
  'Ad',
  'Instagram',
  'https://www.instagram.com',
  null,
  true,
  'open',
  true
),

(
  'Short Film Competition — "Unseen City"',
  'Urban Lens Festival',
  'Show us the unseen side of the city you live in. Any city, any country. Max 5 minutes. We want raw, observational storytelling. No narration required. All formats accepted — phone, DSLR, film.',
  '$2,500 + festival screening',
  (current_date + interval '35 days')::date,
  'Short Film',
  'Website',
  'https://www.urbanlensfestival.com',
  null,
  true,
  'open',
  true
),

(
  'Music Video Challenge: Indie Electronic Artists',
  'Wavefront Records',
  'Wavefront Records is accepting music video submissions for three of our indie electronic artists. You pick the track, you direct the video. Best video wins a paid licensing deal and placement on our streaming channels. Creative freedom is key — we want weird.',
  '$800 + sync license deal',
  (current_date + interval '28 days')::date,
  'Music Video',
  'Twitter',
  'https://twitter.com',
  null,
  true,
  'open',
  true
),

(
  'Social Reel Contest: Show Your Morning Routine',
  'Brew Collective Coffee',
  'How do you start your day? We want to see your morning routine featuring Brew Collective products (or not — we just want great content). Best reel wins free coffee for a year plus $250. Post publicly and tag us.',
  '$250 + 1yr free coffee',
  (current_date + interval '14 days')::date,
  'Social',
  'Instagram',
  'https://www.instagram.com',
  null,
  false,
  'open',
  true
),

(
  'Cinematic Travel Reel — Southeast Asia',
  'NomadGear',
  'Calling all travel filmmakers. Shoot a cinematic travel reel (60 seconds to 3 minutes) set anywhere in Southeast Asia. Focus on atmosphere, light, and local life. NomadGear will feature the winning video in their brand campaign.',
  'Gear package ($1,200 value) + brand feature',
  (current_date + interval '42 days')::date,
  'Cinematic',
  'YouTube',
  'https://www.youtube.com',
  null,
  false,
  'open',
  true
),

(
  'Reddit r/filmmakers Annual Short Film Jam',
  'r/filmmakers Community',
  'Annual 48-hour short film jam hosted by the r/filmmakers subreddit. Theme announced at start. Max 10 minutes. All skill levels welcome. Judged by community vote plus a panel of working directors. No budget required.',
  'Community recognition + equipment prizes',
  (current_date + interval '60 days')::date,
  'Short Film',
  'Reddit',
  'https://www.reddit.com/r/filmmakers',
  null,
  false,
  'open',
  true
),

(
  'Product Ad Challenge: Skincare Flat Lay Reel',
  'Glow Theory',
  'Create a 15-30 second product reel for our skincare line using flat lay or tabletop cinematography. We will ship product to top applicants. Judged on lighting, color grading, and overall vibe. Looking for that cool editorial aesthetic.',
  '$400 + product gifting',
  (current_date + interval '18 days')::date,
  'Ad',
  'Instagram',
  'https://www.instagram.com',
  null,
  false,
  'open',
  true
),

(
  'Drone Cinematography Contest',
  'SkyView Media',
  'Submit your most stunning drone footage — landscapes, cityscapes, architecture, or events. Edit it into a 60-90 second cinematic piece. Any location worldwide. Must be original footage shot in the past 12 months. RAW files may be requested.',
  '$1,500 cash + feature in our reel library',
  (current_date + interval '30 days')::date,
  'Cinematic',
  'Website',
  'https://skyviewmedia.com',
  null,
  false,
  'open',
  true
),

(
  'Comedy Sketch Ad Competition',
  'Snack Riot',
  'We make chaotic snacks for chaotic people. Make us a funny 30-60 second ad. Go absurd. The more unhinged the better. You can use our products (we will send them) or just reference the brand vibe. Will be shared on all our channels.',
  '$600 cash + year supply of snacks',
  (current_date + interval '25 days')::date,
  'Ad',
  'Twitter',
  'https://twitter.com',
  null,
  false,
  'open',
  true
),

(
  'YouTube Shorts Creator Challenge',
  'Pixelcraft Tools',
  'Create a YouTube Short (under 60 seconds) demonstrating a creative use of our design tools. Show your workflow, a process video, or a before/after. We are looking for authentic content creators who actually use creative tools.',
  '$300 + annual pro subscription',
  (current_date + interval '20 days')::date,
  'Social',
  'YouTube',
  'https://www.youtube.com',
  null,
  false,
  'open',
  true
),

(
  'Mini-Documentary: "People Who Build Things"',
  'Workshop Magazine',
  'Pitch and produce a 3-5 minute mini-documentary about someone who makes or builds things with their hands. Woodworkers, ceramicists, car restorers, electronics hackers — anyone creating something physical. We want intimacy and craft on screen.',
  '$1,000 + print feature',
  (current_date + interval '45 days')::date,
  'Short Film',
  'Website',
  'https://workshopmagazine.com',
  null,
  false,
  'open',
  true
),

(
  'Dance x Cinematography Collab Contest',
  'Rhythm Labs',
  'Partner with a dancer (or be one yourself) and shoot a 60-90 second video that merges movement and filmmaking. We care about sync, visual language, and how the camera works with the body. Location/setting is entirely up to you.',
  '$750 + artist feature',
  (current_date + interval '33 days')::date,
  'Social',
  'Instagram',
  'https://www.instagram.com',
  null,
  false,
  'open',
  true
);
