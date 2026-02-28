# User Profile and Settings - Firestore Integration

This implementation provides a complete user profile management system integrated with Firebase Firestore.

## Features

### Profile Management
- **Personal Information**: Update display name, email, and bio
- **Real-time Updates**: Changes are saved to Firestore and reflected immediately
- **Form Validation**: Client-side validation using Zod schemas

### Security
- **Password Changes**: Secure password updates with re-authentication
- **Two-Factor Authentication**: Setup options for SMS and authenticator apps (UI ready)
- **Active Sessions**: View and manage active sessions

### Preferences
- **Theme Settings**: Light, dark, or system theme preference
- **Language Selection**: Multi-language support
- **Regional Settings**: Timezone and currency preferences
- **Notifications**: Granular control over email alerts, trade alerts, etc.
- **UI Preferences**: Compact mode and animations toggles

## Firestore Structure

User profiles are stored in Firestore with the following structure:

```typescript
interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  bio?: string;
  photoURL?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    timezone?: string;
    currency?: string;
    notifications?: {
      email?: boolean;
      tradeAlerts?: boolean;
      weeklyUpdates?: boolean;
      securityAlerts?: boolean;
    };
    compactMode?: boolean;
    animations?: boolean;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
```

## Key Files

- `src/lib/firestore-service.ts`: Core Firestore operations
- `src/app/settings/page.tsx`: Settings UI component
- `src/app/api/user/profile/route.ts`: API endpoints for profile operations
- `src/store/auth-store.ts`: Auth state management with profile initialization

## Usage

### Auto-initialization
User profiles are automatically created when users sign up or sign in for the first time.

### Manual Updates
The settings page provides forms for updating:
1. Profile information (name, email, bio)
2. Password changes
3. Preferences (theme, notifications, etc.)

### API Integration
RESTful endpoints are available for profile management:
- `GET /api/user/profile?uid=USER_ID`: Fetch user profile
- `POST /api/user/profile`: Update user profile

## Error Handling

The implementation includes comprehensive error handling:
- Form validation errors
- Firestore operation errors  
- Authentication errors
- Network connectivity issues

All errors are displayed via toast notifications for better user experience.

## Security Considerations

- Profile updates require user authentication
- Password changes require re-authentication with current password
- Email changes require verification (Firebase Auth handles this)
- All Firestore operations use security rules (configure in Firebase console)

## Future Enhancements

- Profile photo upload to Firebase Storage
- Email verification status tracking
- Account deletion functionality
- Data export capabilities
- Audit log for security-sensitive changes