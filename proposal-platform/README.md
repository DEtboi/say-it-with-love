# 💕 Say It With Love

A free, lightweight, emotionally engaging proposal platform that allows anyone to ask an important relationship question through a personalized, shareable web page.

![License](https://img.shields.io/badge/license-MIT-pink)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

- **4 Proposal Types**: Valentine, Marriage, Girlfriend, Boyfriend
- **Beautiful Animations**: Floating hearts, confetti, smooth transitions
- **Mobile-First Design**: Optimized for WhatsApp & Instagram sharing
- **No Login Required**: Create and share in under a minute
- **100% Free**: Hosted on free-tier infrastructure
- **Privacy-Respecting**: Auto-deletes after 5 days

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/proposal-platform.git
   cd proposal-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Storage
   - Get your config from Project Settings > Your Apps

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase credentials in `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🏗️ Project Structure

```
proposal-platform/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Homepage
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   ├── create/
│   │   │   └── page.tsx      # Create proposal form
│   │   └── p/
│   │       └── [id]/
│   │           └── page.tsx  # View proposal page
│   ├── components/           # Reusable components
│   ├── lib/
│   │   ├── firebase.ts       # Firebase config
│   │   └── proposals.ts      # Proposal service
│   └── types/
│       └── proposal.ts       # TypeScript types
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
└── package.json
```

## 🎨 Proposal Types

| Type | Emoji | Tone | Animation |
|------|-------|------|-----------|
| Valentine | 💘 | Romantic, playful | Playful |
| Marriage | 💍 | Elegant, emotional | Elegant |
| Girlfriend | 💖 | Cute, modern | Cute |
| Boyfriend | 😌 | Casual, fun | Casual |

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Hosting**: Vercel (recommended)

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository to [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Firebase Rules

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /proposals/{proposalId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if false;
    }
  }
}
```

**Storage Rules** (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /proposals/{proposalId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 2 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 🧹 Cleanup Function

Set up a Cloud Function to auto-delete expired proposals:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.cleanupExpiredProposals = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const storage = admin.storage().bucket();
    const now = admin.firestore.Timestamp.now();
    
    const expired = await db.collection('proposals')
      .where('expiresAt', '<', now)
      .get();
    
    const batch = db.batch();
    
    for (const doc of expired.docs) {
      // Delete images
      const proposal = doc.data();
      for (const imageUrl of proposal.images || []) {
        try {
          const path = imageUrl.split('/o/')[1].split('?')[0];
          await storage.file(decodeURIComponent(path)).delete();
        } catch (e) {}
      }
      batch.delete(doc.ref);
    }
    
    await batch.commit();
    console.log(`Deleted ${expired.size} expired proposals`);
  });
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 💖 Acknowledgments

Made with love for lovers everywhere. 

---

**Free for everyone, forever.** 💕
