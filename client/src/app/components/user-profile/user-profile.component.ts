import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService, Post } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-profile-container">
      <div class="container">
        <div class="profile-header">
          <button class="back-btn" (click)="goBack()">
            <i class="fas fa-arrow-left"></i>
            Back to Feed
          </button>
        </div>
        
        <div class="profile-content" *ngIf="userProfile">
          <div class="profile-info">
            <div class="profile-avatar-section">
              <img 
                [src]="getImageUrl(userProfile.profilePicture)" 
                [alt]="userProfile.username"
                class="profile-avatar"
              >
            </div>
            
            <div class="profile-details">
              <h1>{{ userProfile.username }}</h1>
              <p class="join-date" *ngIf="userProfile.joinDate">
                <i class="fas fa-calendar"></i>
                Joined {{ formatDate(userProfile.joinDate) }}
              </p>
              <p class="bio" *ngIf="userProfile.bio">{{ userProfile.bio }}</p>
              <div class="profile-stats">
                <div class="stat">
                  <span class="stat-number">{{ userPosts.length }}</span>
                  <span class="stat-label">Posts</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ totalLikes }}</span>
                  <span class="stat-label">Total Likes</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="posts-section">
            <h2>{{ userProfile.username }}'s Posts</h2>
            
            <div class="loading" *ngIf="isLoading">
              <div class="spinner"></div>
              <p>Loading posts...</p>
            </div>
            
            <div class="posts-grid" *ngIf="!isLoading && userPosts.length > 0">
              <div class="post-card" *ngFor="let post of userPosts" (click)="viewPost(post)">
                <img [src]="getImageUrl(post.imageUrl)" [alt]="post.caption" class="post-thumbnail">
                <div class="post-overlay">
                  <div class="post-stats">
                    <span><i class="fas fa-heart"></i> {{ post.likes.length }}</span>
                    <span><i class="fas fa-comment"></i> {{ post.comments.length }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="empty-state" *ngIf="!isLoading && userPosts.length === 0">
              <i class="fas fa-car"></i>
              <h3>No posts yet</h3>
              <p>{{ userProfile.username }} hasn't shared any car photos yet.</p>
            </div>
          </div>
        </div>
        
        <div class="loading" *ngIf="!userProfile && !isLoading">
          <div class="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-profile-container {
      padding: 40px 0;
    }
    
    .profile-header {
      margin-bottom: 30px;
    }
    
    .back-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background-color 0.3s ease;
    }
    
    .back-btn:hover {
      background: #5a6268;
    }
    
    .profile-content {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .profile-info {
      display: flex;
      align-items: center;
      gap: 30px;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid #eee;
    }
    
    .profile-avatar-section {
      flex-shrink: 0;
    }
    
    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #e74c3c;
    }
    
    .profile-details {
      flex: 1;
    }
    
    .profile-details h1 {
      font-size: 32px;
      color: #333;
      margin-bottom: 10px;
    }
    
    .join-date {
      color: #666;
      font-size: 16px;
      margin-bottom: 15px;
    }
    
    .join-date i {
      margin-right: 8px;
    }
    
    .bio {
      color: #555;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    
    .profile-stats {
      display: flex;
      gap: 30px;
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-number {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #e74c3c;
    }
    
    .stat-label {
      font-size: 14px;
      color: #666;
    }
    
    .posts-section h2 {
      font-size: 24px;
      color: #333;
      margin-bottom: 30px;
    }
    
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .post-card {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .post-card:hover {
      transform: translateY(-5px);
    }
    
    .post-thumbnail {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    
    .post-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .post-card:hover .post-overlay {
      opacity: 1;
    }
    
    .post-stats {
      color: white;
      display: flex;
      gap: 20px;
    }
    
    .post-stats span {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 16px;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    
    .empty-state i {
      font-size: 48px;
      color: #e74c3c;
      margin-bottom: 20px;
    }
    
    .empty-state h3 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    
    .loading {
      text-align: center;
      padding: 60px 20px;
    }
    
    .loading p {
      margin-top: 20px;
      color: #666;
    }
    
    @media (max-width: 768px) {
      .profile-info {
        flex-direction: column;
        text-align: center;
      }
      
      .profile-avatar {
        width: 100px;
        height: 100px;
      }
      
      .profile-details h1 {
        font-size: 28px;
      }
      
      .posts-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  userProfile: any = null;
  userPosts: Post[] = [];
  isLoading = true;
  totalLikes = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.loadUserProfile(userId);
        this.loadUserPosts(userId);
      }
    });
  }

  loadUserProfile(userId: string): void {
    // For now, we'll get user info from posts
    // In a real app, you'd have a separate user endpoint
    this.userProfile = {
      id: userId,
      username: 'Loading...',
      profilePicture: null,
      joinDate: null,
      bio: null
    };
  }

  loadUserPosts(userId: string): void {
    this.postService.getUserPosts(parseInt(userId)).subscribe({
      next: (posts: Post[]) => {
        this.userPosts = posts;
        this.totalLikes = posts.reduce((total, post) => total + post.likes.length, 0);
        
        // Extract user info from the first post
        if (posts.length > 0) {
          this.userProfile = {
            id: userId,
            username: posts[0].userId.username,
            profilePicture: posts[0].userId.profilePicture,
            joinDate: posts[0].createdAt, // Approximate join date
            bio: null // Bio is not available in the current structure
          };
        }
        
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user posts:', error);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/default-avatar.svg';
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:5000${imageUrl}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  viewPost(post: Post): void {
    // For now, just go back to feed
    // In a real app, you might have a detailed post view
    this.router.navigate(['/feed']);
  }

  goBack(): void {
    this.router.navigate(['/feed']);
  }
}
