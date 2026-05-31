# Firestore Database Schema Design

This document details the NoSQL Firestore collections and document structures for the **Jatashankar** educational healthcare application.

---

## 1. `users` Collection
Stores user profiles, access controls, and authentication metadata.

```typescript
// Path: /users/{userId}
interface UserDocument {
  uid: string;                 // Matches Firebase Authentication UID
  email: string;
  displayName: string;
  photoURL: string | null;
  role: 'student' | 'instructor' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'active' | 'suspended';
}
```

### Subcollections
#### `enrollments` (Path: `/users/{userId}/enrollments/{courseId}`)
Stores course registration records and educational progress tracking.
```typescript
interface EnrollmentDocument {
  courseId: string;
  enrolledAt: Timestamp;
  completedAt: Timestamp | null;
  progressPercentage: number;   // 0 - 100
  completedLessons: string[];   // Array of lesson IDs
}
```

---

## 2. `courses` Collection
Contains educational modules, medical training courses, and healthcare materials.

```typescript
// Path: /courses/{courseId}
interface CourseDocument {
  id: string;
  title: string;
  subtitle: string;
  description: string;          // Rich text / Markdown content
  thumbnailURL: string;
  instructorId: string;         // References /users/{userId} (instructor)
  price: number;                // Free = 0
  status: 'draft' | 'published' | 'archived';
  category: string;             // e.g. "Cardiology", "First Aid", "Wellness"
  rating: {
    average: number;
    count: number;
  };
  lessons: Lesson[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoURL: string | null;
  contentMarkdown: string | null;
  order: number;
}
```

---

## 3. `articles` Collection
Stores medical articles, health news, and educational blog posts. Medical accuracy is vital, so articles contain metadata on clinical verification.

```typescript
// Path: /articles/{articleId}
interface ArticleDocument {
  id: string;
  title: string;
  excerpt: string;
  bodyMarkdown: string;
  coverImageURL: string;
  authorId: string;             // References /users/{userId}
  verifiedBy: string | null;    // References /users/{userId} (admin or medical doctor)
  verificationDate: Timestamp | null;
  tags: string[];               // e.g. ["Nutrition", "Heart Health"]
  views: number;
  status: 'draft' | 'published';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 4. `admins` Collection
A whitelist collection used by security rules to grant system privileges.

```typescript
// Path: /admins/{userId}
interface AdminDocument {
  uid: string;
  email: string;
  assignedBy: string;           // UID of the admin who created this entry
  assignedAt: Timestamp;
}
```
