# 💬 Chattrix  
🚀 **A modern chat application with authentication, real-time updates, and a seamless user experience.**  

---

## 🌟 Features  

| Feature                    | Description |
|----------------------------|-------------|
| 🔑 **User Authentication**   | Secure authentication via Firebase. |
| 💬 **Real-time Messaging**    | Instant communication using WebSockets. |
| 🔗 **Deep Linking**           | Implemented using **Expo Linking**. |
| ☁️ **File Uploads to AWS S3** | Secure file storage with signed URLs. |
| 🔔 **Push Notifications**     | Welcome notification when a user logs in. |
| 🖼 **User Profiles**          | Manage and update user details. |

---

## ⚡ Tech Stack  

- **Language**: TypeScript   
- **Database**: Firebase Firestore  
- **Storage**: AWS S3  
- **Notifications**: Firebase Cloud Messaging (FCM)  
- **Deep Linking**: Expo Linking  

---

## 🔧 Setup Instructions  

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/yourusername/Chattrix.git
   cd Chattrix
   ```

2. **Install dependencies**:  
   ```bash
   npm install
   ```

3. **Set up environment variables** in a `.env` file in the root of the project:  
   ```env
   S3_UPLOAD_URL=<Your S3 Upload URL>
   S3_SIGNED_URL=<Your S3 Signed URL>
   ```

4. **Run the project**:  
   - **Development**:  
     ```bash
     npm run android:dev
     ```
   - **Development Release**:  
     ```bash
     npm run android:dev-release
     ```
   - **Staging**:  
     ```bash
     npm run android:staging
     ```
   - **Staging Release**:  
     ```bash
     npm run android:staging-release
     ```
   - **Beta**:  
     ```bash
     npm run android:beta
     ```
   - **Beta Release**:  
     ```bash
     npm run android:beta-release
     ```
   - **Production**:  
     ```bash
     npm run android:prod
     ```
   - **Production Release**:  
     ```bash
     npm run android:prod-release
     ```

---

## 🌍 Environment Setup  
Chattrix supports multiple environments with different flavors:  
| Environment | Command | Description |
|------------|---------|-------------|
| **Development** | `npm run android:dev` / `npm run android:dev-release` | For local development and testing |
| **Staging** | `npm run android:staging` / `npm run android:staging-release` | For pre-production testing |
| **Beta** | `npm run android:beta` / `npm run android:beta-release` | For beta testing |
| **Production** | `npm run android:prod` / `npm run android:prod-release` | For live production deployment |

---

